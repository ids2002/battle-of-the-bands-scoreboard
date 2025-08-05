function setStyle(styleName) {
  const themeLink = document.getElementById('theme-style');
  if (themeLink) {
    themeLink.setAttribute('href', styleName);
  }
}

// ✅ Replace with your actual published CSV URL
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUGmZrVnQpHFVXKj-TesONikDj1kSG-4pNIYymZSPODYqyrMlMBDml8_qVsUrvxTpS5KTL_p6hncoC/pub?gid=946014061&single=true&output=csv';

document.addEventListener('DOMContentLoaded', () => {
  fetchLeaderboardData();
  setInterval(fetchLeaderboardData, 5000); // Auto-refresh every 5 seconds
});

function fetchLeaderboardData() {
  fetch(LEADERBOARD_URL)
    .then(response => response.text())
    .then(csvText => {
      const rawData = parseCSV(csvText);
      const rawFirstRow = rawData[0];

      if (!rawFirstRow) throw new Error("No data found.");

      // Crowd meter value from sheet
      const crowdValue = parseInt(rawFirstRow['Crowd Level'], 10);
      updateCrowdMeter(crowdValue);

      // Remove header or blank rows
      const data = rawData.filter(row => row['Band Name'] && row['Rank'] && row['Score']);
      renderLeaderboard(data);
    })
    .catch(err => {
      console.error("Failed to fetch leaderboard:", err);
    });
}

    // ✅ Pull Crowd Meter Control from first row directly
    const rawFirstRow = rows[1];
    const meterIndex = headers.indexOf('Crowd Meter Control');
    const crowdValue = parseInt(rawFirstRow?.[meterIndex]) || 0;
    updateCrowdMeter(crowdValue);

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

    if (rank === '--' || bandName.toLowerCase().includes('player')) {
      tr.classList.add('player-row');
    }

    leaderboardBody.appendChild(tr);
  });
}

function updateCrowdMeter(value) {
  const bar = document.getElementById('meter-bar');
  const readout = document.getElementById('meter-readout');

  if (!bar || isNaN(value)) {
    console.log("Meter bar not updated. Value:", value);
    return;
  }

  // Display the value
  readout.textContent = `Meter: ${value}%`;

  // Force update width + color
  bar.style.width = `${value}%`;
  bar.style.backgroundColor =
    value < 25 ? '#2d9cdb' :
    value < 60 ? '#f2c94c' :
    '#eb5757';
}

