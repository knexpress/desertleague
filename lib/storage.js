import { defaultFixtures } from "./leagueData";

const STORAGE_KEY = "desert-league-fixtures-v1";

export function readFixtures() {
  if (typeof window === "undefined") return defaultFixtures;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultFixtures;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultFixtures;
    return parsed.map((fixture, index) => ({
      ...defaultFixtures[index],
      ...fixture
    }));
  } catch {
    return defaultFixtures;
  }
}

export function saveFixtures(fixtures) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fixtures));
}
