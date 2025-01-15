class LeakyBucket {
    /**
     * Leaky Bucket algorithm for rate limiting.
     * 
     * @param {number} capacity - Maximum bucket size (queue limit).
     * @param {number} leakRate - Rate at which requests leak out (processed) per second.
     */
    constructor(capacity, leakRate) {
        this.capacity = capacity;
        this.leakRate = leakRate;
        this.queue = 0; // Number of requests in the bucket
        this.lastLeakTime = Date.now();
    }

    /**
     * Refills the bucket by leaking requests based on the elapsed time.
     */
    leak() {
        const now = Date.now();
        const elapsed = (now - this.lastLeakTime) / 1000; // Convert to seconds
        const leaked = elapsed * this.leakRate;

        this.queue = Math.max(0, this.queue - leaked); // Reduce the queue by leaked amount
        this.lastLeakTime = now;
    }

    /**
     * Attempts to process a request.
     * 
     * @returns {boolean} True if allowed, false otherwise.
     */
    allowRequest() {
        this.leak();

        if (this.queue < this.capacity) {
            this.queue++;
            return true;
        }
        return false;
    }
}

function simulate(rateLimiter, requestIntervals, label) {
    console.log(`\nSimulation: ${label}`);
    let time = 0;

    requestIntervals.forEach((interval, index) => {
        setTimeout(() => {
            const result = rateLimiter.allowRequest
                ? rateLimiter.allowRequest() // Fixed Window, Sliding Window, Leaky Bucket
                : rateLimiter.consume();    // Token Bucket
            console.log(`Time: ${time}s, Request ${result ? "allowed" : "denied"}`);
        }, interval * 1000);
        time += interval;
    });
}

// Test Cases
const requestPatterns = [0, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1]; // Request intervals in seconds

// Leaky Bucket: Capacity 5, leak rate 1 request per second
const leakyBucket = new LeakyBucket(5, 1);
simulate(leakyBucket, requestPatterns, "Leaky Bucket Rate Limiter");
