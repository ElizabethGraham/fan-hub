'use client';

import { useState } from 'react';
import PlayerAvatar from '@/components/PlayerAvatar';
import { FIESTA_TEAL } from '@/lib/constants';

export type PlayoffTrendGame = {
  id: string;
  label: string;
  seriesLabel: string;
  opponentAlias: string;
  spursPoints: number;
  opponentPoints: number;
  result: 'W' | 'L';
  fgPct: number;
  reb: number;
  ast: number;
  leaders: PlayoffGameLeader[];
};

export type PlayoffLeader = {
  key: string;
  name: string;
  firstName: string;
  lastName: string;
  reference?: string;
  ppg: number;
  rpg: number;
  apg: number;
};

export type PlayoffGameLeader = {
  key: string;
  name: string;
  firstName: string;
  lastName: string;
  reference?: string;
  pts: number;
  reb: number;
  ast: number;
};

export type PlayoffSnapshotData = {
  wins: number;
  losses: number;
  avgPoints: number;
  avgAllowed: number;
  avgMargin: number;
  fgPct: number;
  fg3Pct: number;
  rebounds: number;
  assists: number;
  turnovers: number;
  trend: PlayoffTrendGame[];
  leaders: PlayoffLeader[];
};

function fmt(value: number, digits = 1): string {
  return value.toFixed(digits);
}

function leaderRebounds(leader: PlayoffLeader | PlayoffGameLeader): number {
  return 'rpg' in leader ? leader.rpg : leader.reb;
}

function leaderAssists(leader: PlayoffLeader | PlayoffGameLeader): number {
  return 'apg' in leader ? leader.apg : leader.ast;
}

function leaderPrimary(leader: PlayoffLeader | PlayoffGameLeader): string {
  return 'ppg' in leader ? fmt(leader.ppg) : String(Math.round(leader.pts));
}

