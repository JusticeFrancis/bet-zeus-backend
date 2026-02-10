const axios = require("axios");
const BASE_URL = "https://api.the-odds-api.com/v4";


// SportMonks API key
const SPORTMONKS_API_KEY = process.env.SPORTMONKS_API_KEY;

// Utility: check if a date is today (UTC)
function isTodayUTC(dateString) {
  const eventDate = new Date(dateString);
  const now = new Date();
  return (
    eventDate.getUTCFullYear() === now.getUTCFullYear() &&
    eventDate.getUTCMonth() === now.getUTCMonth() &&
    eventDate.getUTCDate() === now.getUTCDate()
  );
}

// Helper: check last 5 H2H games over 1.5 goals
function last5Over15(h2hGames) {
  const allOver2 = h2hGames.matches.every((game) => game.totalGoals >= 2);

  console.log("yeta", h2hGames.matches.length === 5 && allOver2);

  return h2hGames.matches.length === 5 && allOver2;
}

// Helper to sanitize input
function sanitizeTeamName(name) {
  // Normalize Unicode characters to compatible form
  let normalized = name.normalize("NFKD");

  // Replace non-ASCII characters with closest equivalents or remove
  normalized = normalized.replace(/[^\x00-\x7F]/g, ""); // removes anything > 127

  return normalized;
}
async function findTeam(input) {
  const safeInput = sanitizeTeamName(input);
  const url = `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(
    safeInput
  )}`;
  const headers = {
    "x-rapidapi-host": "football.api-sports.io",
    "x-rapidapi-key": process.env.API_FOOTBALL_KEY,
  };

  const res = await fetch(url, { headers });
  const data = await res.json();

  if (!data.response || data.response.length === 0) {
    return null;
  }

  return data.response.map((r) => ({
    id: r.team.id,
    name: r.team.name,
    code: r.team.code,
    country: r.team.country,
    logo: r.team.logo,
  }));
}

const BASE_URL_ =
  "https://raw.githubusercontent.com/openfootball/football.json/master";

/**
 * Fetch JSON safely
 */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url}`);
  return res.json();
}

/**
 * Get list of all JSON files in the repo
 * Uses GitHub API
 */
async function getAllJsonFiles() {
  const apiUrl =
    "https://api.github.com/repos/openfootball/football.json/contents";

  const files = await fetchJSON(apiUrl);

  return files;
}

/**
 * Normalize team names (VERY IMPORTANT)
 */
function normalize(name) {
  return name.toLowerCase().trim();
}

// Helper: normalize name (lowercase + remove non-alphanumeric)
function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Helper: create flexible regex from input
function createFuzzyPattern(name) {
  const normalized = normalizeName(name);
  const patternStr = normalized.split("").join(".*"); // letters in sequence
  return new RegExp(patternStr, "i");
}

// Helper: check if two names match fuzzily
function fuzzyMatch(input, target) {
  const pattern = createFuzzyPattern(input);
  const normalizedTarget = normalizeName(target);
  return pattern.test(normalizedTarget);
}

async function getHeadToHead(teamA, teamB, league) {
  const allMatches = [];
  const files = await getAllJsonFiles();

  for (const file of files) {
    try {
      const seasonData = await fetchJSON(
        `${BASE_URL_}/${file.name}/${league}.json`
      );

      const matches = seasonData.matches || [];

      for (const match of matches) {
        // 🔹 Fuzzy match instead of strict normalization
        const t1 = match.team1;
        const t2 = match.team2;

        const isH2H =
          (fuzzyMatch(teamA, t1) && fuzzyMatch(teamB, t2)) ||
          (fuzzyMatch(teamA, t2) && fuzzyMatch(teamB, t1));

        if (!isH2H) continue;
        if (!match.score || !match.score.ft || !match.date) continue;

        allMatches.push({
          date: match.date,
          team1: match.team1,
          team2: match.team2,
          t1,
          t2,
          g1: match.score.ft[0],
          g2: match.score.ft[1],
          season: seasonData.name || file.name,
        });
      }
    } catch {
      continue;
    }
  }

  // Sort by most recent
  allMatches.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Last 5 H2H
  const last5 = allMatches.slice(0, 5);

  const stats = {
    teamA,
    teamB,
    played: last5.length,
    teamAWins: 0,
    teamBWins: 0,
    draws: 0,
    goalsA: 0,
    goalsB: 0,
    totalGoals: 0,
    over2goals: false,
    matches: [],
  };

  // 🔹 STRICT over-2-goals check
  let allOver2 = last5.length === 5;

  for (const m of last5) {
    const matchTotalGoals = m.g1 + m.g2;
    stats.totalGoals += matchTotalGoals;

    if (matchTotalGoals < 2) allOver2 = false;

    // Determine orientation
    const isTeamAHome = fuzzyMatch(teamA, m.t1);
    const goalsA = isTeamAHome ? m.g1 : m.g2;
    const goalsB = isTeamAHome ? m.g2 : m.g1;

    stats.goalsA += goalsA;
    stats.goalsB += goalsB;

    if (goalsA > goalsB) stats.teamAWins++;
    else if (goalsB > goalsA) stats.teamBWins++;
    else stats.draws++;

    stats.matches.push({
      season: m.season,
      date: m.date,
      team1: m.team1,
      team2: m.team2,
      score: `${m.g1}-${m.g2}`,
      totalGoals: matchTotalGoals,
      over2goals: matchTotalGoals >= 2,
    });
  }

  // 🔹 FINAL FLAG
  stats.over2goals = allOver2;

  return stats;
}

async function getTeamId(teamName, leagueId, season) {
  const res = await axios.get(`https://v3.football.api-sports.io/teams`, {
    params: { search: teamName, league: leagueId, season },
    headers: {
      "x-rapidapi-host": "football.api-sports.io",
      "x-rapidapi-key": process.env.API_FOOTBALL_KEY,
    },
  });
  return res.data.response[0]?.team?.id ?? null;
}

