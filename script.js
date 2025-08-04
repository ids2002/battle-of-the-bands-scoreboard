function setStyle(styleName) {
  const themeLink = document.getElementById('theme-style');
  if (themeLink) {
    themeLink.setAttribute('href', styleName);
  }
}

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUGmZrVnQpHFVXKj-TesONikDj1kSG-4pNIYymZSPODYqyrMlMBDml8_qVsUrvxTpS5KTL_p6hncoC/pubhtml?gid=946014061&single=true'; // replace with your actual published sheet URL

document.addEventListener('DOMContentLoaded', () => {
  fetchLeaderboardData();
  setInterval(fetchLeaderboardData, 10000);
});

async function fetchLeaderboardData() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const text = await response.text();
    const rows = text.trim().split('\n').map(row => row.split(','));

    renderLeaderboard(rows.slice(1));
    updateCrowdMeter(parseInt(rows[0][1]));
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
  }
}

function renderLeaderboard(data) {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;

  tbody.innerHTML = '';
data.forEach(row => {
  if (!row || typeof row !== 'object') return;

  const bandNameRaw = row['Band Name'];
  const rank = row['Rank'];
  const score = row['Score'];

  if (!bandNameRaw || !rank || !score) return;

  const bandName = bandNameRaw.toString().toLowerCase();

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${rank}</td>
    <td>${bandName}</td>
    <td>${score}</td>
  `;
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

