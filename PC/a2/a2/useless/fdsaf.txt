#!/bin/bash
#SBATCH -N 1
#SBATCH --ntasks 16
mpirun ./a2 --m 12 --n 12 --epsilon 0.001 --max-iterations 1000