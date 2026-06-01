import Image from "next/image";
import type { GameDisplay, NBAPlayer, NBAPlayerStats } from "@/lib/types";
import { teamLogoUrl } from "@/lib/nba";
import PlayerAvatar from "@/components/PlayerAvatar";
import { isPregameGame } from "@/lib/gameDisplay";

type Props = {
  game: GameDisplay;
  homePlayers: NBAPlayer[];
  awayPlayers: NBAPlayer[];
  homeStats?: NBAPlayerStats[];
  awayStats?: NBAPlayerStats[];
};

type LineupPlayer = {
  key: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber?: string | null;
  srId?: string;
  reference?: string;
  statLine?: string;
  statMode?: "game" | "season";
};

function playerFullName(
  player: Pick<NBAPlayer, "first_name" | "last_name">,
): string {
  return `${player.first_name} ${player.last_name}`.toLowerCase();
}

function rosterMatch(
  players: NBAPlayer[],
  statPlayer: NBAPlayerStats["player"],
): NBAPlayer | undefined {
  return players.find((player) => {
    if (player.srId && statPlayer.srId) return player.srId === statPlayer.srId;
    return (
      playerFullName(player) ===
      `${statPlayer.first_name} ${statPlayer.last_name}`.toLowerCase()
    );
  });
}

function lineupFromStats(
  stats: NBAPlayerStats[],
  players: NBAPlayer[],
): LineupPlayer[] {
  return stats
    .filter((s) => s.player.starter)
    .slice(0, 5)
    .map((s) => {
      const rosterPlayer = rosterMatch(players, s.player);
      return {
        key: s.player.srId ?? String(s.player.id),
        firstName: s.player.first_name,
        lastName: s.player.last_name,
        position: s.player.position,
        jerseyNumber:
          s.player.jersey_number ?? rosterPlayer?.jersey_number ?? null,
        srId: s.player.srId,
        reference: s.player.reference ?? rosterPlayer?.reference,
        statLine: `${s.pts} pts · ${s.reb} reb · ${s.ast} ast`,
        statMode: "game",
      };
    });
}

function seasonAverageLine(player: NBAPlayer): string | null {
  const parts = [
    player.seasonPpg !== undefined
      ? `${player.seasonPpg.toFixed(1)} ppg`
      : null,
    player.seasonRpg !== undefined
      ? `${player.seasonRpg.toFixed(1)} reb`
      : null,
    player.seasonApg !== undefined
      ? `${player.seasonApg.toFixed(1)} ast`
      : null,
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" · ") : null;
}

function projectedLineup(
  players: NBAPlayer[],
  useSeasonAverages = false,
): LineupPlayer[] {
  return [...players]
    .sort((a, b) => (a.depthChartRank ?? 99) - (b.depthChartRank ?? 99))
    .slice(0, 5)
    .map((p) => ({
      key: p.srId ?? String(p.id),
      firstName: p.first_name,
      lastName: p.last_name,
      position: p.position,
      jerseyNumber: p.jersey_number,
      srId: p.srId,
      reference: p.reference,
      statLine: useSeasonAverages
        ? (seasonAverageLine(p) ?? undefined)
        : undefined,
      statMode: useSeasonAverages ? "season" : undefined,
    }));
}

function lineup(
  players: NBAPlayer[],
  stats: NBAPlayerStats[],
  useSeasonAverages: boolean,
): LineupPlayer[] {
  if (useSeasonAverages) return projectedLineup(players, true);
  const starters = lineupFromStats(stats, players);
  if (starters.length > 0) return starters;
  return projectedLineup(players);
}

function TeamLineup({
  team,
  players,
}: {
  team: GameDisplay["homeTeam"];
  players: LineupPlayer[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Image
          src={teamLogoUrl(team.alias)}
          alt={`${team.name} logo`}
          width={22}
          height={22}
          className="object-contain"
        />
        <span className="font-bold text-white text-sm">{team.name}</span>
      </div>

      {players.length > 0 ? (
        <div className="grid gap-1">
          {players.map((player) => (
            <div
              key={player.key}
              className="flex items-center gap-2 rounded-lg bg-zinc-800/45 px-2.5 py-2"
            >
              <PlayerAvatar
                firstName={player.firstName}
                lastName={player.lastName}
                reference={player.reference}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-white">
                  {player.firstName} {player.lastName}
                </div>
                {player.position && (
                  <div className="text-[10px] font-semibold text-ui-muted">
                    {player.position}
                  </div>
                )}
                {player.statLine && (
                  <div className="mt-0.5 text-[10px] font-medium tabular-nums text-ui-muted">
                    <span className="font-black uppercase tracking-widest text-ui-muted">
                      {player.statMode === "season" ? "Season" : "Game"}
                    </span>
                    <span className="mx-1 text-ui-muted">·</span>
                    {player.statLine}
                  </div>
                )}
              </div>
              {player.jerseyNumber && (
                <span className="shrink-0 text-xs font-black text-fiesta-teal tabular-nums">
                  #{player.jerseyNumber}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-ui-muted">Lineup unavailable.</p>
      )}
    </div>
  );
}

export default function StartingLineups({
  game,
  homePlayers,
  awayPlayers,
  homeStats = [],
  awayStats = [],
}: Props) {
  const isPregame = isPregameGame(game.status);
  const homeLineup = lineup(homePlayers, homeStats, isPregame);
  const awayLineup = lineup(awayPlayers, awayStats, isPregame);

  return (
    <section className="surface-panel p-4 sm:p-6">
      <div className="text-xs font-black text-ui-muted uppercase tracking-widest mb-5">
        Starting Lineups
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TeamLineup team={game.homeTeam} players={homeLineup} />
        <TeamLineup team={game.awayTeam} players={awayLineup} />
      </div>
    </section>
  );
}
