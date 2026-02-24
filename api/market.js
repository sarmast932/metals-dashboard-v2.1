const { getMarketData } = require("../lib/price-service");
const { storeTick } = require("../lib/history-service");

module.exports = async function handler(req, res) {
  try {
    const data = await getMarketData();

    await storeTick("gold", data.gold.price);
    await storeTick("silver", data.silver.price);

    res.status(200).json({
      success: true,
      ...data
    });

  } catch (error) {
    console.error("Market Error:", error);
    res.status(500).json({
      success: false,
      message: "Market fetch failed"
    });
  }
};