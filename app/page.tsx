import type { Metadata } from "next";
import FeaturedGame from "@/components/FeaturedGame";
import GameSection from "@/components/GameSection";
import Layout from "@/components/Layout";
import PlayoffSnapshot, {
  type PlayoffGameLeader,
  type PlayoffLeader,
  type PlayoffSnapshotData,
  type PlayoffTrendGame,
} from "@/components/PlayoffSnapshot";
import { getSeasonSchedule } from "@/lib/schedule";
import { fetchSRGameSummary } from "@/lib/sportradar";
import { srSummaryToSplitStats } from "@/lib/sportradarMapper";
import {
  CENTRAL_TIMEZONE,
  DATE_KEY_LOCALE,
  SPURS_ALIAS,
} from "@/lib/constants";
import { isPossibleGame } from "@/lib/gameDisplay";
import { spursOpponent, spursSeriesLabel } from "@/lib/playoffs";
import type {
  GameDisplay,
  NBAPlayerStats,
  NBATeamChartStats,
} from "@/lib/types";

function centralToday(): string {
  return new Intl.DateTimeFormat(DATE_KEY_LOCALE, {
    timeZone: CENTRAL_TIMEZONE,
  }).format(new Date());
}

function byDateAsc(a: GameDisplay, b: GameDisplay): number {
  return a.date.localeCompare(b.date);
}

function byDateDesc(a: GameDisplay, b: GameDisplay): number {
  return b.date.localeCompare(a.date);
}

function sectionGames(games: GameDisplay[]) {
  const today = centralToday();
  const live = games.filter((g) => g.status === "live").sort(byDateAsc);
  const recent = games.filter((g) => g.status === "final").sort(byDateDesc);
  const confirmedUpcoming = games
    .filter(
      (g) => g.status === "scheduled" && g.date >= today && !isPossibleGame(g),
    )
    .sort(byDateAsc);
  const possibleUpcoming = games
    .filter((g) => g.date >= today && isPossibleGame(g))
    .sort(byDateAsc);

  const featured =
    live[0] ??
    confirmedUpcoming[0] ??
    recent[0] ??
    possibleUpcoming[0] ??
    games[0] ??
    null;
  const withoutFeatured = (game: GameDisplay) => game.id !== featured?.id;

  return {
    featured,
    live: live.filter(withoutFeatured),
    recent: recent.filter(withoutFeatured).slice(0, 3),
    confirmedUpcoming: confirmedUpcoming.filter(withoutFeatured).slice(0, 5),
    possibleUpcoming: possibleUpcoming.filter(withoutFeatured).slice(0, 5),
  };
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function playerName(stats: NBAPlayerStats): string {
  return `${stats.player.first_name} ${stats.player.last_name}`;
}

function gameLeaders(stats: NBAPlayerStats[]): PlayoffGameLeader[] {
  return stats
    .filter((player) => player.pts + player.reb + player.ast > 0)
    .map((player) => ({
      key: player.player.srId ?? String(player.player.id),
      name: playerName(player),
      pts: player.pts,
      reb: player.reb,
      ast: player.ast,
    }))
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 3);
}

type PlayerTotals = {
  key: string;
  name: string;
  games: number;
  pts: number;
  reb: number;
  ast: number;
};

