import { StyleSheet, Text, View } from 'react-native';
import PlayerAvatar from './PlayerAvatar';
import { SPURS_ALIAS } from '../lib/constants';
import { colors, shared } from '../lib/theme';
import type { GameDisplay, NBAPlayer, NBAPlayerStats } from '../lib/types';

function isSpurs(team: GameDisplay['homeTeam']): boolean {
  return team.alias === SPURS_ALIAS;
}

function title(status: GameDisplay['status']) {
  if (status === 'final') return 'Spurs Standouts';
  if (status === 'live') return 'Spurs Live Watch';
  return 'Spurs Players To Watch';
}

function statScore(stats: NBAPlayerStats): number {
  return stats.pts + stats.reb * 1.2 + stats.ast * 1.5 + stats.stl * 2 + stats.blk * 2 - stats.turnover;
}

function seasonLine(player: NBAPlayer): string {
  if (player.seasonPpg !== undefined) {
    return `${player.seasonPpg.toFixed(1)} ppg - ${player.seasonRpg?.toFixed(1) ?? '-'} reb - ${player.seasonApg?.toFixed(1) ?? '-'} ast`;
  }
  return player.position || 'Spurs';
}

export default function PlayersToWatch({
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
  const spursPlayers = isSpurs(game.homeTeam) ? homePlayers : awayPlayers;
  const spursStats = isSpurs(game.homeTeam) ? homeStats : awayStats;
  const rows = spursStats.length
    ? spursStats.slice().filter((stat) => stat.pts + stat.reb + stat.ast > 0).sort((a, b) => statScore(b) - statScore(a)).slice(0, 3).map((stat) => ({
        key: stat.player.srId ?? String(stat.player.id),
        name: `${stat.player.first_name} ${stat.player.last_name}`,
        meta: `${stat.pts} pts - ${stat.reb} reb - ${stat.ast} ast`,
        sub: stat.player.position || 'Spurs',
        jersey: stat.player.jersey_number,
        plusMinus: stat.plus_minus,
        firstName: stat.player.first_name,
        lastName: stat.player.last_name,
        reference: stat.player.reference,
        stats: stat,
      }))
    : spursPlayers.slice().sort((a, b) => (b.seasonPpg ?? -Infinity) - (a.seasonPpg ?? -Infinity)).slice(0, 3).map((player) => ({
        key: player.srId ?? String(player.id),
        name: `${player.first_name} ${player.last_name}`,
        meta: seasonLine(player),
        sub: player.position || 'Spurs',
        jersey: player.jersey_number,
        plusMinus: null,
        firstName: player.first_name,
        lastName: player.last_name,
        reference: player.reference,
        stats: null,
      }));
  return (
    <View style={shared.panel}>
      <Text style={shared.eyebrow}>{title(game.status)}</Text>
      <View style={styles.list}>
        {rows.map((row) => (
          <View key={row.key} style={styles.card}>
            <PlayerAvatar firstName={row.firstName} lastName={row.lastName} reference={row.reference} featured />
            <View style={styles.playerBody}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>{row.name}</Text>
                {row.jersey && <Text style={styles.jersey}>#{row.jersey}</Text>}
              </View>
              <Text style={styles.sub}>{row.sub}</Text>
              <Text style={styles.meta}>{row.meta}</Text>
              {row.stats && (
                <View style={styles.statPills}>
                  <StatPill label="PTS" value={row.stats.pts} />
                  <StatPill label="REB" value={row.stats.reb} />
                  <StatPill label="AST" value={row.stats.ast} />
                </View>
              )}
            </View>
            {row.plusMinus !== null && row.plusMinus !== undefined && (
              <Text style={[styles.plusMinus, row.plusMinus >= 0 && styles.plusMinusGood]}>
                {row.plusMinus >= 0 ? '+' : ''}{row.plusMinus}
              </Text>
            )}
          </View>
        ))}
        {rows.length === 0 && <Text style={shared.body}>Spurs player data is unavailable right now.</Text>}
      </View>
    </View>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10, marginTop: 14 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panelSoft, borderRadius: 12, padding: 12 },
  playerBody: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '900' },
  jersey: { color: colors.text, fontSize: 12, fontWeight: '900' },
  sub: { color: colors.faint, fontSize: 10, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase', marginTop: 1 },
  meta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  plusMinus: { color: colors.muted, fontSize: 13, fontWeight: '900' },
  plusMinusGood: { color: '#34d399' },
  statPills: { flexDirection: 'row', gap: 6, marginTop: 10 },
  statPill: { flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, borderRadius: 9, paddingVertical: 7 },
  statValue: { color: colors.text, fontSize: 13, fontWeight: '900' },
  statLabel: { color: colors.faint, fontSize: 8, fontWeight: '900', letterSpacing: 1.1, marginTop: 1 },
});
