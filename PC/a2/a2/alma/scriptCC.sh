#!/bin/bash
#SBATCH -N4
#SBATCH --ntasks 64
mpirun ./a2 --m 1152 --n 1152 --epsilon 0.001 --max-iterations 1000