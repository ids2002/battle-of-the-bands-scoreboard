// CONFIGURATION
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID_HERE/pub?output=csv'; // Replace this
const CROWD_CELL_ROW = 0; // Row 1
const CROWD_CELL_COL = 1; // Column B

// Load and render leaderboard + crowd meter
async function fetchLeaderboardData() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const text = await response.text();
    const rows = text.split('\n').map(row => row.split(','));

    renderLeaderboard(rows);
    updateCrowdMeterFromCell(rows);
  } catch (error) {
    console.error('Error loading leaderboard:', error);
  }
}

// Build leaderboard table
function renderLeaderboard(rows) {
  const table = document.getElementById('leaderboard-body');
  table.innerHTML = ''; // Clear old

  for (let i = 1; i < rows.length; i++) {
    const [rank, name, score] = rows[i];
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${rank}</td>
      <td>${name}</td>
      <td>${score}</td>
    `;

    if (rank === '--' || name.toLowerCase().includes('player')) {
      row.classList.add('player-row'); // CSS highlights PC band
    }

    table.appendChild(row);
  }
}

// Read and update crowd meter from row 1, col B
function updateCrowdMeterFromCell(rows) {
  let value = parseInt(rows[CROWD_CELL_ROW][CROWD_CELL_COL]);
  if (isNaN(value)) value = 0;

  const meter = document.getElementById('meter-bar');
  meter.style.width = `${value}%`;

  if (value < 25) {
    meter.style.backgroundColor = '#2d9cdb'; // Blue
  } else if (value < 60) {
    meter.style.backgroundColor = '#f2c94c'; // Yellow
  } else {
    meter.style.backgroundColor = '#eb5757'; // Red
  }
}

// Style/theme switcher
function setStyle(styleName) {
  const themeLink = document.getElementById('theme-style');
  if (themeLink) {
    themeLink.setAttribute('href', styleName);
  }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  fetchLeaderboardData();
  setInterval(fetchLeaderboardData, 10000); // Refresh every 10 sec
});
