#include <iostream>
#include <fstream>
#include <vector>
#include <tuple>
#include <time.h>
#include <cmath>
#include <complex>
#include <chrono>
#include  <iomanip>
#include <mpi.h>
#include "a3-helpers.hpp"

using namespace std;

// A set of random gradients, adjusted for this mandelbrot algorithm
vector<gradient> gradients = {
    gradient({0, 0, 0}, {76, 57, 125}, 0.0, 0.010, 2000),
    gradient({76, 57, 125}, {255, 255, 255}, 0.010, 0.020, 2000),
    gradient({255, 255, 255}, {0, 0, 0}, 0.020, 0.050, 2000),
    gradient({0, 0, 0}, {0, 0, 0}, 0.050, 1.0, 2000) };

// Test if point c belongs to the Mandelbrot set
bool mandelbrot_kernel(complex<double> c, vector<int>& pixel)
{
    int max_iterations = 2048, iteration = 0;
    complex<double> z(0, 0);

    while (abs(z) <= 4 && (iteration < max_iterations))
    {
        z = z * z + c;
        iteration++;
    }

    double length = sqrt(z.real() * z.real() + z.imag() * z.imag());
    long double m = (iteration + 1 - log(length) / log(2.0));
    double q = m / (double)max_iterations;

    q = iteration + 1 - log(log(length)) / log(2.0);
    q /= max_iterations;

    colorize(pixel, q, iteration, gradients);

    return true;
}

/**
 * Compute the Mandelbrot set for each pixel of a given image.
 * Image is the Image data structure for storing RGB image
 * The default value for ratio is 0.15.
 *
 * @param[inout] image
 * @param[in] ratio
 *
*/
int mandelbrot(Image& image, double ratio = 0.15)
{
    int h = image.height;
    int w = image.width;
    int channels = image.channels;
    ratio /= 10.0;
    int pixels_inside = 0;
    // pixel to be passed to the mandelbrot function
    vector<int> pixel = { 0, 0, 0 }; // red, green, blue (each range 0-255)
    complex<double> c;

    // #pragma omp parallel for shared(h, w, channels, image) private(c) reduction(+:pixels_inside)  schedule(dynamic)
    for (int j = image.height_from; j < image.height_to; j++)
    {
        for (int i = 0; i < w; i++)
        {
            // TODO for MPI:
            // adjust i and j according to the rank
            // e.g.: (rank * (total_height / numprocs))
            // and h and w according to your data layout
            double dx = (double)i / (w)*ratio - 1.10;
            double dy = (double)j / (h) * 0.1 - 0.35;

            c = complex<double>(dx, dy);

            if (mandelbrot_kernel(c, pixel)) // the actual mandelbrot kernel
                pixels_inside++;

            // apply to the image
            for (int ch = 0; ch < channels; ch++)
                image(ch, j, i) = pixel[ch];
        }
    }
    int result = 0;
    MPI_Reduce(&pixels_inside, &result, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);
    return result;
}



void update(Image& src)
{
    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    MPI_Request _request[2];
    bool up = rank != 0;
    bool down = rank != size - 1;


    //receive
    if (up){
        MPI_Irecv(&src.buffer_top[0], src.buffer_size, MPI_UNSIGNED, rank - 1, 0, MPI_COMM_WORLD, &_request[0]); 
    }
    if (down){
        MPI_Irecv(&src.buffer_bottom[0], src.buffer_size, MPI_UNSIGNED, rank + 1, 1, MPI_COMM_WORLD, &_request[1]);
    }

    //send
    if (down)
    {
        int from = src.height_to - src.half_kernel_size;
        int send_index = ((from - src.height_from) * src.width) * src.channels;
        MPI_Send(&src.data[send_index], src.buffer_size, MPI_UNSIGNED, rank + 1, 0, MPI_COMM_WORLD);
    }
    if (up)
    {
        MPI_Send(&src.data[0], src.buffer_size, MPI_UNSIGNED, rank -1, 1, MPI_COMM_WORLD);
    }

    //update image data
    if (down)
    {
        MPI_Wait(&_request[1], MPI_STATUS_IGNORE);
    }
    if (up)
    {
        MPI_Wait(&_request[0], MPI_STATUS_IGNORE);
    }

}



