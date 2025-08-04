function setStyle(styleName) {
  const themeLink = document.getElementById('theme-style');
  if (themeLink) {
    themeLink.setAttribute('href', styleName);
  }
}

// Replace this with your actual published CSV URL
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUGmZrVnQpHFVXKj-TesONikDj1kSG-4pNIYymZSPODYqyrMlMBDml8_qVsUrvxTpS5KTL_p6hncoC/pub?gid=946014061&single=true&output=csv';

document.addEventListener('DOMContentLoaded', () => {
  fetchLeaderboardData();
  setInterval(fetchLeaderboardData, 10000);
});

async function fetchLeaderboardData() {
  try {
    const response = await fetch(SHEET_CSV_URL);
const text = await response.text();
const rows = text.trim().split('\n').map(line => line.split(','));
const headers = rows[0];

// Parse the data
const data = rows.slice(1).map(row => {
  const entry = {};
  headers.forEach((header, index) => {
    entry[header.trim()] = row[index]?.trim() || '';
  });
  return entry;
});

// Read crowd meter from very first row manually
const firstRow = rows[1]; // raw CSV second line (row 0 is headers)
const crowdMeterIndex = headers.indexOf('Crowd Meter Control');
const meterValue = parseInt(firstRow?.[crowdMeterIndex]) || 0;
updateCrowdMeter(meterValue);

// Render the board
renderLeaderboard(data);

function renderLeaderboard(data) {
  const leaderboardBody = document.getElementById('leaderboard-body');
  if (!leaderboardBody) return;

  leaderboardBody.innerHTML = '';

 data.forEach(row => {
  if (!row || typeof row !== 'object') return;

  const bandName = row['Band Name'];
  const rank = row['Rank'];
  const score = row['Score'] || '—';

  if (!bandName || !rank) return;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${rank}</td>
    <td>${bandName}</td>
    <td>${score}</td>
  `;
  
  // Highlight PC band
  if (rank === '--' || bandName.toLowerCase().includes('player')) {
    tr.classList.add('player-row');
  }

  leaderboardBody.appendChild(tr);
});

function updateCrowdMeter(value) {
  const bar = document.getElementById('meter-bar');
  if (!bar || isNaN(value)) return;

  bar.style.width = `${value}%`;

  bar.style.backgroundColor =
    value < 25 ? '#2d9cdb' :
    value < 60 ? '#f2c94c' :
    '#eb5757';
}

