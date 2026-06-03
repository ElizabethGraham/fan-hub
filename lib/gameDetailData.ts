import type { Metadata } from "next";
import {
  CENTRAL_TIMEZONE,
  DATE_KEY_LOCALE,
  SPURS_ALIAS,
} from "@/lib/constants";
import { isPossibleGame, isPregameGame } from "@/lib/gameDisplay";
import { getNBASeasonYear } from "@/lib/nba";
import { getSeasonSchedule } from "@/lib/schedule";
import {
  fetchSRDepthChart,
  fetchSRGameSummary,
  fetchSRTeamProfile,
  fetchSRTeamSeasonStats,
} from "@/lib/sportradar";
import {
  applyDepthChart,
  applySeasonStats,
  srPlayerToNBAPlayer,
  srSummaryToSplitStats,
  teamSeasonChartStats,
  teamSeasonChartStatsFromPlayers,
} from "@/lib/sportradarMapper";
import type {
  GameDisplay,
  NBAGameChartData,
  NBAPlayer,
  NBAPlayerStats,
} from "@/lib/types";

type WLResult = "W" | "L";

export type GameDetailPageData = {
  game: GameDisplay;
  showDotRace: boolean;
  homeWL: WLResult[];
  awayWL: WLResult[];
  homePlayers: NBAPlayer[];
  awayPlayers: NBAPlayer[];
  homeStats: NBAPlayerStats[];
  awayStats: NBAPlayerStats[];
  chartData: NBAGameChartData | null;
};

function teamFullName(team: GameDisplay["homeTeam"]): string {
  return [team.market, team.name].filter(Boolean).join(" ");
}

function last5WL(allGames: GameDisplay[], alias: string): WLResult[] {
  return allGames
    .filter(
      (game) =>
        game.status === "final" &&
        (game.homeTeam.alias === alias || game.awayTeam.alias === alias),
    )
    .slice(0, 5)
    .map((game) => {
      const isHome = game.homeTeam.alias === alias;
      const teamScore = isHome ? game.homeTeamScore : game.awayTeamScore;
      const opponentScore = isHome ? game.awayTeamScore : game.homeTeamScore;
      return teamScore > opponentScore ? "W" : "L";
    });
}

function latestCompletedGameForTeam(
  allGames: GameDisplay[],
  alias: string,
): GameDisplay | null {
  return (
    allGames.find(
      (game) =>
        game.status === "final" &&
        (game.homeTeam.alias === alias || game.awayTeam.alias === alias),
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

function spursGames(games: GameDisplay[]): GameDisplay[] {
  return games.filter(
    (game) =>
      game.homeTeam.alias === SPURS_ALIAS || game.awayTeam.alias === SPURS_ALIAS,
  );
}

function byDateAsc(a: GameDisplay, b: GameDisplay): number {
  return a.date.localeCompare(b.date);
}

function byDateDesc(a: GameDisplay, b: GameDisplay): number {
  return b.date.localeCompare(a.date);
}

function featuredGame(games: GameDisplay[]): GameDisplay | null {
  const today = new Intl.DateTimeFormat(DATE_KEY_LOCALE, {
    timeZone: CENTRAL_TIMEZONE,
  }).format(new Date());
  const live = games.filter((item) => item.status === "live").sort(byDateAsc);
  const confirmedUpcoming = games
    .filter(
      (item) =>
        item.status === "scheduled" && item.date >= today && !isPossibleGame(item),
    )
    .sort(byDateAsc);
  const recent = games.filter((item) => item.status === "final").sort(byDateDesc);
  const possibleUpcoming = games
    .filter((item) => item.date >= today && isPossibleGame(item))
    .sort(byDateAsc);

  return (
    live[0] ??
    confirmedUpcoming[0] ??
    recent[0] ??
    possibleUpcoming[0] ??
    games[0] ??
    null
  );
}

function shouldShowDotRace(game: GameDisplay, allGames: GameDisplay[]): boolean {
  if (game.status === "live") return true;
  return featuredGame(spursGames(allGames))?.id === game.id;
}

async function lastStarterStatsForTeam(
  allGames: GameDisplay[],
  alias: string,
): Promise<NBAPlayerStats[]> {
  const lastGame = latestCompletedGameForTeam(allGames, alias);
  if (!lastGame) return [];

  try {
    const split = srSummaryToSplitStats(await fetchSRGameSummary(lastGame.id));
    return lastGame.homeTeam.alias === alias ? split.homeStats : split.awayStats;
  } catch {
    return [];
  }
}

async function loadRoster(teamId: string): Promise<NBAPlayer[]> {
  try {
    const profile = await fetchSRTeamProfile(teamId);
    return profile.players?.map((player) => srPlayerToNBAPlayer(player)) ?? [];
  } catch {
    return [];
  }
}

export async function getGameDetailMetadata(
  id: string,
): Promise<Metadata> {
  try {
    const game = (await getSeasonSchedule()).find((item) => item.id === id);
    if (!game) return { title: "Game Not Found | Spurs Fan Hub" };
    const homeFull = teamFullName(game.homeTeam);
    const awayFull = teamFullName(game.awayTeam);

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

export async function getGameDetailPageData(
  id: string,
): Promise<GameDetailPageData | null> {
  let allGames: GameDisplay[] = [];
  try {
    allGames = await getSeasonSchedule();
  } catch {
    return null;
  }

  const game = allGames.find((item) => item.id === id) ?? null;
  if (!game) return null;

  const isSpursHome = game.homeTeam.alias === SPURS_ALIAS;
  const opponentAlias = isSpursHome ? game.awayTeam.alias : game.homeTeam.alias;
  const spursWL = last5WL(allGames, SPURS_ALIAS);
  const opponentWL = last5WL(allGames, opponentAlias);
  const homeWL = isSpursHome ? spursWL : opponentWL;
  const awayWL = isSpursHome ? opponentWL : spursWL;

  const homeTeamId = game.homeTeam.id;
  const awayTeamId = game.awayTeam.id;
  let [homePlayers, awayPlayers] = await Promise.all([
    loadRoster(homeTeamId),
    loadRoster(awayTeamId),
  ]);
  let homeSeasonChartStats: NBAGameChartData["homeStats"] | null = null;
  let awaySeasonChartStats: NBAGameChartData["awayStats"] | null = null;

  if (isPregameGame(game.status)) {
    const seasonYear = getNBASeasonYear();
    const [
      homeDepth,
      awayDepth,
      homeSeason,
      awaySeason,
      homeLastStarters,
      awayLastStarters,
    ] = await Promise.allSettled([
      fetchSRDepthChart(homeTeamId),
      fetchSRDepthChart(awayTeamId),
      fetchSRTeamSeasonStats(homeTeamId, seasonYear),
      fetchSRTeamSeasonStats(awayTeamId, seasonYear),
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

  let homeStats: NBAPlayerStats[] = [];
  let awayStats: NBAPlayerStats[] = [];
  let chartData: NBAGameChartData | null = null;

  if (game.status === "final" || game.status === "live") {
    try {
      const split = srSummaryToSplitStats(await fetchSRGameSummary(game.id));
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

  return {
    game,
    showDotRace: shouldShowDotRace(game, allGames),
    homeWL,
    awayWL,
    homePlayers,
    awayPlayers,
    homeStats,
    awayStats,
    chartData,
  };
}
