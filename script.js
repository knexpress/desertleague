const teams = [
  "TITANS XI",
  "AVENGERS XI",
  "JAWAD XI",
  "AL AIN UNITED",
  "VENOM SQUAD"
];

const fixtures = [
  { id: "M1", date: "Thu, Apr 9", teams: "Titans XI vs Venom Squad", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M2", date: "Fri, Apr 10", teams: "Al Ain United vs Avengers XI", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M3", date: "Mon, Apr 14", teams: "Jawad XI vs Venom Squad", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M4", date: "Tue, Apr 15", teams: "Al Ain United vs Titans XI", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M5", date: "Fri, Apr 18", teams: "Avengers XI vs Venom Squad", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M6", date: "Mon, Apr 21", teams: "Jawad XI vs Titans XI", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M7", date: "Thu, Apr 24", teams: "Titans XI vs Avengers XI", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M8", date: "Fri, Apr 25", teams: "Al Ain United vs Venom Squad", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M9", date: "Mon, Apr 28", teams: "Jawad XI vs Al Ain United", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M10", date: "Tue, Apr 29", teams: "Venom Squad vs Titans XI (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M11", date: "Fri, May 2", teams: "Avengers XI vs Al Ain United (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M12", date: "Mon, May 5", teams: "Jawad XI vs Avengers XI (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M13", date: "Thu, May 8", teams: "Titans XI vs Al Ain United (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M14", date: "Fri, May 9", teams: "Venom Squad vs Avengers XI (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M15", date: "Mon, May 12", teams: "Jawad XI vs Venom Squad (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M16", date: "Wed, May 14", teams: "Jawad XI vs Titans XI (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M17", date: "Thu, May 15", teams: "Avengers XI vs Titans XI (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M18", date: "Sun, May 18", teams: "Venom Squad vs Al Ain United (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M19", date: "Mon, May 19", teams: "Al Ain United vs Jawad XI (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" },
  { id: "M20", date: "Thu, May 22", teams: "Avengers XI vs Venom Squad (Reverse)", time: "9:00 PM", status: "pending", winner: null, result: "" }
];

function normalizeTeamName(name) {
  return name.toUpperCase().replace(/\s+/g, " ").trim();
}

function extractTeamsFromFixture(teamsText) {
  const cleanText = teamsText.replace(" (Reverse)", "");
  const [a, b] = cleanText.split(" vs ");
  return [normalizeTeamName(a), normalizeTeamName(b)];
}

function createEmptyStandings() {
  const map = {};
  teams.forEach((team) => {
    map[team] = {
      team,
      played: 0,
      win: 0,
      loss: 0,
      tie: 0,
      noResult: 0,
      points: 0
    };
  });
  return map;
}

function calculateStandings() {
  const standings = createEmptyStandings();

  fixtures.forEach((match) => {
    if (match.status !== "completed") return;

    const [teamA, teamB] = extractTeamsFromFixture(match.teams);
    const rowA = standings[teamA];
    const rowB = standings[teamB];

    if (!rowA || !rowB) return;

    rowA.played += 1;
    rowB.played += 1;

    if (match.winner === "TIE") {
      rowA.tie += 1;
      rowB.tie += 1;
      rowA.points += 1;
      rowB.points += 1;
      return;
    }

    if (match.winner === "NO RESULT") {
      rowA.noResult += 1;
      rowB.noResult += 1;
      rowA.points += 1;
      rowB.points += 1;
      return;
    }

    const winner = normalizeTeamName(match.winner || "");

    if (winner === teamA) {
      rowA.win += 1;
      rowB.loss += 1;
      rowA.points += 2;
    } else if (winner === teamB) {
      rowB.win += 1;
      rowA.loss += 1;
      rowB.points += 2;
    }
  });

  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.win !== a.win) return b.win - a.win;
    return a.team.localeCompare(b.team);
  });
}

function renderPointsTable() {
  const pointsBody = document.querySelector("#pointsTable tbody");
  const standings = calculateStandings();

  pointsBody.innerHTML = standings
    .map(
      (row, index) => `
      <tr>
        <td class="pos">${index + 1}</td>
        <td>${row.team}</td>
        <td>${row.played}</td>
        <td>${row.win}</td>
        <td>${row.loss}</td>
        <td>${row.tie}</td>
        <td>${row.noResult}</td>
        <td><strong>${row.points}</strong></td>
      </tr>
    `
    )
    .join("");
}

function renderFixtures() {
  const fixtureBody = document.querySelector("#fixturesTable tbody");

  fixtureBody.innerHTML = fixtures
    .map(
      (match) => `
      <tr>
        <td>${match.id}</td>
        <td>${match.date}</td>
        <td>${match.teams}</td>
        <td>${match.time}</td>
        <td class="${match.status === "completed" ? "status-completed" : "status-pending"}">
          ${match.status.toUpperCase()}
        </td>
        <td>${match.result || "-"}</td>
      </tr>
    `
    )
    .join("");
}

function renderLastUpdated() {
  const stamp = new Date().toLocaleString();
  document.getElementById("lastUpdated").textContent = `Last updated: ${stamp}`;
}

function renderAll() {
  renderPointsTable();
  renderFixtures();
  renderLastUpdated();
}

renderAll();

// Auto-refresh every 60 seconds for live display screens.
setInterval(renderAll, 60000);
