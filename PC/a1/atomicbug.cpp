#include <iostream>
#include <thread>
#include <random>
#include <chrono>
#include <complex>
#include <sstream>
#include <string>
#include <fstream>
#include <iomanip>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <atomic>
#include <future>

#include "a1-helpers.hpp"

template <typename T>
class SafeQ
{
private:
    std::queue<T> q; // no other data structures are allowed
    // extend as needed
    std::atomic_flag flag = ATOMIC_FLAG_INIT;
public:
    void push(T value)
    {
        // synchronization needed?
        while (flag.test_and_set(std::memory_order_acquire)) {}
        q.push(value);
        flag.clear(std::memory_order_release);
    }

    void pop(T &value)
    {
        // todo: 
        // in a thread-safe way take the front element
        // and pop it from the queue
        // multiple consumers may be accessing this method

        // if not empty, remove the element from the queue
        while (flag.test_and_set(std::memory_order_acquire)) {}
        if (!q.empty())
        {

            int value = q.front();
            q.pop();
        }
        flag.clear(std::memory_order_release);
    }

    std::shared_ptr<T> wait_and_pop()
    {
        // todo: 
        // in a thread-safe way take the front element
        // and pop it from the queue
        // multiple consumers may be accessing this method

        if ( !q.empty() ){
            std::shared_ptr<T> res_ptr (std::make_shared<T>(q.front()));
            q.pop();
            return res_ptr;
        }
        return nullptr;
    }

    size_t size()
    {
        // synchronization needed?
        return q.size();
    }

    bool empty()
    {
        // synchronization needed?
        return q.empty();
    }
};

/**
 * To be executed by the master thread
 * The function reads numbers from the file
 * and puts them into the given queue
 * 
 * @param[in] filename
 * @param[inout] q
 * @returns The number of produced items
 * 
*/
int producer(std::string filename, SafeQ<int> &q)
{
    int produced_count = 0;

    // while there are entries in the file
    // put numbers into the queue "q"
    std::ifstream ifs(filename);

    while (!ifs.eof()) {
        int num;
        ifs >> num;
        q.push(num);
        produced_count++;
    }

    ifs.close();
  
    return produced_count;
}

/**
 * To be executed by worker threads
 * The function removes a number from the queue "q"
 * and does the processing
 * Implement 2 versions with atomic and with mutexes
 * extend as needed
 * 
 * @param[inout] q
 * @param[inout] primes
 * @param[inout] nonprimes
 * @param[inout] mean
 * @param[inout] number_counts
 * 
*/
void worker(SafeQ<int> &q, std::atomic<int> &primes, std::atomic<int> &nonprimes, std::atomic<double> &sum, std::atomic<int> &consumed_count, std::vector<std::atomic<int>> &number_counts)
{
    // implement: use synchronization
    // Note: This part may need some rearranging and rewriting
    // the while loop cannot just check for the size, 
    // it has to now wait until the next element can be popped,
    // or it has to terminate if producer has finished and the queue is empty.
    // This could be fully or partially implemented in the SafeQ

    while (q.size() > 0)
    {
        int num;
        q.pop(num);
        consumed_count++;
        if (kernel(num) == 1) {
          primes++;
        } else {
          nonprimes++;
        }
        number_counts[num%10]++;
        for (double g = sum; !sum.compare_exchange_weak(g, g + num););
    }
    
}

int main(int argc, char **argv)
{
    int num_threads = std::thread::hardware_concurrency(); // you can change this default to std::thread::hardware_concurrency()
    bool no_exec_times = false, only_exec_times = false;; // reporting of time measurements
    std::string filename = "input.txt";
    parse_args(argc, argv, num_threads, filename, no_exec_times, only_exec_times);

    // The actuall code
    std::atomic<int> primes(0), nonprimes(0), count(0);
    std::atomic<int> consumed_count(0);
    
    std::atomic<double> mean(0.0), sum (0.0);
    // vector for storing numbers ending with different digits (0-9)
    std::vector<std::atomic<int>> atomic_numbers(10);
    for (int i = 0; i < atomic_numbers.size(); i++)
    {
        atomic_numbers[i] = 0;
    }
    
    // Queue that needs to be made safe 
    // In the simple form it takes integers 
    SafeQ<int> q;
    
    // put you worker threads here
    std::vector<std::thread> workers;
    
    // time measurement
    auto t1 =  std::chrono::high_resolution_clock::now();
    
    // implement: call the producer function with futures/async 
    int produced_count = producer(filename, q);
    //std::future<int> produced_count_mutex = std::async(std::launch::async, [&filename, &q]() {return producer(filename, q); });
    // implement: spawn worker threads - transform to spawn num_threads threads and store in the "workers" vector

    for (int i=0;i<num_threads;++i) {
        //worker(q, primes, nonprimes, sum, consumed_count, number_counts); 
        // imlpement: switch the line above with something like: 
        // workers.push_back(thread(worker,...));
        workers.push_back(std::thread(worker, std::ref(q), std::ref(primes), std::ref(nonprimes), std::ref(sum), std::ref(consumed_count) ,std::ref(atomic_numbers)));
    }
    for (auto& t : workers) t.join();
    
    
    mean = sum/consumed_count;
    // end time measurement
    auto t2 =  std::chrono::high_resolution_clock::now();

    // do not remove
    if ( produced_count != consumed_count ) {
         std::cout << "[error]: produced_count (" << produced_count << ") != consumed_count (" << consumed_count << ")." <<  std::endl;
    }

    std::vector<int> number_counts(10);

    for (int i = 0; i < atomic_numbers.size(); i++)
    {
		std::cout<<atomic_numbers.size();
        number_counts[i] = atomic_numbers[i].load();
    }
    
    // priting the results
    print_output(num_threads, primes, nonprimes, mean, number_counts, t1, t2, only_exec_times, no_exec_times);

    return 0;
}
