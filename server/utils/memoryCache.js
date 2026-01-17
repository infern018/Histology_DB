// utils/memoryCache.js

class MemoryCache {
    constructor() {
        this.cache = new Map();
    }

    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        // Expired?
        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return cached.value;
    }

    set(key, value, ttlSeconds = 60) {
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }

    del(key) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}

module.exports = new MemoryCache();
