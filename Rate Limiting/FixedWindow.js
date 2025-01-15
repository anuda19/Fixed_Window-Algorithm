class FixedWindowRateLimiter {
    /**
     * Fixed Window algorithm for rate limiting.
     * 
     * @param {number} limit - Maximum allowed requests per window.
     * @param {number} windowMs - Duration of the time window in milliseconds.
     */
    constructor(limit, windowMs) {
        this.limit = limit;
        this.windowMs = windowMs;
        this.currentWindowStart = Date.now();
        this.requestCount = 0;
    }

    /**
     * Attempts to process a request.
     * 
     * @returns {boolean} True if allowed, false otherwise.
     */
    allowRequest() {
        const now = Date.now();

        // Reset the window if the time has expired
        if (now - this.currentWindowStart >= this.windowMs) {
            this.currentWindowStart = now;
            this.requestCount = 0;
        }

        if (this.requestCount < this.limit) {
            this.requestCount++;
            return true;
        }
        return false;
    }
}

function simulate(rateLimiter, requestIntervals, label) {
    console.log(`\nSimulation: ${label}`);
    let time = 0;

    requestIntervals.forEach(interval => {
        setTimeout(() => {
            const result = rateLimiter.allowRequest
                ? rateLimiter.allowRequest() // For Fixed Window
                : rateLimiter.consume(); // For Token Bucket
            console.log(`Time: ${time}s, Request ${result ? "allowed" : "denied"}`);
        }, interval * 1000);
        time += interval;
    });
}

const fixedWindow = new FixedWindowRateLimiter(10, 60000); // 10 requests per 1 minute
simulate(fixedWindow, [0, 1, 1, 1, 1, 3, 1], "Fixed Window Algorithm");