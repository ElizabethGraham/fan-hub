import { StyleSheet, Text, View } from 'react-native';
import GameCard from './GameCard';
import { colors } from '../lib/theme';
import type { GameDisplay } from '../lib/types';

type Props = {
  title: string;
  description?: string;
  games: GameDisplay[];
  onGamePress: (game: GameDisplay) => void;
};

export default function GameSection({ title, description, games, onGamePress }: Props) {
  if (games.length === 0) return null;
  return (
    <View style={styles.section}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {games.map((game) => (
        <GameCard key={game.id} game={game} onPress={onGamePress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  title: { color: colors.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1.6, textTransform: 'uppercase' },
  description: { color: colors.muted, fontSize: 12, marginTop: 3 },
});
