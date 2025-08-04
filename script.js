const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID_HERE/pub?output=csv';

document.addEventListener('DOMContentLoaded', () => {
  fetchLeaderboardData();
  setInterval(fetchLeaderboardData, 10000); // every 10 seconds
});

function setStyle(styleName) {
  const themeLink = document.getElementById('theme-style');
  if (themeLink) {
    themeLink.setAttribute('href', styleName);
  }
}

async function fetchLeaderboardData() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const text = await response.text();
    const rows = text.trim().split('\n').map(row => row.split(','));

    renderLeaderboard(rows.slice(1));
    updateCrowdMeter(rows[0][1]); // Cell B1
  } catch (err) {
    console.error('Error loading leaderboard:', err);
  }
}

function renderLeaderboard(rows) {
  const tbody = document.getElementById('leaderboard-body');
  tbody.innerHTML = '';

  rows.forEach(([rank, name, score]) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${rank}</td><td>${name}</td><td>${score}</td>`;

    if (rank === '--' || name.toLowerCase().includes('player')) {
      row.classList.add('player-row');
    }

    tbody.appendChild(row);
  });
}

function updateCrowdMeter(value) {
  const crowdVal = parseInt(value);
  const bar = document.getElementById('meter-bar');

  if (!bar || isNaN(crowdVal)) return;

  bar.style.width = `${crowdVal}%`;

  if (crowdVal < 25) {
    bar.style.backgroundColor = '#2d9cdb';
  } else if (crowdVal < 60) {
    bar.style.backgroundColor = '#f2c94c';
  } else {
    bar.style.backgroundColor = '#eb5757';
  }
}
