const { redis } = require("./redis");
const { getCurrentTimestamp, getTehranMidnightTimestamp } = require("./time");

async function storeTick(asset, price) {
  const key = `history:${asset}`;
  const timestamp = getCurrentTimestamp();

  await redis.zadd(key, {
    score: timestamp,
    member: JSON.stringify({ price, timestamp })
  });
}

async function getTodayHistory(asset) {
  const from = getTehranMidnightTimestamp();
  const to = getCurrentTimestamp();

  return redis.zrangebyscore(`history:${asset}`, from, to);
}

module.exports = {
  storeTick,
  getTodayHistory
};