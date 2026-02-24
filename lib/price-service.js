const fetch = require("node-fetch");

const GOLD_URL = "https://inv.charisma.ir/pub/Plans/Gold";
const SILVER_URL = "https://inv.charisma.ir/pub/Plans/Silver";

function validateResponse(data) {
  if (
    !data ||
    !data.latestIndexPrice ||
    !data.prevIndexPrice ||
    typeof data.latestIndexPrice.index === "undefined" ||
    typeof data.prevIndexPrice.index === "undefined"
  ) {
    throw new Error("Invalid API response structure");
  }
}

function buildAssetData(data) {
  validateResponse(data);

  const latest = data.latestIndexPrice.index;
  const prev = data.prevIndexPrice.index;

  const priceToman = latest / 10;
  const changeToman = (latest - prev) / 10;
  const percent = ((latest - prev) / prev) * 100;

  return {
    priceToman,
    changeToman,
    percent,
    raw: latest
  };
}

async function fetchAsset(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API fetch failed with status ${res.status}`);
  }

  return await res.json();
}

async function getMarketData() {
  const [goldData, silverData] = await Promise.all([
    fetchAsset(GOLD_URL),
    fetchAsset(SILVER_URL)
  ]);

  return {
    gold: buildAssetData(goldData),
    silver: buildAssetData(silverData)
  };
}

module.exports = { getMarketData };