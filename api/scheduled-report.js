const { buildDailyReport } = require("../lib/report-service");
const sendTelegram = require("./send-telegram");
const { getTehranNow } = require("../lib/time");

function formatNumber(num) {
  return Number(num).toLocaleString("en-US");
}

module.exports = async function handler(req, res) {
  try {
    const { hour } = req.query;

    if (!hour || !["9", "16", "23"].includes(hour)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hour"
      });
    }

    const goldReport = await buildDailyReport("gold");
    const silverReport = await buildDailyReport("silver");

    const tehranNow = getTehranNow();

    const message = `
📊 <b>گزارش روزانه تا ساعت ${hour}:00 تهران</b>

🟡 <b>طلا</b>
Open: ${formatNumber(goldReport.open)}
High: ${formatNumber(goldReport.high)}
Low: ${formatNumber(goldReport.low)}
Close: ${formatNumber(goldReport.close)}
Change: ${formatNumber(goldReport.change)}
Percent: ${goldReport.percent.toFixed(2)}%

⚪ <b>نقره</b>
Open: ${formatNumber(silverReport.open)}
High: ${formatNumber(silverReport.high)}
Low: ${formatNumber(silverReport.low)}
Close: ${formatNumber(silverReport.close)}
Change: ${formatNumber(silverReport.change)}
Percent: ${silverReport.percent.toFixed(2)}%

🕒 ${tehranNow.toLocaleString("fa-IR")}
`;

    await sendTelegram(message);

    res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error("Scheduled Report Error:", error);
    res.status(500).json({
      success: false,
      message: "Scheduled report failed"
    });
  }
};