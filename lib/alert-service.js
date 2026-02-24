const { redis } = require("./redis");

const ALERT_STATE_KEY = "alerts:state";
const ALERT_COOLDOWN_KEY = "alerts:cooldown";

const COOLDOWN_SECONDS = 300;

async function isInCooldown(key) {
  const cooldown = await redis.get(`${ALERT_COOLDOWN_KEY}:${key}`);
  return !!cooldown;
}

async function setCooldown(key) {
  await redis.set(`${ALERT_COOLDOWN_KEY}:${key}`, "1", {
    ex: COOLDOWN_SECONDS
  });
}

async function checkPortfolioAlert(percent, settings) {
  const key = "portfolio-percent";

  if (await isInCooldown(key)) return null;

  if (percent >= settings.profitThreshold) {
    await setCooldown(key);
    return `📈 سود پرتفو از ${settings.profitThreshold}% عبور کرد`;
  }

  if (percent <= settings.lossThreshold) {
    await setCooldown(key);
    return `📉 زیان پرتفو از ${settings.lossThreshold}% عبور کرد`;
  }

  return null;
}

async function checkPriceAlert(asset, currentPrice, threshold) {
  const key = `price:${asset}:${threshold}`;

  if (await isInCooldown(key)) return null;

  if (currentPrice >= threshold) {
    await setCooldown(key);
    return `🔔 ${asset} از سطح ${threshold} عبور کرد`;
  }

  return null;
}

module.exports = {
  checkPortfolioAlert,
  checkPriceAlert
};