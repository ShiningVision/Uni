#!/bin/bash
#SBATCH -N 6
#SBATCH --ntasks 96
mpirun --report-bindings ./a3-mpi