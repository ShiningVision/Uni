#!/bin/bash
#SBATCH -N6
#SBATCH --ntasks 96
mpirun ./a2 --m 2688 --n 4096 --epsilon 0.001 --max-iterations 1000