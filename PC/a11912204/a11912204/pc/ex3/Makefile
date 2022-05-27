##define programs
PRG=job.sh job_4.sh job_8.sh job_16.sh job_32.sh job_64.sh job_96.sh job_128.sh job_192.sh
eachPrg = $(foreach word,$(PRG), $(word))

all: compile
	
	
submit:
	sbatch job.sh
	sbatch job_4.sh
	sbatch job_8.sh
	sbatch job_16.sh
	sbatch job_32.sh
	sbatch job_64.sh
	sbatch job_96.sh
	sbatch job_128.sh
	sbatch job_192.sh
	
convert:
	@dos2unix $(eachPrg)
	
	
compile:
	mpic++ -o a3-mpi a3-mpi.cpp
	g++ -o a3-sequential -O2 a3-sequential.cpp
	

clean:
	rm -f $(PRG)