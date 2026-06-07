import { StyleSheet, Text, View } from 'react-native';
import { isPregameGame } from '../lib/gameDisplay';
import { colors, shared } from '../lib/theme';
import type { GameDisplay } from '../lib/types';

export default function TeamComparison({
  game,
  homeWL,
  awayWL,
}: {
  game: GameDisplay;
  homeWL: string[];
  awayWL: string[];
}) {
  const showScore = !isPregameGame(game.status);
  return (
    <View style={shared.panel}>
      <Text style={shared.eyebrow}>Team Comparison</Text>
      <View style={styles.row}>
        <Team name={game.homeTeam.alias} score={showScore ? game.homeTeamScore : null} wl={homeWL} />
        <Text style={styles.vs}>vs</Text>
        <Team name={game.awayTeam.alias} score={showScore ? game.awayTeamScore : null} wl={awayWL} />
      </View>
    </View>
  );
}

function Team({ name, score, wl }: { name: string; score: number | null; wl: string[] }) {
  return (
    <View style={styles.team}>
      <Text style={styles.alias}>{name}</Text>
      <Text style={styles.score}>{score ?? '-'}</Text>
      <View style={styles.form}>{wl.map((item, i) => <Text key={`${item}-${i}`} style={[styles.result, item === 'W' && styles.win]}>{item}</Text>)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 12 },
  team: { flex: 1, alignItems: 'center', gap: 7 },
  alias: { color: colors.text, fontSize: 16, fontWeight: '900' },
  score: { color: colors.text, fontSize: 28, fontWeight: '900' },
  vs: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  form: { flexDirection: 'row', gap: 4 },
  result: { color: colors.muted, fontSize: 10, fontWeight: '900' },
  win: { color: colors.teal },
});
