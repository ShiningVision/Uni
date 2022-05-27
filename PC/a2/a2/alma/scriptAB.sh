#!/bin/bash
#SBATCH -N2
#SBATCH --ntasks 32
mpirun ./a2 --m 2688 --n 4096 --epsilon 0.001 --max-iterations 1000