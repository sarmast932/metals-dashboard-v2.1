const {
  addPosition,
  deletePosition,
  calculatePortfolio,
  getSettings,
  updateSettings
} = require("../lib/portfolio-service");

const { checkPortfolioAlert } = require("../lib/alert-service");
const sendTelegram = require("./send-telegram");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { asset, quantity, entryPrice } = req.body;
      const position = await addPosition(asset, quantity, entryPrice);
      return res.status(200).json({ success: true, position });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      await deletePosition(id);
      return res.status(200).json({ success: true });
    }

    if (req.method === "PUT") {
      const { profitThreshold, lossThreshold } = req.body;
      const settings = await updateSettings(profitThreshold, lossThreshold);
      return res.status(200).json({ success: true, settings });
    }

    const portfolio = await calculatePortfolio();
    const settings = await getSettings();

    const alertMessage = await checkPortfolioAlert(
      portfolio.percent,
      settings
    );

    if (alertMessage) {
      await sendTelegram(alertMessage);
    }

    res.status(200).json({
      success: true,
      ...portfolio,
      settings
    });

  } catch (error) {
    console.error("Portfolio Error:", error);
    res.status(500).json({
      success: false,
      message: "Portfolio error"
    });
  }
};