function Sparkline({
  games,
  selectedId,
  onSelect,
}: {
  games: PlayoffTrendGame[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (games.length < 2) return null;

  const width = 240;
  const height = 86;
  const pad = 10;
  const values = games.flatMap((g) => [g.spursPoints, g.opponentPoints]);
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  const x = (i: number) => pad + (i / (games.length - 1)) * (width - pad * 2);
  const y = (v: number) => height - pad - ((v - min) / Math.max(max - min, 1)) * (height - pad * 2);
  const points = (selector: (game: PlayoffTrendGame) => number) =>
    games.map((game, i) => `${x(i)},${y(selector(game))}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full overflow-visible">
      {games.map((game, i) => {
        if (i === 0 || game.opponentAlias === games[i - 1]?.opponentAlias) {
          return null;
        }
        const boundaryX = (x(i - 1) + x(i)) / 2;
        return (
          <line
            key={`series-${game.opponentAlias}-${i}`}
            x1={boundaryX}
            x2={boundaryX}
            y1={pad - 2}
            y2={height - pad + 2}
            stroke="#ffffff"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.2"
          />
        );
      })}
      {[0.25, 0.5, 0.75].map((tick) => (
        <line
          key={tick}
          x1={pad}
          x2={width - pad}
          y1={pad + tick * (height - pad * 2)}
          y2={pad + tick * (height - pad * 2)}
          stroke="#27272a"
          strokeWidth="1"
        />
      ))}
      <polyline
        points={points((g) => g.opponentPoints)}
        fill="none"
        stroke="#71717a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={points((g) => g.spursPoints)}
        fill="none"
        stroke={FIESTA_TEAL}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {games.map((game, i) => {
        const selected = game.id === selectedId;
        return (
          <g
            key={game.id}
            role="button"
            tabIndex={0}
            aria-label={`${game.seriesLabel}, ${game.label}: Spurs ${game.spursPoints}, ${game.opponentAlias} ${game.opponentPoints}, ${game.result}`}
            className="cursor-pointer outline-none"
            onClick={() => onSelect(game.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(game.id);
              }
            }}
          >
            <circle
              cx={x(i)}
              cy={y(game.spursPoints)}
              r={selected ? '6.5' : '5'}
              fill={FIESTA_TEAL}
              opacity="0.16"
            />
            <circle
              cx={x(i)}
              cy={y(game.spursPoints)}
              r={selected ? '3.8' : '2.8'}
              fill={selected ? '#ffffff' : FIESTA_TEAL}
              stroke={FIESTA_TEAL}
              strokeWidth="1.5"
            />
          </g>
        );
      })}
    </svg>
  );
}

function Metric({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'accent';
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
      <div
        className={`text-xl font-black tabular-nums ${
          tone === 'accent' ? 'text-fiesta-orange' : 'text-white'
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-ui-muted">
        {label}
      </div>
    </div>
  );
}

export default function PlayoffSnapshot({ data }: { data: PlayoffSnapshotData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const record = `${data.wins}-${data.losses}`;
  const selectedGame = data.trend.find((game) => game.id === selectedId) ?? null;
  const displayedLeaders: (PlayoffLeader | PlayoffGameLeader)[] =
    selectedGame?.leaders ?? data.leaders.slice(0, 3);

  return (
    <section className="surface-panel p-4 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xs font-black text-fiesta-pink uppercase tracking-widest">
            Playoff Pulse
          </h2>
          <p className="mt-1 text-sm font-medium text-ui-muted">
            Spurs postseason performance at a glance.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-white tabular-nums">{record}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-ui-muted">
            Record
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="PPG" value={fmt(data.avgPoints)} tone="default" />
        <Metric label="Allowed ppg" value={fmt(data.avgAllowed)} />
        <Metric label="FG%" value={`${fmt(data.fgPct)}%`} />
        <Metric label="3P%" value={`${fmt(data.fg3Pct)}%`} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-widest text-ui-muted">
              Scoring Trend
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-ui-muted">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-fiesta-teal" />
                Spurs
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                Opp
              </span>
            </div>
          </div>
          <Sparkline
            games={data.trend}
            selectedId={selectedGame?.id ?? null}
            onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
          />
          {selectedGame && (
            <div
              className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2"
              aria-live="polite"
            >
              <div className="text-[10px] font-black uppercase tracking-widest text-ui-muted">
                {selectedGame.seriesLabel}
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="truncate text-sm font-bold text-white">{selectedGame.label}</div>
                <div
                  className={`shrink-0 text-sm font-black tabular-nums ${
                    selectedGame.result === 'W' ? 'text-fiesta-teal' : 'text-zinc-300'
                  }`}
                >
                  {selectedGame.result} · SAS {selectedGame.spursPoints}-
                  {selectedGame.opponentPoints}
                </div>
              </div>
            </div>
          )}
          {!selectedGame && (
            <p className="mt-2 text-xs font-semibold text-ui-muted">
              Select a dot for series context and game-specific scorers.
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-ui-muted">
            {selectedGame ? 'Game Scorers' : 'Leading Scorers'}
          </div>
          <div className="grid gap-2">
            {displayedLeaders.map((leader) => (
              <div
                key={leader.key}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2"
              >
                <PlayerAvatar
                  firstName={leader.firstName}
                  lastName={leader.lastName}
                  reference={leader.reference}
                  size="sm"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-white">{leader.name}</div>
                  <div className="text-xs font-medium text-ui-muted">
                    {fmt(leaderRebounds(leader))} reb · {fmt(leaderAssists(leader))} ast
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white tabular-nums">
                    {leaderPrimary(leader)}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-ui-muted">
                    {selectedGame ? 'PTS' : 'PPG'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric
          label={selectedGame ? 'FG%' : 'FG%'}
          value={selectedGame ? `${fmt(selectedGame.fgPct)}%` : `${fmt(data.fgPct)}%`}
        />
        <Metric
          label={selectedGame ? 'REB' : 'REB'}
          value={selectedGame ? String(Math.round(selectedGame.reb)) : fmt(data.rebounds)}
        />
        <Metric
          label={selectedGame ? 'AST' : 'AST'}
          value={selectedGame ? String(Math.round(selectedGame.ast)) : fmt(data.assists)}
        />
      </div>
    </section>
  );
}
