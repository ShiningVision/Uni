#!/bin/bash
#SBATCH -N4
#SBATCH --ntasks 64
mpirun  ./a2 --m 2688 --n 4096 --epsilon 0.001 --max-iterations 2000