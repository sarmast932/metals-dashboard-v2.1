const { getTodayHistory } = require("./history-service");

function buildMetrics(points) {
  if (!points || points.length === 0) {
    return null;
  }

  const parsed = points.map(p => JSON.parse(p));
  const prices = parsed.map(p => p.price);

  const open = prices[0];
  const close = prices[prices.length - 1];
  const high = Math.max(...prices);
  const low = Math.min(...prices);

  const change = close - open;
  const percent = (change / open) * 100;

  return {
    open,
    high,
    low,
    close,
    change,
    percent
  };
}

async function buildDailyReport(asset) {
  const history = await getTodayHistory(asset);
  return buildMetrics(history);
}

module.exports = {
  buildDailyReport
};