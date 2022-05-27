#!/bin/bash
#SBATCH -N1
#SBATCH --ntasks 8
mpirun ./a2 --m 300 --n 300 --epsilon 0.001 --max-iterations 1000