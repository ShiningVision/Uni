#!/bin/bash
#SBATCH -N 6
#SBATCH --ntasks 128
mpirun --report-bindings ./a3-mpi