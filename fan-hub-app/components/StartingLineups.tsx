import { Image, StyleSheet, Text, View } from 'react-native';
import PlayerAvatar from './PlayerAvatar';
import { isPregameGame } from '../lib/gameDisplay';
import { teamLogoUrl } from '../lib/nba';
import { colors, shared } from '../lib/theme';
import type { GameDisplay, NBAPlayer, NBAPlayerStats } from '../lib/types';

type LineupPlayer = {
  key: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber?: string | null;
  reference?: string;
  statLine?: string;
  statMode?: 'game' | 'season';
};

export default function StartingLineups({
  game,
  homePlayers,
  awayPlayers,
  homeStats,
  awayStats,
}: {
  game: GameDisplay;
  homePlayers: NBAPlayer[];
  awayPlayers: NBAPlayer[];
  homeStats: NBAPlayerStats[];
  awayStats: NBAPlayerStats[];
}) {
  const isPregame = isPregameGame(game.status);
  const home = lineup(homePlayers, homeStats, isPregame);
  const away = lineup(awayPlayers, awayStats, isPregame);
  return (
    <View style={shared.panel}>
      <Text style={shared.eyebrow}>Starting Lineups</Text>
      <View style={styles.grid}>
        <Team team={game.homeTeam} players={home} />
        <Team team={game.awayTeam} players={away} />
      </View>
    </View>
  );
}

function playerFullName(player: Pick<NBAPlayer, 'first_name' | 'last_name'>): string {
  return `${player.first_name} ${player.last_name}`.toLowerCase();
}

function rosterMatch(players: NBAPlayer[], statPlayer: NBAPlayerStats['player']): NBAPlayer | undefined {
  return players.find((player) => {
    if (player.srId && statPlayer.srId) return player.srId === statPlayer.srId;
    return playerFullName(player) === `${statPlayer.first_name} ${statPlayer.last_name}`.toLowerCase();
  });
}

function seasonAverageLine(player: NBAPlayer): string | undefined {
  const parts = [
    player.seasonPpg !== undefined ? `${player.seasonPpg.toFixed(1)} ppg` : null,
    player.seasonRpg !== undefined ? `${player.seasonRpg.toFixed(1)} reb` : null,
    player.seasonApg !== undefined ? `${player.seasonApg.toFixed(1)} ast` : null,
  ].filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(' - ') : undefined;
}

function lineupFromStats(stats: NBAPlayerStats[], players: NBAPlayer[]): LineupPlayer[] {
  return stats
    .filter((entry) => entry.player.starter)
    .slice(0, 5)
    .map((entry) => {
      const rosterPlayer = rosterMatch(players, entry.player);
      return {
        key: entry.player.srId ?? String(entry.player.id),
        firstName: entry.player.first_name,
        lastName: entry.player.last_name,
        position: entry.player.position,
        jerseyNumber: entry.player.jersey_number ?? rosterPlayer?.jersey_number ?? null,
        reference: entry.player.reference ?? rosterPlayer?.reference,
        statLine: `${entry.pts} pts - ${entry.reb} reb - ${entry.ast} ast`,
        statMode: 'game',
      };
    });
}

function projectedLineup(players: NBAPlayer[], useSeasonAverages: boolean): LineupPlayer[] {
  return players
    .slice()
    .sort((a, b) => (a.depthChartRank ?? 99) - (b.depthChartRank ?? 99))
    .slice(0, 5)
    .map((player) => ({
      key: player.srId ?? String(player.id),
      firstName: player.first_name,
      lastName: player.last_name,
      position: player.position,
      jerseyNumber: player.jersey_number,
      reference: player.reference,
      statLine: useSeasonAverages ? seasonAverageLine(player) : undefined,
      statMode: useSeasonAverages ? 'season' : undefined,
    }));
}

function lineup(players: NBAPlayer[], stats: NBAPlayerStats[], useSeasonAverages: boolean): LineupPlayer[] {
  if (useSeasonAverages) return projectedLineup(players, true);
  const starters = lineupFromStats(stats, players);
  return starters.length ? starters : projectedLineup(players, false);
}

function Team({ team, players }: { team: GameDisplay['homeTeam']; players: LineupPlayer[] }) {
  return (
    <View style={styles.team}>
      <View style={styles.teamHeader}>
        <Image source={{ uri: teamLogoUrl(team.alias) }} style={styles.logo} />
        <Text style={styles.alias}>{team.name}</Text>
      </View>
      {players.length > 0 ? (
        players.map((player) => (
          <View key={player.key} style={styles.playerRow}>
            <PlayerAvatar firstName={player.firstName} lastName={player.lastName} reference={player.reference} size="sm" />
            <View style={styles.playerText}>
              <Text style={styles.playerName} numberOfLines={1}>{player.firstName} {player.lastName}</Text>
              <Text style={styles.position}>{player.position}</Text>
              {player.statLine && (
                <Text style={styles.statLine}>
                  <Text style={styles.statMode}>{player.statMode === 'season' ? 'Season' : 'Game'}</Text>
                  {' - '}
                  {player.statLine}
                </Text>
              )}
            </View>
            {player.jerseyNumber && <Text style={styles.jersey}>#{player.jerseyNumber}</Text>}
          </View>
        ))
      ) : (
        <Text style={shared.body}>Lineup unavailable.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 10, marginTop: 14 },
  team: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panelSoft, borderRadius: 12, padding: 12, gap: 6 },
  teamHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  logo: { width: 24, height: 24, resizeMode: 'contain' },
  alias: { color: colors.text, fontSize: 13, fontWeight: '900' },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: 10, backgroundColor: colors.panel, paddingHorizontal: 8, paddingVertical: 8 },
  playerText: { flex: 1, minWidth: 0 },
  playerName: { color: colors.text, fontSize: 12, fontWeight: '900' },
  position: { color: colors.faint, fontSize: 10, fontWeight: '800', marginTop: 1 },
  statLine: { color: colors.muted, fontSize: 10, marginTop: 2 },
  statMode: { color: colors.faint, fontWeight: '900', textTransform: 'uppercase' },
  jersey: { color: colors.text, fontSize: 12, fontWeight: '900' },
});
