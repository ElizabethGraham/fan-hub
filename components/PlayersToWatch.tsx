import type { GameDisplay, NBAPlayer, NBAPlayerStats } from '@/lib/types';
import { SPURS_ALIAS } from '@/lib/constants';
import PlayerAvatar from '@/components/PlayerAvatar';

type Props = {
  game: GameDisplay;
  homePlayers: NBAPlayer[];
  awayPlayers: NBAPlayer[];
  homeStats?: NBAPlayerStats[];
  awayStats?: NBAPlayerStats[];
};

function isSpurs(team: GameDisplay['homeTeam']): boolean {
  return team.alias === SPURS_ALIAS;
}

function sectionTitle(status: GameDisplay['status']): string {
  if (status === 'final') return 'Spurs Standouts';
  if (status === 'live') return 'Spurs Live Watch';
  return 'Spurs Players to Watch';
}

function findStats(stats: NBAPlayerStats[], player: NBAPlayer): NBAPlayerStats | undefined {
  const full = `${player.first_name} ${player.last_name}`.toLowerCase();
  return stats.find((s) => `${s.player.first_name} ${s.player.last_name}`.toLowerCase() === full);
}

function statScore(stats: NBAPlayerStats): number {
  return (
    stats.pts + stats.reb * 1.2 + stats.ast * 1.5 + stats.stl * 2 + stats.blk * 2 - stats.turnover
  );
}

function spursWatchPlayers(players: NBAPlayer[], stats: NBAPlayerStats[]): NBAPlayer[] {
  if (stats.length > 0) return [];
  return [...players]
    .sort((a, b) => {
      const ap = a.seasonPpg ?? -Infinity;
      const bp = b.seasonPpg ?? -Infinity;
      if (bp !== ap) return bp - ap;
      return (a.depthChartRank ?? 99) - (b.depthChartRank ?? 99);
    })
    .slice(0, 3);
}

function StatPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-zinc-700/70 bg-zinc-950/40 px-2.5 py-2 text-center">
      <div className="text-base font-black text-white tabular-nums">{value}</div>
      <div className="text-[8px] font-black uppercase tracking-widest text-ui-muted">{label}</div>
    </div>
  );
}

function StandoutCard({ stats }: { stats: NBAPlayerStats }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-800/45 p-3">
      <div className="flex items-center gap-3">
        <PlayerAvatar
          firstName={stats.player.first_name}
          lastName={stats.player.last_name}
          reference={stats.player.reference}
          featured
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-black text-white">
            {stats.player.first_name} {stats.player.last_name}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-ui-muted">
            {stats.player.position || 'Spurs'}
          </div>
        </div>
        {stats.plus_minus !== null && (
          <div
            className={`text-sm font-black tabular-nums ${
              stats.plus_minus >= 0 ? 'text-emerald-400' : 'text-ui-muted'
            }`}
          >
            {stats.plus_minus >= 0 ? '+' : ''}
            {stats.plus_minus}
          </div>
        )}
        {stats.player.jersey_number && (
          <span className="shrink-0 text-sm font-black text-white tabular-nums">
            #{stats.player.jersey_number}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <StatPill label="PTS" value={stats.pts} />
        <StatPill label="REB" value={stats.reb} />
        <StatPill label="AST" value={stats.ast} />
      </div>
    </div>
  );
}

function WatchCard({ player, stats }: { player: NBAPlayer; stats?: NBAPlayerStats }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-800/45 p-3">
      <PlayerAvatar
        firstName={player.first_name}
        lastName={player.last_name}
        reference={player.reference}
        featured
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-black text-white">
          {player.first_name} {player.last_name}
        </div>
        <div className="text-xs text-ui-muted">
          {stats
            ? `${stats.pts} pts · ${stats.reb} reb · ${stats.ast} ast`
            : player.seasonPpg !== undefined
              ? `${player.seasonPpg.toFixed(1)} ppg`
              : player.position}
        </div>
      </div>
      {player.jersey_number && (
        <span className="shrink-0 text-sm font-black text-white tabular-nums">
          #{player.jersey_number}
        </span>
      )}
    </div>
  );
}

export default function PlayersToWatch({
  game,
  homePlayers,
  awayPlayers,
  homeStats = [],
  awayStats = [],
}: Props) {
  const spursPlayers = isSpurs(game.homeTeam) ? homePlayers : awayPlayers;
  const spursStats = isSpurs(game.homeTeam) ? homeStats : awayStats;

  const standouts = [...spursStats]
    .filter((s) => s.pts + s.reb + s.ast > 0)
    .sort((a, b) => statScore(b) - statScore(a))
    .slice(0, 3);
  const watchPlayers = spursWatchPlayers(spursPlayers, spursStats);

  return (
    <section className="surface-panel p-4 sm:p-6">
      <div className="text-xs font-black text-ui-muted uppercase tracking-widest mb-5">
        {sectionTitle(game.status)}
      </div>

      {standouts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {standouts.map((stats) => (
            <StandoutCard key={stats.player.srId ?? stats.player.id} stats={stats} />
          ))}
        </div>
      ) : watchPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {watchPlayers.map((player) => (
            <WatchCard
              key={player.srId ?? player.id}
              player={player}
              stats={findStats(spursStats, player)}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-ui-muted">
          Spurs player data is unavailable from Sportradar right now.
        </p>
      )}
    </section>
  );
}
