#!/bin/bash
#SBATCH -N 6
#SBATCH --ntasks 16
mpirun --report-bindings ./a3-mpi