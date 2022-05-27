#include <mpi.h>
#include <iostream>
#include <chrono>
#include <cmath>
#include <vector>

#include "a2-helpers.hpp"

using namespace std;

int main(int argc, char **argv)
{
    int max_iterations = 15000;
    double epsilon = 1.0e-3;

    // default values for M rows and N columns
    int N = 12;
    int M = 12;

    process_input(argc, argv, N, M, max_iterations, epsilon);
    /* START: the main part of the code that needs to use MPI 
    */

    int rank;
    int size;

    double globalDiffnorm=0.0;


    // allocate another 2D array
    

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int root = 0;
    int workload = M / size;
    int start = 0;
    if (rank == size - 1)workload = workload + M % size;//The last one takes on the undistributed work as well.
    int end = start + workload;
    int validStart = start;
    if (rank == 0)validStart = start + 1;//The first one needs to skip the first line.
    int validEnd = end;
    if (rank == size - 1)validEnd = end - 1;//The last one needs to skip the last line.

    auto time_mpi_1 = MPI_Wtime(); // change to MPI_Wait
    
    int i, j;
    double diffnorm;
    int iteration_count = 0;
   
    

    /*This is where the matrices used to be declared at*/
    int Usize = validEnd - validStart + 2;
    int Wsize = validEnd - validStart;
    Mat U(Usize, N); // change: use local sizes with MPI, e.g., recalculate M and N
    Mat W(Wsize, N); // change: use local sizes with MPI 
    Mat U_MPI(M, N);

    // Init & Boundary
    for (i= 0; i < Usize; ++i) {
        for (j = 0; j < N; ++j) {
            U(i, j) = 0.0;
        }
    }

    if (rank == size - 1) {
        for (j = 0; j < N; ++j) {
            U(Usize-1, j) = 100.0;
        }
    }


    for (i = 0; i < M; ++i) {
        for (j = 0; j < N; j++) {
            U_MPI(i, j) = 0.0;
        }
    }

    for (j = 0; j < N; ++j) {
        U_MPI(M - 1, j) = 100.0;
    }

    for (i = 0; i < Wsize; i++) {
        for (j = 0; j < N; j++) {
            W(i, j) = 0.0;
        }
    }
    // End init
    
  
    
    //needed for MPI_Gatherv:
    int *counts= new int [size];
    int *displacements=new int [size];
    for (int i = 0; i < size; i++) {
        displacements[i]=(i* (M/size) )*N;
        counts[i]=(M/size)*N;
    }
    displacements[0] = N;
    counts[0] = (counts[0] - N);
    counts[size - 1] = counts[size - 1] + M % size*N-N;
    
 
   
    iteration_count = 0;
    
 
    do
    {

       
        /* Compute new values (but not on boundary) */
        iteration_count++;
        diffnorm = 0.0;

        

        for (i = 1; i < Usize-1; ++i)
        {
            for (j = 1; j < N - 1; ++j)
            {
                int k = i-1;//W is now only a portion of U therefor k maps the i back to the rows of W.
                W(k, j) = (U(i, j + 1) + U(i, j - 1) + U(i + 1, j) + U(i - 1, j)) * 0.25;
                diffnorm += (W(k, j) - U(i, j)) * (W(k, j) - U(i, j));
                
            }
        }
        
       
        
     

        // Only transfer the interior points
        
        
        for (i = 1; i < Usize-1; ++i) {
            for (j = 1; j < N - 1; ++j) {
                int k = i - 1;
                U(i, j) = W(k, j);
            }
        }

        
        if (rank < size - 1) {
            MPI_Recv(&U(Usize - 1, 0), N, MPI_DOUBLE, rank + 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        }
        if (rank > 0) {
            MPI_Send(&W(0, 0), N, MPI_DOUBLE, (rank - 1), 0, MPI_COMM_WORLD);
        }

        if (rank > 0) {
            MPI_Recv(&U(0, 0), N, MPI_DOUBLE, (rank -1), 0, MPI_COMM_WORLD,MPI_STATUS_IGNORE);
        }
        if (rank < size - 1) {
            MPI_Send(&W(Wsize-1, 0), N, MPI_DOUBLE, rank + 1, 0, MPI_COMM_WORLD);
        }
        
        
   
      
        MPI_Allreduce(MPI_IN_PLACE,&diffnorm, 1, MPI_DOUBLE, MPI_SUM, MPI_COMM_WORLD);//alternative to MPI_Gather
        
        diffnorm=sqrt(diffnorm);
       
        

        
        
        //printf("Rank %d at iteration %d, diff is %f \n",rank, iteration_count, diffnorm); // checks
    } while (epsilon <= diffnorm && iteration_count < max_iterations);
    auto time_mpi_2 = MPI_Wtime(); // change to MPI_Wait
    /*
    if (rank == 0) {
        std::cout << "rank " << rank << " reports: " << "\n" << " counts: ";
        for (i = 0; i < size; i++)cout << counts[i] << " ";
        std::cout << "\n" << " displacements: ";
        for (i = 0; i < size; i++)cout << displacements[i] << " ";
        std::cout << "\n" << " sendcount: "<<Wsize*N<<"\n";
    }*/
    auto time_mpi_3 = MPI_Wtime(); // change to MPI_Wait
    if (rank == root) {
        MPI_Gatherv(&W(0, 0), Wsize * N, MPI_DOUBLE, &U_MPI(0, 0), counts, displacements, MPI_DOUBLE, root, MPI_COMM_WORLD);
    }
    if (rank != root) {
        MPI_Gatherv(&W(0, 0), Wsize* N, MPI_DOUBLE, NULL, NULL, NULL, MPI_DOUBLE, root, MPI_COMM_WORLD);
    }
    auto time_mpi_4 = MPI_Wtime(); // change to MPI_Wait
    
    // TODO for MPI: collect all local parts of the U matrix, and save it to another "big" matrix
    // that has the same size as the U_sequential matrix (see below), then verify the results below
    MPI_Finalize();
    /* END: the main part of the code that needs to use MPI */
    if (rank != root) {
        return 0;
    }
    // verification     
    Mat U_sequential(M, N); // init another matrix for the verification
    
    std::cout << "Computed (MPI) in " << iteration_count << " iterations and " << chrono::duration<double>(time_mpi_2 - time_mpi_1).count() << " seconds." << endl;
    std::cout << "Gathered (MPI) in " << iteration_count << " iterations and " << chrono::duration<double>(time_mpi_4 - time_mpi_3).count() << " seconds." << endl;
    // start time measurement for the sequential version
    auto ts_1 = chrono::high_resolution_clock::now();
    heat2d_sequential(max_iterations, epsilon, U_sequential, iteration_count); 
    auto ts_2 = chrono::high_resolution_clock::now();
    
    // print time measurements
    
    std::cout << "Computed (sequential) in " << iteration_count << " iterations and " << chrono::duration<double>(ts_2 - ts_1).count() << " seconds." << endl;
    double speedUp = chrono::duration<double>(ts_2 - ts_1).count() / chrono::duration<double>(time_mpi_2 - time_mpi_1).count();
    std::cout << "SpeedUp is: " << speedUp << "x" << endl;
  
    // TODO: Here we need both results - from the sequential (U_sequential) and also from the MPI version. Then we compare them with the verify() function 
    std::cout << "Verification: " << ( verify(U_MPI, U_sequential) ? "OK" : "NOT OK") << std::endl;

    //save_to_disk(U_MPI, "heat2dMPI.txt");
    //save_to_disk(U_sequential, "heat2d.txt");
    return 0;
}