// Main function to analyze match odds

// Helper to fetch live matches from Live Score API
async function fetchLiveScores() {
  try {
    const res = await axios.get(
      `https://livescore-api.com/api-client/matches/live.json`,
      {
        params: {
          key: process.env.LIVESCORE_API_KEY,
          secret: process.env.LIVESCORE_API_SECRET,
        },
      }
    );
    return res.data.data.match || [];
  } catch (err) {
    console.error("Live Score API error:", err.response?.data || err.message);
    return [];
  }
}

async function analyzeMatchOdds(
  sportKey = "soccer_spain_la_liga",
  league = "es.1"
) {
  try {
    const regions = "uk,eu";
    const markets = "h2h,totals";

    // Fetch odds from Odds API
    const oddsResponse = await axios.get(
      `${BASE_URL}/sports/${sportKey}/odds/`,
      {
        params: {
          apiKey: process.env.API_KEY,
          regions,
          markets,
          oddsFormat: "decimal",
          dateFormat: "iso",
        },
      }
    );

    const allGames = oddsResponse.data || [];
    const todaysGames = allGames.filter((game) =>
      isTodayUTC(game.commence_time)
    );

    if (!todaysGames.length) {
      return { message: "No matches today" };
    }

    const now = new Date();

    // Fetch live scores from Live Score API once
    const liveMatches = await fetchLiveScores();

    const analysisResults = await Promise.all(
      todaysGames.map(async (match) => {
        const home_team = match.home_team;
        const away_team = match.away_team;

        // H2H last 5 games
        const h2h_last_5_games = await getHeadToHead(
          home_team,
          away_team,
          league
        );

        // Try to find live match in Live Score API
        const liveMatch = liveMatches.find(
          (lm) =>
            lm.home.name.toLowerCase() === home_team.toLowerCase() &&
            lm.away.name.toLowerCase() === away_team.toLowerCase()
        );

        let matchMinute = 0;
        let ismatch_live = false;
        let home_team_score = 0;
        let away_team_score = 0;

        if (liveMatch) {
          // Parse minute if numeric
          const timeStr = liveMatch.time;
          console.log(liveMatch);
          matchMinute = liveMatch.time;

          // Live only if "IN PLAY"
          ismatch_live = liveMatch.status === "IN PLAY";

          // Parse score
          const [h, a] = liveMatch.scores.score
            .split("-")
            .map((s) => parseInt(s.trim(), 10));
          home_team_score = h ?? 0;
          away_team_score = a ?? 0;
        }

        // Odds logic
        const totalsMarket = match.bookmakers?.[0]?.markets?.find(
          (m) => m.key === "totals"
        );

        const over05 = totalsMarket?.outcomes?.find(
          (o) => o.name.toLowerCase().includes("over") && o.price >= 0.6
        );

        const goals_odd = over05?.price ?? null;

        const isGoalless = home_team_score + away_team_score === 0;
        const over05LowOdds = goals_odd !== null && goals_odd <= 1.5;

        const h2hOver15 = last5Over15(h2h_last_5_games);

        const alert =
          ismatch_live &&
          matchMinute >= 30 &&
          matchMinute <= 50 &&
          isGoalless &&
          // over05LowOdds &&
          h2hOver15;

        return {
          match: `${home_team} vs ${away_team}`,
          commence_time: match.commence_time,
          ismatch_live,
          matchMinute,
          home_team,
          away_team,
          home_team_score,
          away_team_score,
          goals_odd,
          h2h_last_5_games,
          alert,
        };
      })
    );

    return {
      total_matches: analysisResults.length,
      matches: analysisResults,
    };
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return { error: error.message };
  }
}

