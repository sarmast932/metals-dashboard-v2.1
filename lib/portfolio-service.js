const { redis } = require("./redis");
const { getMarketData } = require("./price-service");

const POSITIONS_KEY = "portfolio:positions";
const SETTINGS_KEY = "portfolio:settings";

async function addPosition(asset, quantity, entryPrice) {
  const id = Date.now().toString();

  const position = {
    id,
    asset,
    quantity: Number(quantity),
    entryPrice: Number(entryPrice),
    timestamp: Date.now()
  };

  await redis.hset(POSITIONS_KEY, {
    [id]: JSON.stringify(position)
  });

  return position;
}

async function deletePosition(id) {
  await redis.hdel(POSITIONS_KEY, id);
}

async function getPositions() {
  const data = await redis.hgetall(POSITIONS_KEY);
  if (!data) return [];

  return Object.values(data).map(p => JSON.parse(p));
}

async function getSettings() {
  const data = await redis.get(SETTINGS_KEY);
  if (!data) {
    return {
      profitThreshold: 5,
      lossThreshold: -5
    };
  }
  return JSON.parse(data);
}

async function updateSettings(profitThreshold, lossThreshold) {
  const settings = {
    profitThreshold: Number(profitThreshold),
    lossThreshold: Number(lossThreshold)
  };

  await redis.set(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}

async function calculatePortfolio() {
  const positions = await getPositions();
  const market = await getMarketData();

  let totalCapital = 0;
  let totalValue = 0;

  for (const pos of positions) {
    const currentPrice = market[pos.asset].price;

    const capital = pos.quantity * pos.entryPrice;
    const value = pos.quantity * currentPrice;

    totalCapital += capital;
    totalValue += value;
  }

  const pnl = totalValue - totalCapital;
  const percent = totalCapital > 0 ? (pnl / totalCapital) * 100 : 0;

  return {
    positions,
    totalCapital,
    totalValue,
    pnl,
    percent
  };
}

module.exports = {
  addPosition,
  deletePosition,
  getPositions,
  calculatePortfolio,
  getSettings,
  updateSettings
};