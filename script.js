const LEADERBOARD_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUGmZrVnQpHFVXKj-TesONikDj1kSG-4pNIYymZSPODYqyrMlMBDml8_qVsUrvxTpS5KTL_p6hncoC/pub?gid=946014061&single=true&output=csv';

// Load Papaparse
const papaScript = document.createElement('script');
papaScript.src = 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js';
papaScript.onload = initialize;
document.head.appendChild(papaScript);

function updateCrowdMeter(value) {
  const bar = document.getElementById("crowd-meter");
  if (!bar || isNaN(value)) {
    console.warn("Invalid crowd meter value:", value);
    return;
}

  const clamped = Math.min(Math.max(parseFloat(value), 0), 100);
  bar.style.width = `${clamped}%`;
}


// Load default theme
function setDefaultTheme() {
  const themeEl = document.getElementById('theme-style');
  if (themeEl) {
    themeEl.setAttribute('href', 'style-synthwave.css');
  }
}

setDefaultTheme();

// Fetch leaderboard CSV
async function fetchLeaderboardData() {
  try {
    const response = await fetch(LEADERBOARD_CSV_URL);
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
      header: false,           // <=== use false for raw row access
      skipEmptyLines: true
    }).data;

    console.log(parsed);

    renderLeaderboard(parsed);
    updateCrowdMeterFromData(parsed);  // <=== this is the key new line

  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
  }
}

// Render leaderboard rows
function renderLeaderboard(data) {
  const table = document.getElementById('leaderboard');
  table.innerHTML = '';

  // Header row
  const header = document.createElement('tr');
  ['Rank', 'Band Name', 'Score'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    header.appendChild(th);
  });
  table.appendChild(header);

  data.forEach((row, i) => {
    if (i === 0) return; // skip header if present
    const tr = document.createElement('tr');

    const rank = row[0] || '--';
    const name = row[1] || '';
    const score = row[2] || '--';

    [rank, name, score].forEach((text, j) => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });

    if (i === 1) {
      tr.classList.add('highlight'); // highlight second row (player band)
    }

    table.appendChild(tr);
  });
}

function updateCrowdMeterFromData(data) {
  if (!Array.isArray(data) || data.length < 2 || !data[1][3]) {
    console.warn("Crowd meter value not found in cell D2.");
    return;
  }

  const rawValue = data[1][3]; // Column D = index 3
  const numericValue = parseFloat(rawValue);
  updateCrowdMeter(numericValue);
}

// Update the crowd meter based on a value from 0–100
function updateCrowdMeter(value) {
  const bar = document.getElementById("crowd-meter");
  if (!bar || isNaN(value)) {
    console.warn("Invalid crowd meter value:", value);
    return;
  }

  const clamped = Math.min(Math.max(parseFloat(value), 0), 100);
  bar.style.width = `${clamped}%`;
}

// Read the crowd value from the 4th column of the 2nd row
function updateCrowdMeterFromData(data) {
  if (!data || data.length < 2) return;

  const playerRow = data[1]; // 2nd row = player band
  const rawValue = playerRow[3]; // Index 3 = crowd meter value
  const crowdValue = parseFloat(rawValue);

  if (!isNaN(crowdValue)) {
    updateCrowdMeter(crowdValue);
  } else {
    console.warn("Invalid crowd meter value:", rawValue);
  }
}

// Button & auto-refresh
function setupRefresh() {
  const button = document.getElementById('btn-refresh');
  if (button) {
    button.addEventListener('click', fetchLeaderboardData);
  }

  // Optional: auto-refresh every 10 seconds
  setInterval(fetchLeaderboardData, 10000);
}

// Initial setup
function initialize() {
  fetchLeaderboardData();
  setupRefresh();
}
