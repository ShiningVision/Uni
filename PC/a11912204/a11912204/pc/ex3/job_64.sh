#!/bin/bash
#SBATCH -N 6
#SBATCH --ntasks 64
mpirun --report-bindings ./a3-mpi