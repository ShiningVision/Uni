#!/bin/bash
#SBATCH -N1
#SBATCH --ntasks 8
mpirun ./a2 --m 1000 --n 1000 --epsilon 0.001 --max-iterations 1000