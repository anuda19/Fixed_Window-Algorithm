class SlidingWindowRateLimiter {
    /**
     * Sliding Window Counter algorithm for rate limiting.
     * 
     * @param {number} limit - Maximum allowed requests per window.
     * @param {number} windowMs - Duration of the time window in milliseconds.
     */
    constructor(limit, windowMs) {
        this.limit = limit;
        this.windowMs = windowMs;
        this.requests = []; // Stores timestamps of the requests
    }

    /**
     * Attempts to process a request.
     * 
     * @returns {boolean} True if the request is allowed, false otherwise.
     */
    allowRequest() {
        const now = Date.now();

        // Remove timestamps that are outside the current sliding window
        this.requests = this.requests.filter(timestamp => now - timestamp <= this.windowMs);

        if (this.requests.length < this.limit) {
            // Add the current request's timestamp
            this.requests.push(now);
            return true; // Request is allowed
        }

        return false; // Request is denied
    }
}

// Simulation Test Case
function simulate(rateLimiter, requestIntervals, label) {
    console.log(`\nSimulation: ${label}`);
    let time = 0;

    requestIntervals.forEach(interval => {
        setTimeout(() => {
            const result = rateLimiter.allowRequest();
            console.log(`Time: ${time}s, Request ${result ? "allowed" : "denied"}`);
        }, interval * 1000);
        time += interval;
    });
}

// Example: Simulate 10 requests per minute with sliding window
const slidingWindow = new SlidingWindowRateLimiter(10, 60000); // 10 requests per 60 seconds

simulate(
    slidingWindow,
    [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1], // Request at various intervals within and across the window
    "Sliding Window Counter Algorithm - 10 Requests Per Minute"
);
