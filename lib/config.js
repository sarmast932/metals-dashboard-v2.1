const CONFIG = {
  APP_NAME: "Metals Dashboard v2.1",

  TELEGRAM: {
    BOT_TOKEN: process.env.BOT_TOKEN,
    CHAT_ID: process.env.CHAT_ID
  },

  REDIS: {
    URL: process.env.REDIS_URL,
    TOKEN: process.env.REDIS_TOKEN
  },

  MARKET: {
    GOLD_URL: "https://inv.charisma.ir/pub/Plans/Gold",
    SILVER_URL: "https://inv.charisma.ir/pub/Plans/Silver",
    POLLING_INTERVAL_MS: 60000
  },

  PORTFOLIO: {
    DEFAULT_PROFIT_THRESHOLD: 5,
    DEFAULT_LOSS_THRESHOLD: -5
  }
};

module.exports = CONFIG;