#!/bin/bash
#SBATCH -N1
#SBATCH --ntasks 16
mpirun ./a2 --m 1152 --n 1152 --epsilon 0.001 --max-iterations 1000