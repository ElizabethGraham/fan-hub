"use client";

import { useEffect, useState } from "react";
import type {
  GameDisplay,
  NBAGameChartData,
  NBAPlayerStats,
  NBAQuarterScore,
  NBATeamChartStats,
} from "@/lib/types";
import { isPregameGame } from "@/lib/gameDisplay";

type Props = {
  game: GameDisplay;
  homeStats?: NBAPlayerStats[];
  awayStats?: NBAPlayerStats[];
  chartData?: NBAGameChartData | null;
};

function teamTotalsFromStats(
  stats: NBAPlayerStats[],
): NBATeamChartStats | null {
  if (!stats.length) return null;
  const fgm = stats.reduce((s, p) => s + p.fgm, 0);
  const fga = stats.reduce((s, p) => s + p.fga, 0);
  const fg3m = stats.reduce((s, p) => s + p.fg3m, 0);
  const fg3a = stats.reduce((s, p) => s + p.fg3a, 0);
  return {
    fgPct: fga > 0 ? (fgm / fga) * 100 : 0,
    fg3Pct: fg3a > 0 ? (fg3m / fg3a) * 100 : 0,
    reb: stats.reduce((s, p) => s + p.reb, 0),
    ast: stats.reduce((s, p) => s + p.ast, 0),
    stl: stats.reduce((s, p) => s + p.stl, 0),
    tov: stats.reduce((s, p) => s + p.turnover, 0),
  };
}

const HOME_COLOR = "#00b2a9";
const AWAY_COLOR = "#e8338a";

type MetricKey = keyof NBATeamChartStats;

const METRICS: {
  key: MetricKey;
  label: string;
  maxVal: number;
  isPercent?: boolean;
  lowerWins?: boolean;
}[] = [
  { key: "fgPct", label: "FG%", maxVal: 60, isPercent: true },
  { key: "fg3Pct", label: "3P%", maxVal: 50, isPercent: true },
  { key: "reb", label: "REB", maxVal: 60 },
  { key: "ast", label: "AST", maxVal: 40 },
  { key: "stl", label: "STL", maxVal: 15 },
  { key: "tov", label: "TOV", maxVal: 25, lowerWins: true },
];

function fmtMetric(value: number, isPercent?: boolean): string {
  return isPercent ? `${value.toFixed(1)}%` : String(Math.round(value));
}

