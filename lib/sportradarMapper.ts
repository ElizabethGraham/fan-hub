import type {
  NBAPlayer,
  NBAPlayerStats,
  NBAGameStatus,
  NBAGameChartData,
  GameDisplay,
  TeamDisplay,
} from "./types";
import type {
  SRPlayerRef,
  SRTeamRef,
  SRGameSummary,
  SRDepthChart,
  SRTeamSeasonStats,
  SRSeasonSchedule,
  SRGameRef,
} from "./sportradar";
import {
  CENTRAL_TIMEZONE,
  CENTRAL_TIMEZONE_LABEL,
  DATE_KEY_LOCALE,
  SPURS_ALIAS,
} from "./constants";
import { spursPlayoffStageForTeams } from "./playoffs";

// Convert a SR GUID to a stable numeric ID (safe up to ~4 billion).
// Used for NBAPlayer.id — players have no other stable numeric key.
function srIdToNum(srId: string): number {
  return parseInt(srId.replace(/-/g, "").substring(0, 8), 16);
}

// SR gives height in total inches; display uses "ft-in" strings.
function inchesToStr(inches?: number): string {
  if (!inches) return "";
  return `${Math.floor(inches / 12)}-${inches % 12}`;
}

// Map a SR roster player to NBAPlayer.
export function srPlayerToNBAPlayer(player: SRPlayerRef): NBAPlayer {
  return {
    id: srIdToNum(player.id),
    srId: player.id,
    reference: player.reference,
    first_name: player.first_name ?? player.full_name?.split(" ")[0] ?? "",
    last_name:
      player.last_name ?? player.full_name?.split(" ").slice(1).join(" ") ?? "",
    position: player.primary_position ?? player.position ?? "",
    jersey_number: player.jersey_number ?? null,
    height: inchesToStr(player.height),
    weight: player.weight ? String(player.weight) : "",
  };
}

function mapSideStats(side: SRGameSummary["home"]): NBAPlayerStats[] {
  if (!side) return [];
  const results: NBAPlayerStats[] = [];

  for (const p of side.players ?? []) {
    const s = p.statistics;
    if (!s) continue;
    const fgm = s.field_goals_made ?? 0;
    const fga = s.field_goals_att ?? 0;
    const fg3m = s.three_points_made ?? 0;
    const fg3a = s.three_points_att ?? 0;
    const ftm = s.free_throws_made ?? 0;
    const fta = s.free_throws_att ?? 0;
    const oreb = s.offensive_rebounds ?? 0;
    const dreb = s.defensive_rebounds ?? 0;

    results.push({
      player: {
        id: srIdToNum(p.id),
        srId: p.id,
        reference: p.reference,
        first_name: p.first_name ?? p.full_name?.split(" ")[0] ?? "",
        last_name:
          p.last_name ?? p.full_name?.split(" ").slice(1).join(" ") ?? "",
        position: p.primary_position ?? p.position ?? "",
        jersey_number: p.jersey_number ?? null,
        starter: p.starter,
        onCourt: p.on_court,
      },
      min: s.minutes ?? "0",
      fgm,
      fga,
      fg_pct: fga > 0 ? fgm / fga : 0,
      fg3m,
      fg3a,
      fg3_pct: fg3a > 0 ? fg3m / fg3a : 0,
      ftm,
      fta,
      ft_pct: fta > 0 ? ftm / fta : 0,
      oreb,
      dreb,
      reb: s.rebounds ?? oreb + dreb,
      ast: s.assists ?? 0,
      stl: s.steals ?? 0,
      blk: s.blocks ?? 0,
      turnover: s.turnovers ?? 0,
      pf: s.personal_fouls ?? 0,
      pts: s.points ?? 0,
      plus_minus: s.plus_minus ?? null,
    });
  }

  return results;
}

// Position ordering for depth chart ranking (lower index = higher priority).
const POSITION_ORDER = ["PG", "SG", "SF", "PF", "C"];

