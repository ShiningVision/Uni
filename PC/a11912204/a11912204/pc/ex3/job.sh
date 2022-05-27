#!/bin/bash
#SBATCH -N 2
#SBATCH --ntasks 2
mpirun --report-bindings ./a3-mpi