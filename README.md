# Desert League Season 1 (2026) - Next.js Live Points Table

## Stack
- Next.js (frontend only)
- React
- CSS animations

## Project files
- `app/page.js` - main UI for points table and fixtures
- `app/globals.css` - animated modern design
- `lib/leagueData.js` - teams, fixtures, and standings logic
- `desert_league_logo.png` - league logo

## Run locally
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## Update match results
1. Open `lib/leagueData.js`.
2. Find a fixture (example `M1`) and set:
   - `status: "completed"`
   - `winner`: one of team names or `"TIE"` or `"NO RESULT"`
   - `result`: readable text (example `"Titans XI won by 22 runs"`)
3. Save and refresh.

## Deploy on Vercel
1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Deploy with default settings.