function buildDepthMap(chart: SRDepthChart): Map<string, number> {
  const map = new Map<string, number>();
  const positions = chart.team?.depth_chart ?? [];

  const sorted = [...positions].sort((a, b) => {
    const ai = POSITION_ORDER.indexOf(a.position?.toUpperCase() ?? "");
    const bi = POSITION_ORDER.indexOf(b.position?.toUpperCase() ?? "");
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  let rank = 1;
  for (const pos of sorted) {
    const players = [...(pos.players ?? [])].sort(
      (a, b) => (a.order ?? 99) - (b.order ?? 99),
    );
    for (const entry of players) {
      const id = entry.player?.id;
      if (id && !map.has(id)) map.set(id, rank++);
    }
  }
  return map;
}

export function applyDepthChart(
  players: NBAPlayer[],
  chart: SRDepthChart,
): NBAPlayer[] {
  const depthMap = buildDepthMap(chart);
  return players.map((p) => ({
    ...p,
    depthChartRank: p.srId ? (depthMap.get(p.srId) ?? undefined) : undefined,
  }));
}

type SeasonAvgs = {
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  tov: number;
  fgPct: number;
  fg3Pct: number;
};

function normalizePct(value?: number): number | undefined {
  if (value === undefined) return undefined;
  return value <= 1 ? value * 100 : value;
}

function pctFromMadeAtt(made?: number, att?: number): number {
  return att && att > 0 && made !== undefined ? (made / att) * 100 : 0;
}

function buildSeasonAvgsMap(stats: SRTeamSeasonStats): Map<string, SeasonAvgs> {
  const map = new Map<string, SeasonAvgs>();
  for (const p of stats.players ?? []) {
    const ppg = p.average?.points;
    if (p.id && ppg !== undefined) {
      const fgPct =
        normalizePct(p.total?.field_goals_pct) ??
        pctFromMadeAtt(p.average?.field_goals_made, p.average?.field_goals_att);
      const fg3Pct =
        normalizePct(p.total?.three_points_pct) ??
        pctFromMadeAtt(p.average?.three_points_made, p.average?.three_points_att);
      map.set(p.id, {
        ppg,
        rpg: p.average?.rebounds ?? 0,
        apg: p.average?.assists ?? 0,
        spg: p.average?.steals ?? 0,
        tov: p.average?.turnovers ?? 0,
        fgPct,
        fg3Pct,
      });
    }
  }
  return map;
}

export function applySeasonStats(
  players: NBAPlayer[],
  stats: SRTeamSeasonStats,
): NBAPlayer[] {
  const avgsMap = buildSeasonAvgsMap(stats);
  return players.map((p) => {
    const avgs = p.srId ? avgsMap.get(p.srId) : undefined;
    return {
      ...p,
      seasonPpg: avgs?.ppg,
      seasonRpg: avgs?.rpg,
      seasonApg: avgs?.apg,
      seasonSpg: avgs?.spg,
      seasonTov: avgs?.tov,
      seasonFgPct: avgs?.fgPct,
      seasonFg3Pct: avgs?.fg3Pct,
    };
  });
}

export function teamSeasonChartStatsFromPlayers(
  players: NBAPlayer[],
): NBAGameChartData["homeStats"] | null {
  const withScoring = players.filter(
    (player) => player.seasonPpg !== undefined,
  );
  if (withScoring.length === 0) return null;

  const topRotation = [...withScoring]
    .sort((a, b) => {
      const ap = a.depthChartRank ?? 99;
      const bp = b.depthChartRank ?? 99;
      if (ap !== bp) return ap - bp;
      return (b.seasonPpg ?? 0) - (a.seasonPpg ?? 0);
    })
    .slice(0, 10);
  const weightedAverage = (
    selector: (player: NBAPlayer) => number | undefined,
  ): number => {
    const weighted = topRotation
      .map((player) => ({
        value: selector(player),
        weight: player.seasonPpg ?? 0,
      }))
      .filter((row) => row.value !== undefined && row.value > 0);
    const totalWeight = weighted.reduce((sum, row) => sum + row.weight, 0);
    if (totalWeight === 0) return 0;
    return (
      weighted.reduce((sum, row) => sum + row.value! * row.weight, 0) /
      totalWeight
    );
  };

  return {
    fgPct: weightedAverage((player) => player.seasonFgPct),
    fg3Pct: weightedAverage((player) => player.seasonFg3Pct),
    reb: topRotation.reduce((sum, player) => sum + (player.seasonRpg ?? 0), 0),
    ast: topRotation.reduce((sum, player) => sum + (player.seasonApg ?? 0), 0),
    stl: topRotation.reduce((sum, player) => sum + (player.seasonSpg ?? 0), 0),
    tov: topRotation.reduce((sum, player) => sum + (player.seasonTov ?? 0), 0),
  };
}

export function teamSeasonChartStats(
  stats: SRTeamSeasonStats,
): NBAGameChartData["homeStats"] | null {
  const total = stats.own_record?.total;
  const average = stats.own_record?.average;
  if (!total && !average) return null;

  return {
    fgPct:
      normalizePct(total?.field_goals_pct) ??
      pctFromMadeAtt(average?.field_goals_made, average?.field_goals_att),
    fg3Pct:
      normalizePct(total?.three_points_pct) ??
      pctFromMadeAtt(average?.three_points_made, average?.three_points_att),
    reb: average?.rebounds ?? 0,
    ast: average?.assists ?? 0,
    stl: average?.steals ?? 0,
    tov: average?.turnovers ?? 0,
  };
}

export function srSummaryToSplitStats(summary: SRGameSummary) {
  return {
    homeStats: mapSideStats(summary.home),
    awayStats: mapSideStats(summary.away),
    chartData: srSummaryToChartData(summary),
  };
}

function mapTeamChartStats(
  side: SRGameSummary["home"],
): NBAGameChartData["homeStats"] | null {
  const s = side?.statistics;
  if (!s) return null;

  const reb =
    s.total_rebounds ??
    s.rebounds ??
    (s.offensive_rebounds ?? 0) + (s.defensive_rebounds ?? 0);

  return {
    fgPct:
      s.field_goals_pct ??
      pctFromMadeAtt(s.field_goals_made, s.field_goals_att),
    fg3Pct:
      s.three_points_pct ??
      pctFromMadeAtt(s.three_points_made, s.three_points_att),
    reb,
    ast: s.assists ?? 0,
    stl: s.steals ?? 0,
    tov: s.total_turnovers ?? s.turnovers ?? s.player_turnovers ?? 0,
  };
}

type SRPeriodStats = NonNullable<
  NonNullable<SRGameSummary["home"]>["scoring"]
>[number];

function mapPeriodChartStats(
  period: SRPeriodStats,
): NBAGameChartData["homeStats"] {
  const reb =
    period.total_rebounds ??
    period.rebounds ??
    (period.offensive_rebounds ?? 0) + (period.defensive_rebounds ?? 0);

  return {
    fgPct:
      period.field_goals_pct ??
      pctFromMadeAtt(period.field_goals_made, period.field_goals_att),
    fg3Pct:
      period.three_points_pct ??
      pctFromMadeAtt(period.three_points_made, period.three_points_att),
    reb,
    ast: period.assists ?? 0,
    stl: period.steals ?? 0,
    tov:
      period.total_turnovers ??
      period.turnovers ??
      period.player_turnovers ??
      0,
  };
}

function hasPeriodChartStats(period: SRPeriodStats): boolean {
  return (
    period.field_goals_pct !== undefined ||
    period.field_goals_made !== undefined ||
    period.three_points_pct !== undefined ||
    period.three_points_made !== undefined ||
    period.rebounds !== undefined ||
    period.total_rebounds !== undefined ||
    period.assists !== undefined ||
    period.steals !== undefined ||
    period.turnovers !== undefined ||
    period.total_turnovers !== undefined
  );
}

function periodLabel(type?: string, number?: number): string {
  if (!number) return "P";
  if (type?.toLowerCase().includes("overtime") || number > 4) {
    return `OT${number > 5 ? number - 4 : ""}`;
  }
  return `Q${number}`;
}

function mapQuarterScores(summary: SRGameSummary): NBAGameChartData["periods"] {
  const homeScoring = summary.home?.scoring ?? [];
  const awayScoring = summary.away?.scoring ?? [];
  const sequences = new Set<number>();

  for (const period of homeScoring) {
    if (period.sequence !== undefined) sequences.add(period.sequence);
  }
  for (const period of awayScoring) {
    if (period.sequence !== undefined) sequences.add(period.sequence);
  }

  return [...sequences]
    .sort((a, b) => a - b)
    .map((sequence) => {
      const home = homeScoring.find((p) => p.sequence === sequence);
      const away = awayScoring.find((p) => p.sequence === sequence);
      return {
        label: periodLabel(
          home?.type ?? away?.type,
          home?.number ?? away?.number,
        ),
        home: home?.points ?? 0,
        away: away?.points ?? 0,
        homeStats:
          home && hasPeriodChartStats(home)
            ? mapPeriodChartStats(home)
            : undefined,
        awayStats:
          away && hasPeriodChartStats(away)
            ? mapPeriodChartStats(away)
            : undefined,
      };
    });
}

export function srSummaryToChartData(
  summary: SRGameSummary,
): NBAGameChartData | null {
  const homeStats = mapTeamChartStats(summary.home);
  const awayStats = mapTeamChartStats(summary.away);

  if (!homeStats || !awayStats) return null;

  return {
    homeStats,
    awayStats,
    periods: mapQuarterScores(summary),
  };
}

// ─── Season schedule → GameDisplay[] ──────────────────────────────────────────

function normalizeSRGameStatus(status?: string): NBAGameStatus {
  if (status === "closed") return "final";
  if (status === "inprogress") return "live";
  if (status === "if-necessary" || status === "unnecessary")
    return "if-necessary";
  return "scheduled";
}

function srGameTipOff(game: SRGameRef): string | null {
  if (!game.scheduled || game.status !== "scheduled") return null;
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: CENTRAL_TIMEZONE,
    }).format(new Date(game.scheduled));
    return `${fmt} ${CENTRAL_TIMEZONE_LABEL}`;
  } catch {
    return null;
  }
}

