let goldChart;

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");
}

async function loadMarket() {
  const res = await fetch("/api/market");
  const data = await res.json();

  const gold = data.gold;
  const silver = data.silver;

  document.getElementById("gold-card").innerHTML = `
    <h3>شمش طلا</h3>
    <p>قیمت: ${gold.price.toLocaleString()} تومان</p>
    <p class="${gold.percent >= 0 ? 'green' : 'red'}">
      ${gold.change.toLocaleString()} (${gold.percent.toFixed(2)}%)
    </p>
  `;

  document.getElementById("silver-card").innerHTML = `
    <h3>شمش نقره</h3>
    <p>قیمت: ${silver.price.toLocaleString()} تومان</p>
    <p class="${silver.percent >= 0 ? 'green' : 'red'}">
      ${silver.change.toLocaleString()} (${silver.percent.toFixed(2)}%)
    </p>
  `;
}

async function loadPortfolio() {
  const res = await fetch("/api/portfolio");
  const data = await res.json();

  const summary = data;

  document.getElementById("portfolio-summary").innerHTML = `
    <h3>خلاصه پرتفو</h3>
    <p>سرمایه: ${summary.totalCapital.toLocaleString()}</p>
    <p>ارزش فعلی: ${summary.totalValue.toLocaleString()}</p>
    <p class="${summary.percent >= 0 ? 'green' : 'red'}">
      PnL: ${summary.pnl.toLocaleString()} (${summary.percent.toFixed(2)}%)
    </p>
  `;

  const positionsDiv = document.getElementById("positions");
  positionsDiv.innerHTML = "";

  summary.positions.forEach(p => {
    positionsDiv.innerHTML += `
      <div class="card">
        ${p.asset} | ${p.quantity}
        <button onclick="deletePosition('${p.id}')">حذف</button>
      </div>
    `;
  });

  document.getElementById("profitThreshold").value = data.settings.profitThreshold;
  document.getElementById("lossThreshold").value = data.settings.lossThreshold;
}

async function addPosition() {
  const asset = document.getElementById("asset").value;
  const quantity = document.getElementById("quantity").value;
  const entryPrice = document.getElementById("entryPrice").value;

  await fetch("/api/portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ asset, quantity, entryPrice })
  });

  loadPortfolio();
}

async function deletePosition(id) {
  await fetch(`/api/portfolio?id=${id}`, {
    method: "DELETE"
  });

  loadPortfolio();
}

async function updateThreshold() {
  const profitThreshold = document.getElementById("profitThreshold").value;
  const lossThreshold = document.getElementById("lossThreshold").value;

  await fetch("/api/portfolio", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profitThreshold, lossThreshold })
  });

  loadPortfolio();
}

async function loadChart() {
  const res = await fetch("/api/report?asset=gold");
  const data = await res.json();

  const ctx = document.getElementById("goldChart").getContext("2d");

  goldChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Open", "High", "Low", "Close"],
      datasets: [{
        label: "Intraday",
        data: [
          data.report.open,
          data.report.high,
          data.report.low,
          data.report.close
        ]
      }]
    }
  });
}

loadMarket();
loadPortfolio();
loadChart();
setInterval(loadMarket, 60000);