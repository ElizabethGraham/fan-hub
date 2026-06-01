import type { Metadata } from "next";
import KeyMatchup from "@/components/KeyMatchup";
import TeamComparison from "@/components/TeamComparison";
import StartingLineups from "@/components/StartingLineups";
import PlayersToWatch from "@/components/PlayersToWatch";
import GameCharts from "@/components/GameCharts";
import JerseyShop from "@/components/JerseyShop";
import Layout from "@/components/Layout";
import { getSeasonSchedule } from "@/lib/schedule";
import { getNBASeasonYear } from "@/lib/nba";
import { SPURS_ALIAS } from "@/lib/constants";
import type {
  GameDisplay,
  NBAGameChartData,
  NBAPlayer,
  NBAPlayerStats,
} from "@/lib/types";
import {
  fetchSRTeamProfile,
  fetchSRGameSummary,
  fetchSRDepthChart,
  fetchSRTeamSeasonStats,
} from "@/lib/sportradar";
import { isPregameGame } from "@/lib/gameDisplay";
import {
  srPlayerToNBAPlayer,
  srSummaryToSplitStats,
  applyDepthChart,
  applySeasonStats,
  teamSeasonChartStats,
  teamSeasonChartStatsFromPlayers,
} from "@/lib/sportradarMapper";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

// W/L for the last 5 completed games for a given team alias.
function last5WL(allGames: GameDisplay[], alias: string): ("W" | "L")[] {
  return allGames
    .filter(
      (g) =>
        g.status === "final" &&
        (g.homeTeam.alias === alias || g.awayTeam.alias === alias),
    )
    .slice(0, 5)
    .map((g) => {
      const isHome = g.homeTeam.alias === alias;
      const teamScore = isHome ? g.homeTeamScore : g.awayTeamScore;
      const oppScore = isHome ? g.awayTeamScore : g.homeTeamScore;
      return teamScore > oppScore ? "W" : "L";
    });
}

function latestCompletedGameForTeam(
  allGames: GameDisplay[],
  alias: string,
): GameDisplay | null {
  return (
    allGames.find(
      (g) =>
        g.status === "final" &&
        (g.homeTeam.alias === alias || g.awayTeam.alias === alias),
    ) ?? null
  );
}

function applyLastGameStarters(
  players: NBAPlayer[],
  stats: NBAPlayerStats[],
): NBAPlayer[] {
  const currentRanks = players
    .map((player) => player.depthChartRank)
    .filter((rank): rank is number => rank !== undefined);
  if (currentRanks.length >= 5) return players;

  let nextRank = currentRanks.length ? Math.max(...currentRanks) + 1 : 1;
  const rankBySrId = new Map(
    players
      .filter((player) => player.srId && player.depthChartRank !== undefined)
      .map((player) => [player.srId!, player.depthChartRank!]),
  );

  for (const starter of stats.filter((entry) => entry.player.starter)) {
    const srId = starter.player.srId;
    if (!srId || rankBySrId.has(srId)) continue;
    rankBySrId.set(srId, nextRank++);
  }

  return players.map((player) => ({
    ...player,
    depthChartRank: player.srId
      ? (rankBySrId.get(player.srId) ?? player.depthChartRank)
      : player.depthChartRank,
  }));
}

