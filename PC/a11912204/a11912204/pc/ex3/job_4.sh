#!/bin/bash
#SBATCH -N 4
#SBATCH --ntasks 4
mpirun --report-bindings ./a3-mpi