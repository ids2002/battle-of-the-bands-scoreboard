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
function updateCrowdMeterFromData(data) {
  // This assumes the crowd level is in a specific column of the player row
  // We'll grab the second row and a specific column (e.g., 4th = index 3)

  if (!data || data.length < 2) return;

  const playerRow = data[1]; // second row = player
  const rawValue = playerRow[3]; // Change index if your value is elsewhere
  const crowdValue = parseFloat(rawValue);

  if (!isNaN(crowdValue)) {
    updateCrowdMeter(crowdValue);
  } else {
    console.warn("Crowd meter value is not a valid number:", rawValue);
  }
}

function fetchLeaderboardData() {
  fetch(LEADERBOARD_CSV_URL)
    .then(response => response.text())
    .then(csvText => {
      const data = Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
      }).data;

      renderLeaderboard(data);
      updateCrowdMeterFromData(data);  // ✅ Here’s where it’s used
    })
    .catch(error => {
      console.error("Failed to fetch leaderboard:", error);
    });
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
    const critical = document.getElementById("crowd-critical");
if (clamped >= 90) {
  critical.classList.remove("hidden");
} else {
  critical.classList.add("hidden");
}

}
    }
  });
}
