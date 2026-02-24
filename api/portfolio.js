const { addPosition, calculatePortfolio } = require("../lib/portfolio-service");

module.exports = async function (req, res) {
  if (req.method === "POST") {
    const { asset, quantity, entryPrice } = req.body;
    await addPosition(asset, quantity, entryPrice);
    return res.status(200).json({ success: true });
  }

  const summary = await calculatePortfolio();
  res.status(200).json({ success: true, summary });
};