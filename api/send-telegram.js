const fetch = require("node-fetch");
const CONFIG = require("../lib/config");

module.exports = async function sendTelegram(message) {
  if (!CONFIG.TELEGRAM.BOT_TOKEN || !CONFIG.TELEGRAM.CHAT_ID) {
    console.error("Telegram env variables missing");
    return;
  }

  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM.BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: CONFIG.TELEGRAM.CHAT_ID,
      text: message,
      parse_mode: "HTML"
    })
  });
};