/**
 * 2D Convolution
 * src is the source Image to which we apply the filter.
 * Resulting image is saved in dst. The size of the kernel is
 * given with kernel_width (must be odd number). Sigma represents
 * the standard deviation of the filter. The number of iterations
 * is given with the nstep (default=1)
 *
 * @param[in] src
 * @param[out] dst
 * @param[in] kernel_width
 * @param[in] sigma
 * @param[in] nsteps
 *
*/
void convolution_2d(Image& src, Image& dst, int kernel_width, double sigma, int nsteps = 1)
{

    int channels = src.channels;
    int h = src.height;
    int w = src.width;
    
    


    std::vector<std::vector<double>> kernel = get_2d_kernel(kernel_width, kernel_width, sigma);

    

    int displ = (kernel.size() / 2); // height==width!
    src.assign_kernel(kernel_width);
    dst.assign_kernel(kernel_width);

    update(src);

	for (int step = 0; step < nsteps; step++)
	{
		for (int ch = 0; ch < channels; ch++)
		{
			for (int i = src.height_from; i < src.height_to; i++)
			{
				for (int j = 0; j < w; j++)
				{
					double val = 0.0;

					for (int k = -displ; k <= displ; k++)
					{
						for (int l = -displ; l <= displ; l++)
						{
							int cy = i + k;
							int cx = j + l;
							int src_val = 0;

							// if it goes outside we disregard that value  
							if (cx < 0 || cx > w - 1 || cy < 0 || cy > h - 1) {
								continue;
							}
							else {
								src_val = src(ch, cy, cx);
							}

							val += kernel[k + displ][l + displ] * src_val;
						}
					}
					dst(ch, i, j) = (int)(val > 255 ? 255 : (val < 0 ? 0 : val));
				}
			}
		}

		if (step < nsteps - 1) {
			// swap references
			// we can reuse the src buffer for this example
			Image tmp = src; src = dst; dst = tmp;
			update(src);
		}
	}
    

}

int main(int argc, char** argv)
{


    

    MPI_Init(NULL, NULL);
    int size, rank;
    
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    if(rank==0)
        cout << "MPI_COMM_WORLD-size: " << size << endl;


    // height and width of the output image
    // keep the height/width ratio for the same image
    //int width = 192, height = 128;
    //int width = 1200, height = 800;
    int width = 6144, height = 4096;
    double ratio = width / (double)height;
    
    double time;
    int i, j, pixels_inside = 0;

    int channels = 3; // red, green, blue
    // Generate Mandelbrot set in the following image
    // Allocate only the portion of the image needed for this process
    Image image(channels, height, width, rank, size);
    
    
    
    // Save the results of 2D convolution in this image
    Image filtered_image(channels, height, width, rank, size);


    //set the range for this process (work_distribution)
    
    //auto t1 = chrono::high_resolution_clock::now();
    double t1 = MPI_Wtime();
    //set the range for this process (work_distribution)
    // Generate the mandelbrot set 
    // adjust sizes according to your data layout
    pixels_inside = mandelbrot(image, ratio);
    double t2 = MPI_Wtime();
    //auto t2 = chrono::high_resolution_clock::now();

    if (rank == 0)
    {
        cout << "Image generation time (mandelbrot): " << chrono::duration<double>(t2 - t1).count() << endl;
        cout << "Total Mandelbrot pixels: " << pixels_inside << endl;
    }
    


    MPI_Barrier(MPI_COMM_WORLD); //Let all process start the next task at the same time so that the result may more precise
















    // Actual 3D convolution part
    // use MPI to implement a version for distributed system

    //auto t3 = chrono::high_resolution_clock::now(); // replace with MPI time

    double t3 = MPI_Wtime();
    convolution_2d(image, filtered_image, 5, 0.37, 18);
    double t4 = MPI_Wtime();
    //auto t4 = chrono::high_resolution_clock::now();

    cout << "Convolution time: " << chrono::duration<double>(t4 - t3).count() << endl;



    int work_size = height / size;
    int from = rank * work_size;
    int to = (rank + 1) * work_size;
    int currentRank = 0;
    std::ofstream ofs;
    while (currentRank != size)
    {
        if (rank == currentRank)
        {
            if (rank == 0)
            {
                ofs.open("mandelbrot.ppm", std::ofstream::out);
                ofs << "P3" << std::endl;
                ofs << width << " " << height << std::endl;
                ofs << 255 << std::endl;
            }
            else {
                ofs.open("mandelbrot.ppm", std::ios::app);
            }
            for (int j = from; j < to; j++)
            {
                for (int i = 0; i < width; i++)
                {

                    ofs << " " << filtered_image(0, j, i) << " " << filtered_image(1, j, i) << " " << filtered_image(2, j, i) << std::endl;
                }
            }
        }
        MPI_Barrier(MPI_COMM_WORLD);
        currentRank++;
    }
    ofs.close();




    MPI_Finalize();
    return 0;
}