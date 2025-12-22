// utils/redisClient.js
const { createClient } = require("redis");
const redisURL = "rediss://default:AWkSAAIncDE2OGIwYTMyYzQyYTc0M2ZlYjMxZDNmYmNkNmJlOGUxY3AxMjY4OTg@advanced-swift-26898.upstash.io:6379"

const redisClient = createClient({ url: redisURL });

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
	try {
		await redisClient.connect();
		console.log("✅ Connected to Redis", redisURL);
		// Set a test key-value pair
		await redisClient.set("testKey", "testValue");
	} catch (err) {
		console.error("❌ Redis connection failed:", err);
	}
})();

module.exports = redisClient;
