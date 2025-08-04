document.addEventListener('DOMContentLoaded', () => {
  // Style switcher buttons
  document.getElementById('btn-synthwave')?.addEventListener('click', () => {
    document.getElementById('theme-style').setAttribute('href', 'style-synthwave.css');
  });

  document.getElementById('btn-fantasy')?.addEventListener('click', () => {
    document.getElementById('theme-style').setAttribute('href', 'style-fantasy.css');
  });

  document.getElementById('btn-neonmetal')?.addEventListener('click', () => {
    document.getElementById('theme-style').setAttribute('href', 'style-neonmetal.css');


}

  // Add fake band data
  const bands = [
    { rank: 1, name: 'Player Party', score: 950 },
    { rank: 2, name: 'The Doom Howlers', score: 915 },
    { rank: 3, name: 'Skull Choir', score: 900 },
    { rank: 4, name: 'Rage of Arkan', score: 860 },
    { rank: 5, name: 'The Hex Pistols', score: 820 }
  ];

  const leaderboard = document.querySelector('#leaderboard tbody');
  bands.forEach(band => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${band.rank}</td><td>${band.name}</td><td>${band.score}</td>`;
    leaderboard.appendChild(row);
  });
});