async function test(req, res) {
  console.log('hi')
  const result_laliga = await analyzeMatchOdds("soccer_spain_la_liga", "es.1");
  const result_pl = await analyzeMatchOdds("soccer_epl", "en.1");

  console.log(result_pl);

  for (const m of result_laliga.matches) {
    // if (!m.alert) continue;

    const message = `
    <b>🚨 LIVE BET ALERT</b>
    
    <b>${m.match}</b>
    ⏱ Minute: <b>${m.matchMinute}'</b>
    ⚽ Score: <b>${m.home_team_score}-${m.away_team_score}</b>
    
    <b>📊 Head-to-Head (Last 5)</b>
    • Played: ${m.h2h_last_5_games.played}
    • ${m.home_team} Wins: ${m.h2h_last_5_games.teamAWins}
    • ${m.away_team} Wins: ${m.h2h_last_5_games.teamBWins}
    • Draws: ${m.h2h_last_5_games.draws}
    • Total Goals: ${m.h2h_last_5_games.totalGoals}
    • Over 1.5 Goals: ${m.h2h_last_5_games.over2goals ? "✅ YES" : "❌ NO"}
    
    <b>💰 Market</b>
    • Over 0.5 Goals Odds: <b>${m.goals_odd ?? "N/A"}</b>
    
    <b>📡 Status</b>
    • Live: ${m.ismatch_live ? "✅ Yes" : "❌ No"}
    
    <b>⚠️ Insight</b>
    High probability of at least two goals before FT.
    `;

   await sendTelegramAlert(message);
  }
  for (const m of result_pl.matches) {
    // if (!m.alert) continue;

    const message = `
    <b>🚨 LIVE BET ALERT</b>
    
    <b>${m.match}</b>
    ⏱ Minute: <b>${m.matchMinute}'</b>
    ⚽ Score: <b>${m.home_team_score}-${m.away_team_score}</b>
    
    <b>📊 Head-to-Head (Last 5)</b>
    • Played: ${m.h2h_last_5_games.played}
    • ${m.home_team} Wins: ${m.h2h_last_5_games.teamAWins}
    • ${m.away_team} Wins: ${m.h2h_last_5_games.teamBWins}
    • Draws: ${m.h2h_last_5_games.draws}
    • Total Goals: ${m.h2h_last_5_games.totalGoals}
    • Over 1.5 Goals: ${m.h2h_last_5_games.over2goals ? "✅ YES" : "❌ NO"}
    
    <b>💰 Market</b>
    • Over 0.5 Goals Odds: <b>${m.goals_odd ?? "N/A"}</b>
    
    <b>📡 Status</b>
    • Live: ${m.ismatch_live ? "✅ Yes" : "❌ No"}
    
    <b>⚠️ Insight</b>
    High probability of at least two goals before FT.
    `;

    await sendTelegramAlert(message);
  }

  return res.json({
    laliga: result_laliga,
    premier_league: result_pl,
  });
}

async function sendTelegramAlert(message) {
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: process.env.TG_CHAT_ID,
    text: message,
    parse_mode: "HTML",
  });
}












module.exports = { test };
