const redis = require("./redis");
const { getTehranMidnight } = require("./time");

async function addHistory(asset, price) {
  const now = Date.now();
  await redis.zadd(`history:${asset}`, {
    score: now,
    member: JSON.stringify({ price, at: now })
  });
}

async function getTodayHistory(asset) {
  const start = getTehranMidnight();
  const end = Date.now();

  const result = await redis.zrange(
    `history:${asset}`,
    start,
    end,
    { byScore: true }
  );

  return result.map(item => JSON.parse(item));
}

module.exports = {
  addHistory,
  getTodayHistory
};