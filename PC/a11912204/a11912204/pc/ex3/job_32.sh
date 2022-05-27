#!/bin/bash
#SBATCH -N 6
#SBATCH --ntasks 32
mpirun --report-bindings ./a3-mpi