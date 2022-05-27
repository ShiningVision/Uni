#!/bin/bash
#SBATCH -N2
#SBATCH --ntasks 32
mpirun ./a2 --m 1152 --n 1152 --epsilon 0.001 --max-iterations 1000