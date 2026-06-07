import { StyleSheet, Text, View } from 'react-native';
import GameCard from './GameCard';
import { gameSpotlightLabel } from '../lib/gameDisplay';
import { colors } from '../lib/theme';
import type { GameDisplay } from '../lib/types';

export default function FeaturedGame({
  game,
  onPress,
}: {
  game: GameDisplay;
  onPress: (game: GameDisplay) => void;
}) {
  const label = gameSpotlightLabel(game);
  return (
    <View style={styles.section}>
      <Text style={[styles.eyebrow, label === 'Next Up' ? styles.white : styles.teal]}>{label}</Text>
      <Text style={styles.copy}>Start here: the most relevant Spurs game for fans right now.</Text>
      <GameCard game={game} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 10 },
  eyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 1.6, textTransform: 'uppercase' },
  white: { color: colors.text },
  teal: { color: colors.teal },
  copy: { color: colors.muted, fontSize: 12 },
});