async function getPlayoffSnapshot(
  games: GameDisplay[],
): Promise<PlayoffSnapshotData | null> {
  const completed = games
    .filter((game) => game.status === "final")
    .sort(byDateAsc);

  if (completed.length === 0) return null;

  const summaries = await Promise.allSettled(
    completed.map(async (game) => {
      const summary = await fetchSRGameSummary(game.id);
      const split = srSummaryToSplitStats(summary);
      const isSpursHome = game.homeTeam.alias === SPURS_ALIAS;
      const teamStats = isSpursHome
        ? split.chartData?.homeStats
        : split.chartData?.awayStats;
      const playerStats = isSpursHome ? split.homeStats : split.awayStats;
      if (!teamStats) return null;

      return {
        game,
        teamStats,
        playerStats,
      };
    }),
  );

  const rows = summaries
    .filter((result) => result.status === "fulfilled" && result.value)
    .map(
      (result) =>
        (
          result as PromiseFulfilledResult<{
            game: GameDisplay;
            teamStats: NBATeamChartStats;
            playerStats: NBAPlayerStats[];
          }>
        ).value,
    );

  if (rows.length === 0) return null;

  const wins = rows.filter(({ game }) => {
    const spursScore =
      game.homeTeam.alias === SPURS_ALIAS
        ? game.homeTeamScore
        : game.awayTeamScore;
    const opponentScore =
      game.homeTeam.alias === SPURS_ALIAS
        ? game.awayTeamScore
        : game.homeTeamScore;
    return spursScore > opponentScore;
  }).length;

  const trend: PlayoffTrendGame[] = rows.map(
    ({ game, playerStats, teamStats }) => {
      const spursPoints =
        game.homeTeam.alias === SPURS_ALIAS
          ? game.homeTeamScore
          : game.awayTeamScore;
      const opponentPoints =
        game.homeTeam.alias === SPURS_ALIAS
          ? game.awayTeamScore
          : game.homeTeamScore;
      const opponent = spursOpponent(game);
      const result = spursPoints > opponentPoints ? "W" : "L";
      return {
        id: game.id,
        label: game.title ?? game.date,
        seriesLabel: spursSeriesLabel(game),
        opponentAlias: opponent.alias,
        spursPoints,
        opponentPoints,
        result,
        fgPct: teamStats.fgPct,
        reb: teamStats.reb,
        ast: teamStats.ast,
        leaders: gameLeaders(playerStats),
      };
    },
  );

  const playerTotals = new Map<string, PlayerTotals>();
  for (const row of rows) {
    for (const stats of row.playerStats) {
      if (stats.pts + stats.reb + stats.ast === 0) continue;
      const key = stats.player.srId ?? String(stats.player.id);
      const current = playerTotals.get(key) ?? {
        key,
        name: playerName(stats),
        games: 0,
        pts: 0,
        reb: 0,
        ast: 0,
      };
      current.games += 1;
      current.pts += stats.pts;
      current.reb += stats.reb;
      current.ast += stats.ast;
      playerTotals.set(key, current);
    }
  }

  const leaders: PlayoffLeader[] = [...playerTotals.values()]
    .map((player) => ({
      key: player.key,
      name: player.name,
      ppg: player.pts / player.games,
      rpg: player.reb / player.games,
      apg: player.ast / player.games,
    }))
    .sort((a, b) => b.ppg - a.ppg);

  const spursPoints = trend.map((game) => game.spursPoints);
  const opponentPoints = trend.map((game) => game.opponentPoints);
  const teamStats = rows.map((row) => row.teamStats);

  return {
    wins,
    losses: rows.length - wins,
    avgPoints: avg(spursPoints),
    avgAllowed: avg(opponentPoints),
    avgMargin: avg(trend.map((game) => game.spursPoints - game.opponentPoints)),
    fgPct: avg(teamStats.map((stats) => stats.fgPct)),
    fg3Pct: avg(teamStats.map((stats) => stats.fg3Pct)),
    rebounds: avg(teamStats.map((stats) => stats.reb)),
    assists: avg(teamStats.map((stats) => stats.ast)),
    turnovers: avg(teamStats.map((stats) => stats.tov)),
    trend,
    leaders,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const all = await getSeasonSchedule();
    const spursGames = all.filter(
      (g) =>
        g.homeTeam.alias === SPURS_ALIAS || g.awayTeam.alias === SPURS_ALIAS,
    );
    const scheduledCount = spursGames.filter(
      (g) => g.status === "scheduled",
    ).length;
    const liveCount = spursGames.filter((g) => g.status === "live").length;
    return {
      title: "Spurs Fan Hub - San Antonio Spurs Games & Analysis",
      description: `Track the San Antonio Spurs season with live game updates, matchup analysis, player rosters, and stats. ${scheduledCount} games coming up${liveCount > 0 ? `, ${liveCount} live` : ""}.`,
      openGraph: {
        title: "Spurs Fan Hub - San Antonio Spurs Games & Analysis",
        description: `Track the San Antonio Spurs season with live game updates, matchup analysis, player rosters, and stats. ${scheduledCount} games coming up${liveCount > 0 ? `, ${liveCount} live` : ""}.`,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Spurs Fan Hub - San Antonio Spurs Games & Analysis",
      description:
        "Track the San Antonio Spurs season with live game updates, matchup analysis, player rosters, and stats.",
    };
  }
}

export default async function Home() {
  let games: GameDisplay[] = [];
  let playoffSnapshot: PlayoffSnapshotData | null = null;
  let error = false;

  try {
    const all = await getSeasonSchedule();
    games = all.filter(
      (g) =>
        g.homeTeam.alias === SPURS_ALIAS || g.awayTeam.alias === SPURS_ALIAS,
    );
    playoffSnapshot = await getPlayoffSnapshot(games);
  } catch (err) {
    console.error("[Home] getSeasonSchedule failed:", err);
    error = true;
  }

  const sections = sectionGames(games);

  return (
    <Layout>
      {error ? (
        <div className="surface-panel p-6 text-center">
          <div className="text-2xl mb-2">⏱</div>
          <div className="font-black text-white text-sm mb-1">
            Schedule unavailable
          </div>
          <div className="text-xs text-ui-muted">
            Could not reach the Sportradar API.
            <br />
            Refresh in a moment — once loaded, results are cached for the
            season.
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {sections.featured ? (
            <>
              <FeaturedGame game={sections.featured} />

              {playoffSnapshot && <PlayoffSnapshot data={playoffSnapshot} />}

              <GameSection
                title="Live Updates"
                description="Games in progress right now."
                games={sections.live}
              />

              <GameSection
                title="Recent Results"
                description="Latest completed games."
                games={sections.recent}
              />

              <GameSection
                title="Upcoming games"
                description="Next scheduled matchups."
                games={sections.confirmedUpcoming}
              />

              <GameSection
                title="Possible Games"
                description="Conditional playoff dates."
                games={sections.possibleUpcoming}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-ui-muted">No games found for this season.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
