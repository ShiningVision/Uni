/**
 *   This file contains a set of helper function. 
 *   Comment: You probably do need to change any of these.
*/
#include <vector>

/**
 * Image data structure
 * 3D => (rgb-rcolor, y-dim, x-dim)
 * Init:
 *   Image image(3, 800, 600);

 * Access first color (red) of a pixel at position (34, 53):
 *  image(0,34,53)
*/
struct Image {
    std::vector<unsigned int> data;
    std::vector<unsigned int> buffer_top;
    std::vector<unsigned int> buffer_bottom;
    int height;
    int width;
    int channels;
    int half_kernel_size;
    int buffer_size;
    int height_from;
    int height_to;
    int work_size;
    int height_distance;
    Image();

    Image(int channels, int height, int width)
        : channels(channels), height(height), width(width), data(channels* height* width)
    {  height_from = 0; height_to = height;  }

    Image(int channels, int height, int width, int rank, int size)
        : channels(channels), height(height), width(width)
    {
        this->work_size = height / size;
        this->height_from = rank * work_size;
        this->height_to = (rank + 1) * work_size;
        this->height_distance = height_to - height_from;
        data.resize(channels * height_distance * width);
    }

    unsigned int& operator()(int c, int h, int w) {
        if (h < height_from)
        {
            return buffer_top[((-height_from + half_kernel_size + h) * width + w) * channels + c];
        }
        if (h >= height_to)
        {
            return buffer_bottom[((h - height_to) * width + w) * channels + c];
        }
        //ORIGINAL: (c*height + h)*width + w
        //CORRECT reordering for 1 process: [(h * width + w) * channels + c]
        return data[((h-height_from) * width + w) * channels + c];
        
    }

    void assign_kernel(int kernel_size)
    {
        this->half_kernel_size = kernel_size / 2;
        this->buffer_size = half_kernel_size * width * channels;
        if (height_from != 0)
        {
            buffer_top.resize(buffer_size);
        }
        if (height_to != height)
        {
            buffer_bottom.resize(buffer_size);
        }
    }
};



/**
 * Helper struct for describing an RGB color gradient between to colors (color_x and color_y),
 *  the interpolated range it maps to in the mandelbrot set, 
 *  and the number of steps (steps)
*/
struct gradient {
    std::vector<int> color_x;
    std::vector<int> color_y;
    double range_start;
    double range_end;
    int steps;

    gradient(std::vector<int> color_x, std::vector<int> color_y, double range_start, double range_end, int steps) {
        this->color_x = color_x;
        this->color_y = color_y;
        this->range_start = range_start;
        this->range_end = range_end;
        this->steps = steps;
    };
};


/**
 * Color interpolation, for a given input it will return 
 * a gradient color found at position (pos) 
 * between two given colors (color_x and color_y).
 * @param[in] pos
 * @param[in] color_x
 * @param[in] color_y
*/

std::vector<int> interpolate_rgb_color( int pos, std::vector<int> color_x, std::vector<int> color_y, int steps) {
    double factor = 1.0/(double)(steps-1);

    std::vector<int> color = { color_x[0], color_x[1], color_x[2] };
    
    for (int i = 0; i < 3; i++ ) {
        color[i] = round(color[i] + (pos*factor)* (color_y[i] - color_x[i]));
        if ( color[i] > 255 ) color[i] = 255;
    }

    return color;
};

/**
 * Assign an RGB color value to a given pixel (pixel), 
 * that is based on a value (q) computed from the mandelbrot set
 * a gradient is constructed based on the number of steps n and gradients array
 * @param[inout] pixel
 * @param[in] q
 * @param[in] n
 * @param[in] gradients
*/
void colorize (std::vector<int>& pixel, double q, int n, std::vector<gradient> gradients) {
    // if ( q < 0 ) {cout << "negative!" << endl; exit(-1);}
    int pos = 0;

    // int num_colors = 512;
    bool in_range = false;
    for ( auto& g: gradients ) {
        if ( q > g.range_start && q <= g.range_end) {
            in_range = true;
            double t = ((q-g.range_start) / (g.range_end-g.range_start)) * (double)g.steps; 
            pixel = interpolate_rgb_color(  (int)t, g.color_x, g.color_y, g.steps );
        } 
    }

    if ( in_range == false ) {
        pixel = {0,0,0};
    }
    
};


/**
 *   Compute 2D gaussian filter kernel, for the given 
 *   height (h), width (w) and std deviation of the filter (sigma).
 *   @param[in] h 
 *   @param[in] w 
 *   @param[in] sigma 
*/
std::vector<std::vector<double>> get_2d_kernel(int h, int w, double sigma) {
    double sum = 0.0;
    int i, j;
    std::vector<std::vector<double>> kernel;

    kernel.resize(h); // // height==width! always

    // adjust 2D sizes
    for (int x = 0; x < h; ++x)
        kernel[x].resize(w);

    double s = 2 * sigma * sigma;
    int h2 = h/2, w2 = w/2;

    for (i = -h2; i <= h2; i++) {
        for (j = -w2; j <= w2; j++) {
            double r = sqrt (i * i + j * j);
            kernel[i+h2][j+w2] = exp(-(r*r) / s ) / ( M_PI * s);
            sum += kernel[i+h2][j+w2];
        }
    }

    // normalization
    for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
            kernel[i][j] /= sum;
        }
    }
    
    return kernel;
};