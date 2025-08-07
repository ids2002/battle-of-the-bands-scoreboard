
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUGmZrVnQpHFVXKj-TesONikDj1kSG-4pNIYymZSPODYqyrMlMBDml8_qVsUrvxTpS5KTL_p6hncoC/pub?gid=946014061&single=true&output=csv";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-refresh").addEventListener("click", fetchLeaderboardData);
    fetchLeaderboardData();
    setInterval(fetchLeaderboardData, 30000);
});

function setStyle(styleName) {
    const styleEl = document.getElementById("theme-style");
    if (styleEl) {
        styleEl.setAttribute("href", `style-${styleName.toLowerCase()}.css`);
    }
}

async function fetchLeaderboardData() {
    try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        const rows = csvText.trim().split("\n").map(row => row.split(","));
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
            const entry = {};
            headers.forEach((header, i) => {
                entry[header.trim()] = row[i] ? row[i].trim() : "";
            });
            return entry;
        });

        const rawFirstRow = data[0];
        const crowdValue = parseInt(rawFirstRow["Crowd Meter"] || "0", 10);
        const playerName = rawFirstRow["Player Band"] || "";

        updateCrowdMeter(crowdValue);
        renderLeaderboard(data.slice(1), playerName);

    } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
    }
}

function renderLeaderboard(data, playerName) {
    const tbody = document.getElementById("leaderboard-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach((row, index) => {
        if (!row || !row["Band Name"] || !row["Rank"] || !row["Score"]) return;

        const bandName = row["Band Name"];
        const rank = row["Rank"];
        const score = row["Score"];

        const tr = document.createElement("tr");
        if (bandName === playerName) {
            tr.classList.add("highlight-player");
        }

        tr.innerHTML = `
            <td>${rank}</td>
            <td>${bandName}</td>
            <td>${score}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateCrowdMeter(value) {
    const bar = document.getElementById("meter-bar");
    if (!bar || isNaN(value)) return;
    const clamped = Math.min(Math.max(value, 0), 100);
    bar.style.width = `${clamped}%`;
}

async function initialize() {
  try {
    await fetchLeaderboardData();
  } catch (err) {
    console.error('Initialization failed:', err);
  }
}

initialize();
