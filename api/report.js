const { buildDailyReport } = require("../lib/report-service");

module.exports = async function handler(req, res) {
  try {
    const { asset } = req.query;

    if (!asset || !["gold", "silver"].includes(asset)) {
      return res.status(400).json({
        success: false,
        message: "Invalid asset"
      });
    }

    const report = await buildDailyReport(asset);

    res.status(200).json({
      success: true,
      asset,
      report
    });

  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({
      success: false,
      message: "Report generation failed"
    });
  }
};