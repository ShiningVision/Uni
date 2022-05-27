#!/bin/bash
#SBATCH -N 4
hostname
srun hostname
mpirun -np 8 --map-by node ./helloworld