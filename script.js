const LEADERBOARD_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUGmZrVnQpHFVXKj-TesONikDj1kSG-4pNIYymZSPODYqyrMlMBDml8_qVsUrvxTpS5KTL_p6hncoC/pub?gid=946014061&single=true&output=csv';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-refresh").addEventListener("click", fetchLeaderboardData);
    fetchLeaderboardData();
    setInterval(fetchLeaderboardData, 30000);
});

function setStyle(styleName) {
    const styleEl = document.getElementById("theme-style");
    if (styleEl) {
        styleEl.setAttribute("href", `style-${styleName.toLowerCase()}.css`);
    }
}

async function fetchLeaderboardData() {
  try {
    const response = await fetch(LEADERBOARD_CSV_URL);
    const csvText = await response.text();
    const data = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    }).data;

    console.log(data); // <--- Add this

    renderLeaderboard(data);
    updateCrowdMeterFromData(data);
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
  }
}

function renderLeaderboard(data) {
  const table = document.getElementById("leaderboard");
  table.innerHTML = "";

  // Add header row
  const header = table.insertRow();
  ["Rank", "Band Name", "Score"].forEach(text => {
    const cell = header.insertCell();
    cell.textContent = text;
    cell.style.fontWeight = "bold";
  });

  // Add band rows
  data.forEach((band, index) => {
    const row = table.insertRow();
    row.insertCell().textContent = band.Rank || index;       // Rank
    row.insertCell().textContent = band["Band Name"];         // Band Name
    row.insertCell().textContent = band.Score;                // Score

    // Highlight the first data row (player band)
    if (index === 0) {
      row.style.backgroundColor = "#ffcc00";   // Customize as needed
      row.style.fontWeight = "bold";

function updateCrowdMeter(value) {
  const bar = document.getElementById('crowd-meter');
  if (!bar || isNaN(value)) return;

  const clamped = Math.min(Math.max(value, 0), 100);
  bar.style.width = `${clamped}%`;
}  
function updateCrowdMeter(value) {
  const bar = document.getElementById("crowd-meter-fill");
  if (!bar || isNaN(value)) return;

  const clamped = Math.max(0, Math.min(100, value));
  bar.style.width = `${clamped}%`;

  // Change color dynamically
  if (clamped < 50) {
    bar.style.background = 'linear-gradient(to right, #f0c000, #f0a000)';
    bar.classList.remove('pulse');
  } else if (clamped < 80) {
    bar.style.background = 'linear-gradient(to right, #f27c00, #ff6600)';
    bar.classList.remove('pulse');
  } else {
    bar.style.background = 'linear-gradient(to right, #ff3300, #cc0000)';
    bar.classList.add('pulse'); // Glowing at high energy
  }
}
    }
  });
}
