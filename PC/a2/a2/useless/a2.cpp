#include <mpi.h>
#include <iostream>
#include <chrono>
#include <cmath>

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
    double* gatheredDiffnorms;
    double globalDiffnorm=0.0;

    /*I don't know what this would mean, so I just put this further up. Out of the MPI code*/
    // allocate another 2D array
    Mat U(M, N); // change: use local sizes with MPI, e.g., recalculate M and N
    Mat W(M, N); // change: use local sizes with MPI

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int root = 0;
    int workload = M / size;
    int start = workload * rank;
    int end = start + workload;
    int validStart = start;
    int validEnd = end;

    auto time_mpi_1 = MPI_Wtime(); // change to MPI_Wait
    
    int i, j;
    double diffnorm;
    int iteration_count = 0;
   
    /*This is where the matrices were declared*/
    

    if (rank == size - 1) {
        validEnd = M;
    }
    // Init & Boundary
    for (int i= start; i < validEnd; ++i) {
        for (j = 0; j < N; ++j) {
            U(i, j) = 0.0;
        }
    }

    if (rank == root) {
        for (j = 0; j < N; ++j) {
            U(M - 1, j) = 100.0;
        }
    }
    // End init
    MPI_Barrier(MPI_COMM_WORLD);
    iteration_count = 0;
    do
    {
        

        /* Compute new values (but not on boundary) */
        iteration_count++;
        diffnorm = 0.0;

        if (start == 0) {
            validStart = 1;
        }

        if (rank == size - 1) {
            validEnd = M - 1;
        }

        for (i = validStart; i < validEnd; ++i)
        {
            for (j = 1; j < N - 1; ++j)
            {
                W(i, j) = (U(i, j + 1) + U(i, j - 1) + U(i + 1, j) + U(i - 1, j)) * 0.25;
                diffnorm += (W(i, j) - U(i, j)) * (W(i, j) - U(i, j));
            }
        }

        //TODO:wait till everyone finished
        MPI_Barrier(MPI_COMM_WORLD);

        // Only transfer the interior points
        for (i = validStart; i < validEnd; ++i)
            for (j = 1; j < N - 1; ++j)
                U(i, j) = W(i, j);

        MPI_Gather(&diffnorm, 1, MPI_DOUBLE, &gatheredDiffnorms, 1, MPI_DOUBLE, root, MPI_COMM_WORLD);
        if (rank==root) {
            diffnorm = 0.0;//rank 0 also sent his diffnorm to gatheredDiffnorms I think. So I have to reset it here.
            for (int i = 0; i < sizeof(gatheredDiffnorms); i++) {
                diffnorm += gatheredDiffnorms[i];
            }
        }

       // MPI_Allreduce(&diffnorm, &diffnorm, 1, MPI_DOUBLE, MPI_SUM, MPI_COMM_WORLD);//alternative to MPI_Gather
        //diffnorm=sqrt(diffnorm);
        if (rank == root) {
            globalDiffnorm = sqrt(diffnorm);
        }
        MPI_Barrier(MPI_COMM_WORLD);//only needed for MPI_Gather
        
        printf("At iteration %d, diff is %f \n", iteration_count, diffnorm); // checks
    } while (epsilon <= globalDiffnorm && iteration_count < max_iterations);

    
    auto time_mpi_2 = MPI_Wtime(); // change to MPI_Wait
    MPI_Finalize();
    // TODO for MPI: collect all local parts of the U matrix, and save it to another "big" matrix
    // that has the same size as the U_sequential matrix (see below), then verify the results below
    
    /* END: the main part of the code that needs to use MPI */

    // verification     
    Mat U_sequential(M, N); // init another matrix for the verification

    // start time measurement for the sequential version
    auto ts_1 = chrono::high_resolution_clock::now();
    heat2d_sequential(max_iterations, epsilon, U_sequential, iteration_count); 
    auto ts_2 = chrono::high_resolution_clock::now();

    // print time measurements
    cout << "Computed (MPI) in " << iteration_count << " iterations and " << chrono::duration<double>(time_mpi_2 - time_mpi_1).count() << " seconds." << endl;
    cout << "Computed (sequential) in " << iteration_count << " iterations and " << chrono::duration<double>(ts_2 - ts_1).count() << " seconds." << endl;

    // TODO: Here we need both results - from the sequential (U_sequential) and also from the MPI version. Then we compare them with the verify() function 
    cout << "Verification: " << ( verify(U, U_sequential) ? "OK" : "NOT OK") << std::endl;

    // save_to_disk(U_sequential, "heat2d.txt");

    return 0;
}