async function lastStarterStatsForTeam(
  allGames: GameDisplay[],
  alias: string,
): Promise<NBAPlayerStats[]> {
  const lastGame = latestCompletedGameForTeam(allGames, alias);
  if (!lastGame) return [];

  try {
    const split = srSummaryToSplitStats(await fetchSRGameSummary(lastGame.id));
    return lastGame.homeTeam.alias === alias
      ? split.homeStats
      : split.awayStats;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const all = await getSeasonSchedule();
    const game = all.find((g) => g.id === id);
    if (!game) return { title: "Game Not Found | Spurs Fan Hub" };
    const homeFull = [game.homeTeam.market, game.homeTeam.name]
      .filter(Boolean)
      .join(" ");
    const awayFull = [game.awayTeam.market, game.awayTeam.name]
      .filter(Boolean)
      .join(" ");
    return {
      title: `${homeFull} vs ${awayFull} - ${game.date} | Spurs Fan Hub`,
      description: game.preview.headline,
      openGraph: {
        title: `${homeFull} vs ${awayFull} | Spurs Fan Hub`,
        description: game.preview.headline,
        type: "article",
      },
      twitter: {
        card: "summary",
        title: `${homeFull} vs ${awayFull} | Spurs Fan Hub`,
        description: game.preview.headline,
      },
    };
  } catch {
    return { title: "Spurs Fan Hub" };
  }
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;

  let allGames: GameDisplay[] = [];
  try {
    allGames = await getSeasonSchedule();
  } catch {
    return notFound();
  }

  const game = allGames.find((g) => g.id === id) ?? null;
  if (!game) return notFound();

  const isSpursHome = game.homeTeam.alias === SPURS_ALIAS;
  const opponentAlias = isSpursHome ? game.awayTeam.alias : game.homeTeam.alias;

  // Both W/L records from the single cached schedule — no extra API calls.
  const spursWL = last5WL(allGames, SPURS_ALIAS);
  const opponentWL = last5WL(allGames, opponentAlias);
  const homeWL = isSpursHome ? spursWL : opponentWL;
  const awayWL = isSpursHome ? opponentWL : spursWL;

  // ── Rosters: SR team GUIDs come directly from the cached schedule entry.
  let homePlayers: NBAPlayer[] = [];
  let awayPlayers: NBAPlayer[] = [];
  let homeSeasonChartStats: NBAGameChartData["homeStats"] | null = null;
  let awaySeasonChartStats: NBAGameChartData["awayStats"] | null = null;

  const homeSRTeamId = game.homeTeam.id;
  const awaySRTeamId = game.awayTeam.id;

  if (homeSRTeamId && awaySRTeamId) {
    try {
      const [homeProfile, awayProfile] = await Promise.all([
        fetchSRTeamProfile(homeSRTeamId),
        fetchSRTeamProfile(awaySRTeamId),
      ]);
      if (homeProfile?.players?.length)
        homePlayers = homeProfile.players.map((p) => srPlayerToNBAPlayer(p));
      if (awayProfile?.players?.length)
        awayPlayers = awayProfile.players.map((p) => srPlayerToNBAPlayer(p));
    } catch {
      /* SR profiles unavailable */
    }
  }

  // ── Pregame cards: depth-chart rank + season averages for sorting/display.
  if (isPregameGame(game.status) && homeSRTeamId && awaySRTeamId) {
    const seasonYear = getNBASeasonYear();
    const [
      homeDepth,
      awayDepth,
      homeSeason,
      awaySeason,
      homeLastStarters,
      awayLastStarters,
    ] = await Promise.allSettled([
      fetchSRDepthChart(homeSRTeamId),
      fetchSRDepthChart(awaySRTeamId),
      fetchSRTeamSeasonStats(homeSRTeamId, seasonYear),
      fetchSRTeamSeasonStats(awaySRTeamId, seasonYear),
      lastStarterStatsForTeam(allGames, game.homeTeam.alias),
      lastStarterStatsForTeam(allGames, game.awayTeam.alias),
    ]);
    if (homeDepth.status === "fulfilled")
      homePlayers = applyDepthChart(homePlayers, homeDepth.value);
    if (awayDepth.status === "fulfilled")
      awayPlayers = applyDepthChart(awayPlayers, awayDepth.value);
    if (homeSeason.status === "fulfilled") {
      homePlayers = applySeasonStats(homePlayers, homeSeason.value);
      homeSeasonChartStats = teamSeasonChartStats(homeSeason.value);
    }
    if (awaySeason.status === "fulfilled") {
      awayPlayers = applySeasonStats(awayPlayers, awaySeason.value);
      awaySeasonChartStats = teamSeasonChartStats(awaySeason.value);
    }
    if (homeLastStarters.status === "fulfilled")
      homePlayers = applyLastGameStarters(homePlayers, homeLastStarters.value);
    if (awayLastStarters.status === "fulfilled")
      awayPlayers = applyLastGameStarters(awayPlayers, awayLastStarters.value);
  }

  // ── Box scores: SR game summary — game.id IS the SR game GUID.
  let homeStats: NBAPlayerStats[] = [];
  let awayStats: NBAPlayerStats[] = [];
  let chartData: NBAGameChartData | null = null;

  if (game.status === "final" || game.status === "live") {
    try {
      const summary = await fetchSRGameSummary(game.id);
      const split = srSummaryToSplitStats(summary);
      homeStats = split.homeStats;
      awayStats = split.awayStats;
      chartData = split.chartData;
    } catch {
      /* SR summary unavailable */
    }
  } else if (isPregameGame(game.status)) {
    const homeSeasonStats =
      homeSeasonChartStats ?? teamSeasonChartStatsFromPlayers(homePlayers);
    const awaySeasonStats =
      awaySeasonChartStats ?? teamSeasonChartStatsFromPlayers(awayPlayers);
    if (homeSeasonStats && awaySeasonStats) {
      chartData = {
        homeStats: homeSeasonStats,
        awayStats: awaySeasonStats,
        periods: [],
      };
    }
  }

  return (
    <Layout>
      <KeyMatchup game={game} chartData={chartData} />

      <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4">
        <TeamComparison game={game} homeWL={homeWL} awayWL={awayWL} />

        <StartingLineups
          game={game}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          homeStats={homeStats}
          awayStats={awayStats}
        />

        <PlayersToWatch
          game={game}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          homeStats={homeStats}
          awayStats={awayStats}
        />

        <GameCharts
          game={game}
          homeStats={homeStats}
          awayStats={awayStats}
          chartData={chartData}
        />

        <JerseyShop />
      </div>
    </Layout>
  );
}
