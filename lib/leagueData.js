export const teams = [
  "TITANS XI",
  "AVENGERS XI",
  "ZA RISING STARS",
  "AL AIN UNITED",
  "VENOM SQUAD"
];

function makeFixture(id, date, teamsText, time) {
  return {
    id,
    date,
    teams: teamsText,
    time,
    status: "pending",
    winner: null,
    result: "",
    teamAScore: "",
    teamAOvers: "",
    teamAWickets: "",
    teamBScore: "",
    teamBOvers: "",
    teamBWickets: "",
    winByType: "",
    winByValue: ""
  };
}

export const defaultFixtures = [
  makeFixture("M1", "Thu, Apr 9", "Titans XI vs Venom Squad", "9:00 PM"),
  makeFixture("M2", "Mon, Apr 13", "Al Ain United vs Avengers XI", "9:00 PM"),
  makeFixture("M3", "Wed, Apr 15, 2025", "ZA Rising Stars vs Venom Squad", "9:00 PM"),
  makeFixture("M4", "Thu, Apr 16, 2025", "Al Ain United vs Titans XI", "9:00 PM"),
  makeFixture("M5", "Fri, Apr 17, 2025", "Avengers XI vs Venom Squad", "9:00 PM"),
  makeFixture("M6", "Mon, Apr 20, 2025", "ZA Rising Stars vs Titans XI", "9:00 PM"),
  makeFixture("M7", "Thu, Apr 23, 2025", "Titans XI vs Avengers XI", "9:00 PM"),
  makeFixture("M8", "Fri, Apr 24, 2025", "Al Ain United vs Venom Squad", "9:00 PM"),
  makeFixture("M9", "Mon, Apr 27, 2025", "ZA Rising Stars vs Al Ain United", "9:00 PM"),
  makeFixture("M10", "Fri, May 1, 2025", "Avengers XI vs Al Ain United (Reverse)", "9:00 PM"),
  makeFixture("M11", "Mon, May 4, 2025", "ZA Rising Stars vs Avengers XI (Reverse)", "9:00 PM"),
  makeFixture("M12", "Thu, May 7, 2025", "Titans XI vs Al Ain United (Reverse)", "9:00 PM"),
  makeFixture("M13", "Fri, May 8, 2025", "Venom Squad vs Avengers XI (Reverse)", "9:00 PM"),
  makeFixture("M14", "Mon, May 11, 2025", "ZA Rising Stars vs Venom Squad (Reverse)", "9:00 PM"),
  makeFixture("M15", "Thu, May 14, 2025", "Avengers XI vs Titans XI (Reverse)", "9:00 PM"),
  makeFixture("M16", "Sat, May 16, 2025", "ZA Rising Stars vs Titans XI (Reverse)", "9:00 PM"),
  makeFixture("M17", "Mon, May 18, 2025", "Al Ain United vs ZA Rising Stars (Reverse)", "9:00 PM"),
  makeFixture("M18", "Thu, May 21, 2025", "Avengers XI vs Venom Squad (Reverse)", "9:00 PM"),
  makeFixture("M19", "Sat, May 23, 2025", "Venom Squad vs Al Ain United (Reverse)", "9:00 PM")
];

function normalizeTeamName(name) {
  return name.toUpperCase().replace(/\s+/g, " ").trim();
}

function extractTeamsFromFixture(teamsText) {
  const cleanText = teamsText.replace(" (Reverse)", "");
  const [a, b] = cleanText.split(" vs ");
  return [normalizeTeamName(a), normalizeTeamName(b)];
}

function parseOvers(oversValue) {
  if (oversValue === "" || oversValue === null || oversValue === undefined) {
    return null;
  }
  const text = String(oversValue).trim();
  if (!text) return null;
  const parts = text.split(".");
  const overs = Number.parseInt(parts[0], 10);
  if (Number.isNaN(overs)) return null;

  if (parts.length === 1) return overs;

  const balls = Number.parseInt(parts[1], 10);
  if (Number.isNaN(balls) || balls < 0 || balls > 5) return null;
  return overs + balls / 6;
}

function parseNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
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
      points: 0,
      runsFor: 0,
      oversFaced: 0,
      runsAgainst: 0,
      oversBowled: 0,
      nrr: 0
    };
  });
  return map;
}

function addNrrData(row, runsFor, oversFaced, runsAgainst, oversBowled) {
  if (runsFor !== null && oversFaced !== null && oversFaced > 0) {
    row.runsFor += runsFor;
    row.oversFaced += oversFaced;
  }
  if (runsAgainst !== null && oversBowled !== null && oversBowled > 0) {
    row.runsAgainst += runsAgainst;
    row.oversBowled += oversBowled;
  }
}

export function calculateStandings(matchList = defaultFixtures) {
  const standings = createEmptyStandings();

  matchList.forEach((match) => {
    if (match.status !== "completed") return;

    const [teamA, teamB] = extractTeamsFromFixture(match.teams);
    const rowA = standings[teamA];
    const rowB = standings[teamB];
    if (!rowA || !rowB) return;

    rowA.played += 1;
    rowB.played += 1;

    const teamAScore = parseNumber(match.teamAScore);
    const teamAOvers = parseOvers(match.teamAOvers);
    const teamBScore = parseNumber(match.teamBScore);
    const teamBOvers = parseOvers(match.teamBOvers);

    addNrrData(rowA, teamAScore, teamAOvers, teamBScore, teamBOvers);
    addNrrData(rowB, teamBScore, teamBOvers, teamAScore, teamAOvers);

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

  const table = Object.values(standings).map((row) => {
    const scoringRate =
      row.oversFaced > 0 ? row.runsFor / row.oversFaced : 0;
    const concedeRate =
      row.oversBowled > 0 ? row.runsAgainst / row.oversBowled : 0;
    return { ...row, nrr: scoringRate - concedeRate };
  });

  return table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.nrr !== a.nrr) return b.nrr - a.nrr;
    if (b.win !== a.win) return b.win - a.win;
    return a.team.localeCompare(b.team);
  });
}

export function formatMatchResult(match) {
  if (match.status !== "completed") return match.result || "-";
  if (match.result) return match.result;
  if (!match.winner || match.winner === "TIE" || match.winner === "NO RESULT") {
    return match.winner === "TIE" ? "Match tied" : "No result";
  }

  const margin = parseNumber(match.winByValue);
  if (!margin || !match.winByType) return `${match.winner} won`;
  return `${match.winner} won by ${margin} ${match.winByType}`;
}
