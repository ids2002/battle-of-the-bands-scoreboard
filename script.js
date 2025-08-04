function setStyle(styleName) {
  document.getElementById('stylesheet').setAttribute('href', styleName);
}

// Switch theme
const themeSelector = document.getElementById('themeSelector');
themeSelector.addEventListener('change', (e) => {
  document.getElementById('theme-style').href = e.target.value;
});

// Animate the crowd meter bar
const slider = document.getElementById('crowdSlider');
const crowdBar = document.getElementById('crowdBar');
slider.addEventListener('input', () => {
  crowdBar.style.width = `${slider.value}%`;
  let color = '#00ff66';
  if (slider.value > 75) color = '#ff0033';
  else if (slider.value > 50) color = '#ffaa00';
  else if (slider.value > 25) color = '#00ccff';
  crowdBar.style.background = color;
});

// Placeholder: Replace with live Google Sheets API call
const bands = [
  { rank: 1, name: 'Player Party', score: 950 },
  { rank: 2, name: 'The Doom Howlers', score: 915 },
  { rank: 3, name: 'Skull Choir', score: 900 },
  { rank: 4, name: 'Rage of Arkan', score: 860 },
  { rank: 5, name: 'The Hex Pistols', score: 820 },
];

const leaderboard = document.getElementById('leaderboardBody');
bands.forEach(band => {
  const row = document.createElement('tr');
  row.innerHTML = `<td>${band.rank}</td><td>${band.name}</td><td>${band.score}</td>`;
  leaderboard.appendChild(row);
});
