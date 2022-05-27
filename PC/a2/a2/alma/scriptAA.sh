#!/bin/bash
#SBATCH -N1
#SBATCH --ntasks 16
mpirun ./a2 --m 2688 --n 4096 --epsilon 0.001 --max-iterations 1000