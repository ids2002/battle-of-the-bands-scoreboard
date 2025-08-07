const LEADERBOARD_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUGmZrVnQpHFVXKj-TesONikDj1kSG-4pNIYymZSPODYqyrMlMBDml8_qVsUrvxTpS5KTL_p6hncoC/pub?gid=946014061&single=true&output=csv';

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1);

  return rows.map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
}

function renderLeaderboard(data) {
  const tbody = document.querySelector('#leaderboard tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

data.forEach((row, index) => {
    if (!row || !row['Band Name'] || !row['Rank'] || !row['Score']) return;

    const bandName = row['Band Name'];
    const rank = row['Rank'];
    const score = row['Score'];

    const tr = document.createElement('tr');

    // Highlight second row (index === 1)
    if (index === 1) {
        tr.classList.add('highlight-player');
    }

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
    const clamped = Math.min(Math.max(value, 0), 100);
    bar.style.width = `${clamped}%`;
}

function fetchLeaderboardData() {
  fetch(LEADERBOARD_URL)
    .then(response => response.text())
    .then(csvText => {
      const rawData = parseCSV(csvText);
      const rawFirstRow = rawData[0];

      if (!rawFirstRow) throw new Error("No data found.");

      const crowdValue = parseInt(rawFirstRow['Crowd Level'], 10);
      updateCrowdMeter(crowdValue);

      const data = rawData.filter(row => row['Band Name'] && row['Rank'] && row['Score']);
      renderLeaderboard(data);
    })
    .catch(err => {
      console.error("❌ Failed to fetch leaderboard:", err);
    });
}

function setStyle(cssFile) {
  const link = document.getElementById('theme-style');
  if (link) link.setAttribute('href', cssFile);
}

document.getElementById('btn-synthwave')?.addEventListener('click', () => setStyle('style-synthwave.css'));
document.getElementById('btn-fantasy')?.addEventListener('click', () => setStyle('style-fantasy.css'));
document.getElementById('btn-neonmetal')?.addEventListener('click', () => setStyle('style-metal.css'));
document.getElementById('btn-refresh')?.addEventListener('click', fetchLeaderboardData);

// Auto-refresh every 30 seconds
setInterval(fetchLeaderboardData, 30000);

// Initial load
fetchLeaderboardData();