function QuarterChart({
  periods,
  homeAbbr,
  awayAbbr,
  metric,
  metricLabel,
  isPercent,
  animated,
  selectedIndex,
  onSelect,
}: {
  periods: NBAQuarterScore[];
  homeAbbr: string;
  awayAbbr: string;
  metric: MetricKey | null;
  metricLabel: string;
  isPercent?: boolean;
  animated: boolean;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}) {
  const periodValue = (
    period: NBAQuarterScore,
    side: "homeStats" | "awayStats",
    fallback: number,
  ) => (metric ? period[side]?.[metric] : fallback) ?? fallback;
  const allVals = periods.flatMap((period) => [
    periodValue(period, "homeStats", period.home),
    periodValue(period, "awayStats", period.away),
  ]);
  const maxVal = metric ? Math.max(...allVals, 1) : Math.max(...allVals, 30);
  const chartTop = 12;
  const chartH = 86;
  const barW = 10;
  const groupGap = 30;
  const barGap = 2;
  const leftPad = 28;
  const totalW = leftPad + periods.length * groupGap + 8;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${chartTop + chartH + 32}`}
      className="w-full overflow-visible"
    >
      {/* Y-axis lines */}
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = chartTop + chartH - (pct / 100) * chartH;
        const val = Math.round((pct / 100) * maxVal);
        return (
          <g key={pct}>
            <line
              x1={leftPad}
              y1={y}
              x2={totalW}
              y2={y}
              stroke="#27272a"
              strokeWidth="0.5"
            />
            <text
              x={leftPad - 4}
              y={y + 3}
              textAnchor="end"
              fill="#52525b"
              fontSize="6"
            >
              {val}
            </text>
          </g>
        );
      })}

      {periods.map((period, qi) => {
        const groupX = leftPad + qi * groupGap + 4;
        const homeVal = periodValue(period, "homeStats", period.home);
        const awayVal = periodValue(period, "awayStats", period.away);
        const homeH = animated ? (homeVal / maxVal) * chartH : 0;
        const awayH = animated ? (awayVal / maxVal) * chartH : 0;
        const homeY = chartTop + chartH - homeH;
        const awayY = chartTop + chartH - awayH;

        const selected = qi === selectedIndex;
        const dimmed = selectedIndex !== null && !selected;
        const homeBarColor = dimmed ? "#3f3f46" : HOME_COLOR;
        const awayBarColor = dimmed ? "#3f3f46" : AWAY_COLOR;

        return (
          <g
            key={`${period.label}-${qi}`}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={`${period.label} ${metricLabel}: ${homeAbbr} ${fmtMetric(homeVal, isPercent)}, ${awayAbbr} ${fmtMetric(awayVal, isPercent)}`}
            className="cursor-pointer outline-none"
            onClick={() => onSelect(qi)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(qi);
              }
            }}
          >

            {/* Home bar */}
            <rect
              x={groupX}
              y={homeY}
              width={barW}
              height={homeH}
              rx="2"
              fill={homeBarColor}
              opacity="0.85"
              style={{
                transition:
                  "height 0.7s cubic-bezier(.25,.46,.45,.94), y 0.7s cubic-bezier(.25,.46,.45,.94), fill 0.2s ease",
              }}
            />
            {/* Score label */}
            {animated && (
              <text
                x={groupX + barW / 2}
                y={Math.max(chartTop - 3, homeY - 3)}
                textAnchor="middle"
                fill={homeBarColor}
                fontSize="5"
                fontWeight="700"
              >
                {fmtMetric(homeVal, isPercent)}
              </text>
            )}

            {/* Away bar */}
            <rect
              x={groupX + barW + barGap}
              y={awayY}
              width={barW}
              height={awayH}
              rx="2"
              fill={awayBarColor}
              opacity="0.85"
              style={{
                transition:
                  "height 0.7s cubic-bezier(.25,.46,.45,.94) 0.1s, y 0.7s cubic-bezier(.25,.46,.45,.94) 0.1s, fill 0.2s ease",
              }}
            />
            {animated && (
              <text
                x={groupX + barW + barGap + barW / 2}
                y={Math.max(chartTop - 3, awayY - 3)}
                textAnchor="middle"
                fill={awayBarColor}
                fontSize="5"
                fontWeight="700"
              >
                {fmtMetric(awayVal, isPercent)}
              </text>
            )}

            {/* Quarter label */}
            <text
              x={groupX + barW + barGap / 2}
              y={chartTop + chartH + 10}
              textAnchor="middle"
              fill="#71717a"
              fontSize="7"
              fontWeight="600"
            >
              {period.label}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${leftPad}, ${chartTop + chartH + 22})`}>
        <rect width="6" height="4" rx="1" fill={HOME_COLOR} />
        <text x="8.5" y="4" fill="#a1a1aa" fontSize="5">
          {homeAbbr}
        </text>
        <rect x="30" width="6" height="4" rx="1" fill={AWAY_COLOR} />
        <text x="38.5" y="4" fill="#a1a1aa" fontSize="5">
          {awayAbbr}
        </text>
      </g>
    </svg>
  );
}

