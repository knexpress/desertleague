"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultFixtures } from "../../lib/leagueData";
import { readFixtures, saveFixtures } from "../../lib/storage";

function ResultEditor({ fixture, onChange }) {
  const [teamA, teamB] = useMemo(() => {
    const clean = fixture.teams.replace(" (Reverse)", "");
    const parts = clean.split(" vs ");
    return [parts[0], parts[1]];
  }, [fixture.teams]);

  return (
    <div className="admin-grid">
      <label>
        Status
        <select
          value={fixture.status}
          onChange={(e) => onChange({ status: e.target.value })}
        >
          <option value="pending">pending</option>
          <option value="completed">completed</option>
        </select>
      </label>

      <label>
        Winner
        <select
          value={fixture.winner || ""}
          onChange={(e) => onChange({ winner: e.target.value || null })}
        >
          <option value="">Select</option>
          <option value={teamA.toUpperCase()}>{teamA.toUpperCase()}</option>
          <option value={teamB.toUpperCase()}>{teamB.toUpperCase()}</option>
          <option value="TIE">TIE</option>
          <option value="NO RESULT">NO RESULT</option>
        </select>
      </label>

      <label>
        Win by type
        <select
          value={fixture.winByType || ""}
          onChange={(e) => onChange({ winByType: e.target.value })}
        >
          <option value="">Select</option>
          <option value="runs">runs</option>
          <option value="wickets">wickets</option>
        </select>
      </label>

      <label>
        Win by value
        <input
          type="number"
          min="0"
          value={fixture.winByValue}
          onChange={(e) => onChange({ winByValue: e.target.value })}
          placeholder="e.g. 23"
        />
      </label>

      <label>
        {teamA} runs
        <input
          type="number"
          min="0"
          value={fixture.teamAScore}
          onChange={(e) => onChange({ teamAScore: e.target.value })}
          placeholder="e.g. 167"
        />
      </label>

      <label>
        {teamA} overs
        <input
          type="text"
          value={fixture.teamAOvers}
          onChange={(e) => onChange({ teamAOvers: e.target.value })}
          placeholder="20 or 19.4"
        />
      </label>

      <label>
        {teamA} wickets
        <input
          type="number"
          min="0"
          max="10"
          value={fixture.teamAWickets}
          onChange={(e) => onChange({ teamAWickets: e.target.value })}
          placeholder="e.g. 6"
        />
      </label>

      <label>
        {teamB} runs
        <input
          type="number"
          min="0"
          value={fixture.teamBScore}
          onChange={(e) => onChange({ teamBScore: e.target.value })}
          placeholder="e.g. 159"
        />
      </label>

      <label>
        {teamB} overs
        <input
          type="text"
          value={fixture.teamBOvers}
          onChange={(e) => onChange({ teamBOvers: e.target.value })}
          placeholder="20 or 18.2"
        />
      </label>

      <label>
        {teamB} wickets
        <input
          type="number"
          min="0"
          max="10"
          value={fixture.teamBWickets}
          onChange={(e) => onChange({ teamBWickets: e.target.value })}
          placeholder="e.g. 8"
        />
      </label>

      <label className="admin-full">
        Custom result text (optional)
        <input
          type="text"
          value={fixture.result}
          onChange={(e) => onChange({ result: e.target.value })}
          placeholder="e.g. TITANS XI won by 8 wickets"
        />
      </label>
    </div>
  );
}

export default function AdminPage() {
  const [fixtures, setFixtures] = useState(defaultFixtures);
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    setFixtures(readFixtures());
  }, []);

  const updateFixture = (id, patch) => {
    setFixtures((current) =>
      current.map((fixture) =>
        fixture.id === id ? { ...fixture, ...patch } : fixture
      )
    );
  };

  const saveAll = () => {
    saveFixtures(fixtures);
    setSavedAt(new Date().toLocaleString());
  };

  const resetAll = () => {
    setFixtures(defaultFixtures);
    saveFixtures(defaultFixtures);
    setSavedAt(new Date().toLocaleString());
  };

  return (
    <main className="page">
      <div className="animated-bg" aria-hidden />
      <section className="card fade-up">
        <h1>Desert League Admin</h1>
        <p className="subtext">
          Route: <code>/09087801</code> | Edit fixtures, winner, margin, scores,
          and overs for NRR.
        </p>
        <div className="admin-actions">
          <button onClick={saveAll}>Save all updates</button>
          <button className="secondary" onClick={resetAll}>
            Reset all fixtures
          </button>
        </div>
        <p className="updated-at">
          Last admin save: {savedAt || "Not saved in this session"}
        </p>
      </section>

      {fixtures.map((fixture) => (
        <section key={fixture.id} className="card fade-up delay-1">
          <h2>
            {fixture.id} - {fixture.teams}
          </h2>
          <p className="subtext">
            {fixture.date} | {fixture.time}
          </p>
          <ResultEditor
            fixture={fixture}
            onChange={(patch) => updateFixture(fixture.id, patch)}
          />
        </section>
      ))}
    </main>
  );
}
