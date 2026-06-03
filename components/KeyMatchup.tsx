import type { GameDisplay, NBAGameChartData } from "@/lib/types";
import { gameDisplayLabel } from "@/lib/gameDisplay";
import { SPURS_ALIAS } from "@/lib/constants";

type Props = {
  game: GameDisplay;
  chartData?: NBAGameChartData | null;
};

type StatEdge = {
  label: string;
  value: string;
  score: number;
  spursValue: number;
  opponentValue: number;
};

function fullName(team: GameDisplay["homeTeam"]): string {
  return [team.market, team.name].filter(Boolean).join(" ");
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function teamPerspective(game: GameDisplay) {
  const isSpursHome = game.homeTeam.alias === SPURS_ALIAS;
  const spurs = isSpursHome ? game.homeTeam : game.awayTeam;
  const opponent = isSpursHome ? game.awayTeam : game.homeTeam;
  return { isSpursHome, spurs, opponent };
}

function bestStatEdge(
  game: GameDisplay,
  chartData?: NBAGameChartData | null,
): StatEdge | null {
  if (!chartData) return null;

  const { isSpursHome, opponent } = teamPerspective(game);
  const spursStats = isSpursHome ? chartData.homeStats : chartData.awayStats;
  const opponentStats = isSpursHome ? chartData.awayStats : chartData.homeStats;

  const spursHigherIsBetter = (
    label: string,
    spursValue: number,
    opponentValue: number,
    suffix = "",
    weight = 1,
  ): StatEdge => {
    const diff = spursValue - opponentValue;
    return {
      label,
      value:
        diff >= 0
          ? `+${diff.toFixed(suffix ? 1 : 0)}${suffix} vs ${opponent.alias}`
          : `${diff.toFixed(suffix ? 1 : 0)}${suffix} vs ${opponent.alias}`,
      score: diff * weight,
      spursValue,
      opponentValue,
    };
  };

  const turnoverDiff = opponentStats.tov - spursStats.tov;
  const edges: StatEdge[] = [
    spursHigherIsBetter(
      "Field goal rate",
      spursStats.fgPct,
      opponentStats.fgPct,
      "%",
      1.2,
    ),
    spursHigherIsBetter(
      "Three-point rate",
      spursStats.fg3Pct,
      opponentStats.fg3Pct,
      "%",
      1.1,
    ),
    spursHigherIsBetter("Rebounding", spursStats.reb, opponentStats.reb),
    spursHigherIsBetter("Assists", spursStats.ast, opponentStats.ast),
    spursHigherIsBetter("Steals", spursStats.stl, opponentStats.stl, "", 1.8),
    {
      label: "Ball security",
      value:
        turnoverDiff >= 0
          ? `${turnoverDiff.toFixed(0)} fewer TO vs ${opponent.alias}`
          : `${Math.abs(turnoverDiff).toFixed(0)} more TO vs ${opponent.alias}`,
      score: turnoverDiff * 1.5,
      spursValue: spursStats.tov,
      opponentValue: opponentStats.tov,
    },
  ];

  const positiveEdge = edges
    .filter((edge) => edge.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  if (positiveEdge) return positiveEdge;

  return edges.sort((a, b) => Math.abs(a.score) - Math.abs(b.score))[0] ?? null;
}

function gameHeadline(game: GameDisplay): string {
  const { isSpursHome, spurs, opponent } = teamPerspective(game);
  const spursName = fullName(spurs);
  const opponentName = fullName(opponent);
  const spursScore = isSpursHome ? game.homeTeamScore : game.awayTeamScore;
  const opponentScore = isSpursHome ? game.awayTeamScore : game.homeTeamScore;

  if (game.status === "final") {
    if (spursScore === opponentScore)
      return `${spursName} finish level with ${opponentName}`;
    return spursScore > opponentScore
      ? `${spursName} win by ${spursScore - opponentScore}`
      : `${spursName} fall by ${opponentScore - spursScore}`;
  }

  if (game.status === "live") {
    return spursScore > opponentScore
      ? `${spursName} lead by ${spursScore - opponentScore}`
      : `${spursName} trail by ${opponentScore - spursScore}`;
  }

  return isSpursHome
    ? `${spursName} host ${opponentName}`
    : `${spursName} visit ${opponentName}`;
}

function gameStory(game: GameDisplay, edge: StatEdge | null): string {
  const { isSpursHome, opponent } = teamPerspective(game);
  const opponentName = fullName(opponent);

  if (game.status === "final") {
    if (edge && edge.score > 0) {
      return `San Antonio still found an edge in ${edge.label.toLowerCase()}, a useful thread to carry forward from this one.`;
    }
    if (edge) {
      return `San Antonio kept the gap tightest in ${edge.label.toLowerCase()}, even where the final margin told a harder story.`;
    }
    return "The final margin tells the result, but the useful Spurs read is in the possession details below.";
  }

  if (game.status === "live") {
    if (edge && edge.score > 0) {
      return `San Antonio's cleanest live edge is ${edge.label.toLowerCase()}; that is the lever to keep leaning on.`;
    }
    if (edge) {
      return `San Antonio's closest path back is ${edge.label.toLowerCase()}, where the gap is still manageable.`;
    }
    return "The live story is still forming, with shot quality and turnovers likely to decide the next Spurs swing.";
  }

  return isSpursHome
    ? `Watch whether San Antonio can control the first stretch: clean possessions, defensive rebounds, and enough pace to keep ${opponentName} chasing.`
    : `Watch whether San Antonio can settle in on the road: clean possessions, defensive rebounds, and enough pace to keep ${opponentName} chasing.`;
}

function formatTime(time: string | null): string {
  if (!time) return "TBD";
  return time.replace(/\bpm\b/i, "PM").replace(/\bam\b/i, "AM");
}

export default function KeyMatchup({ game, chartData = null }: Props) {
  const edge = bestStatEdge(game, chartData);
  const isPregame = game.status === "scheduled";
  const fixture = `${fullName(game.awayTeam)} at ${fullName(game.homeTeam)}`;
  const { isSpursHome, opponent } = teamPerspective(game);
  const label = gameDisplayLabel(game);
  const gameLabel = label
    ? `${label} · ${formatDate(game.date)}`
    : formatDate(game.date);
  const statusLabel =
    game.status === "live"
      ? "Live"
      : game.status === "final"
        ? "Final"
        : (game.title ?? "Game Brief");

  return (
    <section className="surface-panel p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-black text-ui-muted uppercase tracking-widest">
            Game Brief
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-black text-white leading-tight">
            {gameHeadline(game)}
          </h2>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
            game.status === "live"
              ? "border-emerald-800/60 bg-emerald-900/30 text-emerald-400"
              : "border-zinc-700 bg-zinc-800/70 text-ui-muted"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="mt-3 text-sm text-ui-muted leading-relaxed">
        {gameStory(game, edge)}
      </p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
          <div className="text-[9px] font-black text-ui-muted uppercase tracking-widest">
            {game.title ? "Game" : "Date"}
          </div>
          <div className="mt-1 text-sm font-bold text-white leading-snug">
            {gameLabel}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
          <div className="text-[9px] font-black text-ui-muted uppercase tracking-widest">
            {isPregame ? "Tipoff" : "Spurs Lens"}
          </div>
          <div className="mt-1 text-sm font-bold text-white leading-snug tabular-nums">
            {isPregame
              ? formatTime(game.time)
              : isSpursHome
                ? `Home vs ${opponent.alias}`
                : `Road at ${opponent.alias}`}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
          <div className="text-[9px] font-black text-ui-muted uppercase tracking-widest">
            {edge ? edge.label : "Focus"}
          </div>
          <div
            className={`mt-1 text-sm font-bold leading-snug ${"text-fiesta-teal"}`}
          >
            {edge ? edge.value : isPregame ? "First run" : "Next swing"}
          </div>
        </div>
      </div>

      <div className="mt-3 text-[10px] font-semibold text-ui-muted">
        {fixture}
      </div>

      {isPregame && (
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <div className="text-[9px] font-black text-ui-muted uppercase tracking-widest mb-1.5">
            What To Watch
          </div>
          <p className="text-xs sm:text-sm text-ui-muted leading-relaxed">
            San Antonio&apos;s best early signal is the possession battle: get
            back on defense, finish stops with rebounds, and avoid giving the
            opponent extra transition chances.
          </p>
        </div>
      )}
    </section>
  );
}