function StatBar({
  label,
  homeVal,
  awayVal,
  maxVal,
  isPercent,
  animated,
  selected,
  onSelect,
}: {
  label: string;
  homeVal: number;
  awayVal: number;
  maxVal: number;
  isPercent?: boolean;
  animated: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const homeW = animated ? Math.min((homeVal / maxVal) * 100, 100) : 0;
  const awayW = animated ? Math.min((awayVal / maxVal) * 100, 100) : 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`grid w-full grid-cols-[1fr_auto_1fr] items-center gap-1.5 rounded-xl border px-2 py-2 text-left transition sm:gap-2 ${
        selected
          ? "border-fiesta-teal/50 bg-fiesta-teal/5"
          : "border-transparent hover:border-zinc-800 hover:bg-zinc-950/35"
      }`}
    >
      {/* Home bar (right-aligned) */}
      <div className="flex items-center justify-end gap-1 sm:gap-1.5 min-w-0">
        <span className="min-w-9 text-right text-xs font-black text-fiesta-teal tabular-nums shrink-0">
          {fmtMetric(homeVal, isPercent)}
        </span>
        <div className="h-2 rounded-full overflow-hidden bg-zinc-800 flex-1 flex justify-end">
          <div
            className="h-full rounded-full bg-fiesta-teal"
            style={{
              width: `${homeW}%`,
              transition: "width 0.8s cubic-bezier(.25,.46,.45,.94)",
            }}
          />
        </div>
      </div>

      {/* Label */}
      <span className="text-[8px] sm:text-[9px] font-black text-ui-muted uppercase tracking-widest text-center w-8 sm:w-12 shrink-0">
        {label}
      </span>

      {/* Away bar (left-aligned) */}
      <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
        <div className="h-2 rounded-full overflow-hidden bg-zinc-800 flex-1">
          <div
            className="h-full rounded-full bg-fiesta-pink"
            style={{
              width: `${awayW}%`,
              transition: "width 0.8s cubic-bezier(.25,.46,.45,.94) 0.05s",
            }}
          />
        </div>
        <span className="min-w-9 text-xs font-black text-fiesta-pink tabular-nums shrink-0">
          {fmtMetric(awayVal, isPercent)}
        </span>
      </div>
    </button>
  );
}

