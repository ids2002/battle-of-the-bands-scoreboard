function setStyle(styleName) {
  const themeLink = document.getElementById('theme-style');
  if (themeLink) {
    themeLink.setAttribute('href', styleName);
  }
}

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUGmZrVnQpHFVXKj-TesONikDj1kSG-4pNIYymZSPODYqyrMlMBDml8_qVsUrvxTpS5KTL_p6hncoC/pub?output=ods'; // replace with your actual published sheet URL

document.addEventListener('DOMContentLoaded', () => {
  fetchLeaderboardData();
  setInterval(fetchLeaderboardData, 10000);
});

async function fetchLeaderboardData() {
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQs9Mg_QZKXddVdEEXAMPLE/pub?output=tsv');
    const text = await response.text();
    const rows = text.trim().split('\n').map(line => line.split('\t'));
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header.trim()] = row[index]?.trim() || '';
      });
      return entry;
    });
    renderLeaderboard(data);
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
  }
}

function renderLeaderboard(data) {
  const leaderboardBody = document.getElementById('leaderboard-body');
  if (!leaderboardBody) return;

  leaderboardBody.innerHTML = '';

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
}

function updateCrowdMeter(value) {
  const bar = document.getElementById('meter-bar');
  if (!bar || isNaN(value)) return;

  bar.style.width = `${value}%`;
  bar.style.backgroundColor = '#f7c948'; // You can change this color if desired
}

fetchLeaderboardData();
