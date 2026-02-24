const fetch = require("node-fetch");
const CONFIG = require("./config");

async function fetchAsset(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Charisma API request failed");
  }

  return response.json();
}

function buildAssetData(raw) {
  const currentRial = raw.latestIndexPrice.index;
  const prevRial = raw.prevIndexPrice.index;

  const currentToman = currentRial / 10;
  const prevToman = prevRial / 10;

  const change = currentToman - prevToman;
  const percent = (change / prevToman) * 100;

  return {
    price: currentToman,
    change,
    percent
  };
}

async function getMarketData() {
  const goldRaw = await fetchAsset(CONFIG.MARKET.GOLD_URL);
  const silverRaw = await fetchAsset(CONFIG.MARKET.SILVER_URL);

  return {
    gold: buildAssetData(goldRaw),
    silver: buildAssetData(silverRaw)
  };
}

module.exports = {
  getMarketData
};