// DATE_KEY_LOCALE produces YYYY-MM-DD natively, converted to Central Time.
function srGameDate(game: SRGameRef): string {
  if (!game.scheduled) return "";
  return new Intl.DateTimeFormat(DATE_KEY_LOCALE, {
    timeZone: CENTRAL_TIMEZONE,
  }).format(new Date(game.scheduled));
}

// Direct pass-through from SR's team shape to TeamDisplay.
function srTeamToTeamDisplay(team: SRTeamRef): TeamDisplay {
  return {
    id: team.id,
    alias: team.alias?.toUpperCase() ?? "",
    name: team.name ?? "",
    market: team.market,
  };
}

export function srScheduleToGameDisplays(
  schedule: SRSeasonSchedule,
): GameDisplay[] {
  const games: SRGameRef[] =
    schedule.league?.season?.games ??
    schedule.season?.games ??
    schedule.games ??
    [];

  return games
    .map((g): GameDisplay => {
      const status = normalizeSRGameStatus(g.status);
      const title = g.title;
      const homeTeam = srTeamToTeamDisplay(g.home);
      const awayTeam = srTeamToTeamDisplay(g.away);
      const homeFull = homeTeam.market
        ? `${homeTeam.market} ${homeTeam.name}`
        : homeTeam.name;
      const awayFull = awayTeam.market
        ? `${awayTeam.market} ${awayTeam.name}`
        : awayTeam.name;
      const isSpursHome = homeTeam.alias === SPURS_ALIAS;
      const opponentFull = isSpursHome ? awayFull : homeFull;
      const playoffStage = spursPlayoffStageForTeams(homeTeam, awayTeam);

      const headline =
        status === "final"
          ? `${homeFull} vs ${awayFull} - Final`
          : status === "live"
            ? `${homeFull} vs ${awayFull} - Live`
            : `${homeFull} vs ${awayFull} - Upcoming`;

      return {
        id: g.id,
        date: srGameDate(g),
        time: srGameTipOff(g),
        status,
        title,
        playoffStage,
        homeTeam,
        awayTeam,
        homeTeamScore: g.home_points ?? 0,
        awayTeamScore: g.away_points ?? 0,
        preview: {
          headline,
          keyMatchup: isSpursHome
            ? `Spurs host the ${opponentFull}; game preview, projected lineups, matchup notes, and key storylines.`
            : `Spurs visit the ${opponentFull}; game preview, projected lineups, matchup notes, and key storylines.`,
        },
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