export default function GameCharts({
  game,
  homeStats = [],
  awayStats = [],
  chartData = null,
}: Props) {
  const [animated, setAnimated] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey | null>(null);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(
    0,
  );
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const isPregame = isPregameGame(game.status);
  const derivedHomeStats = teamTotalsFromStats(homeStats);
  const derivedAwayStats = teamTotalsFromStats(awayStats);
  const hasDerivedStats = !!derivedHomeStats && !!derivedAwayStats;

  // Priority: SR team totals → derived player box totals. No synthetic fallbacks.
  const homeS = chartData?.homeStats ?? derivedHomeStats;
  const awayS = chartData?.awayStats ?? derivedAwayStats;

  const showQuarters = !!chartData?.periods.length;
  const hasPerQuarterStatData =
    chartData?.periods.some(
      (p) => p.homeStats !== undefined || p.awayStats !== undefined,
    ) ?? false;
  const sectionLabel = isPregame ? "Season Averages" : "Game Stats";
  const isDerived = !chartData && hasDerivedStats;
  const availableMetrics = METRICS;
  const selectedMetricDef = selectedMetric
    ? availableMetrics.find((metric) => metric.key === selectedMetric)
    : undefined;
  const homeSelected =
    homeS && selectedMetricDef ? homeS[selectedMetricDef.key] : 0;
  const awaySelected =
    awayS && selectedMetricDef ? awayS[selectedMetricDef.key] : 0;
  const homeHasEdge = selectedMetricDef
    ? selectedMetricDef.lowerWins
      ? homeSelected < awaySelected
      : homeSelected > awaySelected
    : false;
  const awayHasEdge = selectedMetricDef
    ? selectedMetricDef.lowerWins
      ? awaySelected < homeSelected
      : awaySelected > homeSelected
    : false;
  if (!homeS || !awayS) {
    return (
      <div className="surface-panel p-4 sm:p-6">
        <div className="text-xs font-black text-ui-muted uppercase tracking-widest mb-2">
          {sectionLabel}
        </div>
        <p className="text-xs text-ui-muted">
          {isPregame
            ? "Season stat data is unavailable right now."
            : "Game stats are unavailable right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="surface-panel p-4 sm:p-6">
      <div className="text-xs font-black text-ui-muted uppercase tracking-widest mb-5">
        {sectionLabel}
      </div>

      <div
        className={showQuarters ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : ""}
      >
        {/* Team stat comparison */}
        <div className={showQuarters ? "space-y-3 sm:pt-20" : "space-y-3"}>
          {/* Team headers */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-4">
            <span className="text-xs font-black text-fiesta-teal text-right">
              {game.homeTeam.alias}
            </span>
            <span className="w-12" />
            <span className="text-xs font-black text-fiesta-pink">
              {game.awayTeam.alias}
            </span>
          </div>
          {availableMetrics.map((metric) => (
            <StatBar
              key={metric.key}
              label={metric.label}
              homeVal={homeS[metric.key]}
              awayVal={awayS[metric.key]}
              maxVal={metric.maxVal}
              isPercent={metric.isPercent}
              animated={animated}
              selected={selectedMetric === metric.key}
              onSelect={() =>
                setSelectedMetric((current) =>
                  current === metric.key ? null : metric.key,
                )
              }
            />
          ))}
          <div
            className="rounded-xl border border-zinc-800 bg-zinc-950/45 px-3 py-2"
            aria-live="polite"
          >
            <div className="text-[9px] font-black uppercase tracking-widest text-ui-muted">
              {selectedMetricDef ? "Selected Edge" : "Quarter View"}
            </div>
            <div className="mt-1 text-xs font-semibold leading-relaxed text-zinc-300">
              {selectedMetricDef
                ? homeHasEdge
                  ? `${game.homeTeam.alias} has the ${selectedMetricDef.lowerWins ? "cleaner" : "stronger"} ${selectedMetricDef.label} mark, ${fmtMetric(homeSelected, selectedMetricDef.isPercent)} to ${fmtMetric(awaySelected, selectedMetricDef.isPercent)}.`
                  : awayHasEdge
                    ? `${game.awayTeam.alias} has the ${selectedMetricDef.lowerWins ? "cleaner" : "stronger"} ${selectedMetricDef.label} mark, ${fmtMetric(awaySelected, selectedMetricDef.isPercent)} to ${fmtMetric(homeSelected, selectedMetricDef.isPercent)}.`
                    : `Both teams are even in ${selectedMetricDef.label} at ${fmtMetric(homeSelected, selectedMetricDef.isPercent)}.`
                : "Select a stat above to explore different game trends."}
            </div>
          </div>
        </div>

        {/* Selected metric chart */}
        {showQuarters && (
          <div>
            <div className="text-[10px] font-black text-ui-muted uppercase tracking-widest mb-3">
              {selectedMetricDef && hasPerQuarterStatData
                ? `${selectedMetricDef.label} by Quarter`
                : "Points by Quarter"}
            </div>
            {selectedMetricDef && !hasPerQuarterStatData && (
              <p className="text-[10px] text-ui-muted mb-2">
                Quarter-level {selectedMetricDef.label} not available; showing
                points.
              </p>
            )}
            <QuarterChart
              periods={chartData.periods}
              homeAbbr={game.homeTeam.alias}
              awayAbbr={game.awayTeam.alias}
              metric={
                hasPerQuarterStatData ? (selectedMetricDef?.key ?? null) : null
              }
              metricLabel={
                selectedMetricDef && hasPerQuarterStatData
                  ? selectedMetricDef.label
                  : "PTS"
              }
              isPercent={
                hasPerQuarterStatData ? selectedMetricDef?.isPercent : undefined
              }
              animated={animated}
              selectedIndex={selectedPeriodIndex}
              onSelect={(index) =>
                setSelectedPeriodIndex((current) =>
                  current === index ? null : index,
                )
              }
            />
          </div>
        )}
      </div>

      {isDerived && (
        <p className="text-[10px] text-ui-muted mt-4">
          Team totals derived from the player box score.
        </p>
      )}
    </div>
  );
}
