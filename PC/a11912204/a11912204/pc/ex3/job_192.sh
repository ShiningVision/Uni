#!/bin/bash
#SBATCH -N 6
#SBATCH --ntasks 192
mpirun --report-bindings ./a3-mpi