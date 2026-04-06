"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { calculateStandings, defaultFixtures, formatMatchResult } from "../lib/leagueData";
import { readFixtures } from "../lib/storage";
import logo from "../desert_league_logo.png";

export default function HomePage() {
  const [fixtures, setFixtures] = useState(defaultFixtures);
  const [updatedAt, setUpdatedAt] = useState("");
  const standings = useMemo(() => calculateStandings(fixtures), [fixtures]);

  useEffect(() => {
    const syncFixtures = () => {
      setFixtures(readFixtures());
      setUpdatedAt(new Date().toLocaleString());
    };

    syncFixtures();
    window.addEventListener("storage", syncFixtures);
    const intervalId = window.setInterval(syncFixtures, 10000);
    return () => {
      window.removeEventListener("storage", syncFixtures);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setUpdatedAt(new Date().toLocaleString());
  }, [fixtures]);

  return (
    <main className="page">
      <div className="animated-bg" aria-hidden />

      <header className="hero card fade-up">
        <div className="logo-wrap pulse">
          <Image
            src={logo}
            alt="Desert League logo"
            width={96}
            height={96}
            priority
          />
        </div>
        <div>
          <p className="eyebrow">Live Tournament Tracker</p>
          <h1>Desert League Season 1 (2026)</h1>
          <p className="updated-at">
            Last updated: {updatedAt || "Loading..."}
          </p>
        </div>
      </header>

      <section className="card fade-up delay-1">
        <div className="title-row">
          <h2>Points Table</h2>
          <span className="badge">2 pts win | 1 pt tie/no result</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>L</th>
                <th>T</th>
                <th>NR</th>
                <th>Pts</th>
                <th>NRR</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row, index) => (
                <tr key={row.team} className="row-animate">
                  <td className="pos">{index + 1}</td>
                  <td>{row.team}</td>
                  <td>{row.played}</td>
                  <td>{row.win}</td>
                  <td>{row.loss}</td>
                  <td>{row.tie}</td>
                  <td>{row.noResult}</td>
                  <td>
                    <strong>{row.points}</strong>
                  </td>
                  <td>{row.nrr.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card fade-up delay-2">
        <h2>Fixtures & Results</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Match</th>
                <th>Date</th>
                <th>Teams</th>
                <th>Time</th>
                <th>Status</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {fixtures.map((match) => (
                <tr key={match.id} className="row-animate">
                  <td>{match.id}</td>
                  <td>{match.date}</td>
                  <td>{match.teams}</td>
                  <td>{match.time}</td>
                  <td
                    className={
                      match.status === "completed"
                        ? "status-completed"
                        : "status-pending"
                    }
                  >
                    {match.status.toUpperCase()}
                  </td>
                  <td>{formatMatchResult(match)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
