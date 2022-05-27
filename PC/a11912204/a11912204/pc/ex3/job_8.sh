#!/bin/bash
#SBATCH -N 4
#SBATCH --ntasks 8
mpirun --report-bindings ./a3-mpi