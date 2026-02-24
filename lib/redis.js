const { Redis } = require("@upstash/redis");
const CONFIG = require("./config");

if (!CONFIG.REDIS.URL || !CONFIG.REDIS.TOKEN) {
  throw new Error("Redis environment variables are missing");
}

const redis = new Redis({
  url: CONFIG.REDIS.URL,
  token: CONFIG.REDIS.TOKEN
});

module.exports = { redis };