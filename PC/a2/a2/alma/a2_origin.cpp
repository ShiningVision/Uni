
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
    auto time_mpi_1 = chrono::high_resolution_clock::now(); // change to MPI_Wait
    
    int i, j;
    double diffnorm;
    int iteration_count = 0;

    // allocate another 2D array
    Mat U(M, N); // change: use local sizes with MPI, e.g., recalculate M and N
    Mat W(M, N); // change: use local sizes with MPI

    // Init & Boundary
    for (i = 0; i < M; ++i) {
        for (j = 0; j < N; ++j) {
            U(i, j) = 0.0;
        }
    }

    for (j = 0; j < N; ++j) {
        U(M - 1, j) = 100.0;
    }
    // End init

    iteration_count = 0;
    do
    {
        /* Compute new values (but not on boundary) */
        iteration_count++;
        diffnorm = 0.0;

        for (i = 1; i < M - 1; ++i)
        {
            for (j = 1; j < N - 1; ++j)
            {
                W(i, j) = (U(i, j + 1) + U(i, j - 1) + U(i + 1, j) + U(i - 1, j)) * 0.25;
                diffnorm += (W(i, j) - U(i, j)) * (W(i, j) - U(i, j));
            }
        }

        // Only transfer the interior points
        for (i = 1; i < M - 1; ++i)
            for (j = 1; j < N - 1; ++j)
                U(i, j) = W(i, j);

        diffnorm = sqrt(diffnorm);
        // printf("At iteration %d, diff is %f \n", iteration_count, diffnorm); // checks
    } while (epsilon <= diffnorm && iteration_count < max_iterations);

    auto time_mpi_2 = chrono::high_resolution_clock::now(); // change to MPI_Wait

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