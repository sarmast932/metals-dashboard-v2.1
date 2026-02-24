const TEHRAN_TZ = "Asia/Tehran";

function getTehranNow() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: TEHRAN_TZ })
  );
}

function getTehranMidnightTimestamp() {
  const tehran = getTehranNow();
  tehran.setHours(0, 0, 0, 0);
  return tehran.getTime();
}

function getCurrentTimestamp() {
  return Date.now();
}

module.exports = {
  getTehranNow,
  getTehranMidnightTimestamp,
  getCurrentTimestamp
};