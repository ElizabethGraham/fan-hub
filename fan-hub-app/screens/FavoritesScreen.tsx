import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PlayerAvatar from '../components/PlayerAvatar';
import type { FavoritePlayer } from '../lib/account';
import { colors, shared } from '../lib/theme';

export default function FavoritesScreen({
  players,
  onBack,
}: {
  players: FavoritePlayer[];
  onBack: () => void;
}) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(players.map((player) => [player.id, player.alertsEnabled])),
  );

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>Back to profile</Text>
      </Pressable>
      <View style={shared.panel}>
        <Text style={shared.eyebrow}>Personalization</Text>
        <Text style={[shared.title, styles.title]}>Favorite Players</Text>
        <Text style={shared.body}>Tune the app around the players you want surfaced first on game day.</Text>
      </View>
      {players.map((player) => (
        <Pressable
          key={player.id}
          onPress={() => setEnabled((current) => ({ ...current, [player.id]: !current[player.id] }))}
          style={styles.playerCard}
        >
          <PlayerAvatar
            firstName={player.firstName}
            lastName={player.lastName}
            reference={player.reference}
            featured={enabled[player.id]}
          />
          <View style={styles.playerText}>
            <Text style={styles.playerName}>{player.firstName} {player.lastName}</Text>
            <Text style={styles.playerReason}>{player.position} - {player.reason}</Text>
          </View>
          <View style={[styles.toggle, enabled[player.id] && styles.toggleOn]}>
            <View style={[styles.knob, enabled[player.id] && styles.knobOn]} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  back: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.panel,
  },
  backText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  title: { marginTop: 4, marginBottom: 8 },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 12,
  },
  playerText: { flex: 1 },
  playerName: { color: colors.text, fontSize: 14, fontWeight: '900' },
  playerReason: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#27272a',
    borderWidth: 1,
    borderColor: '#3f3f46',
    padding: 3,
  },
  toggleOn: { backgroundColor: 'rgba(0,178,169,0.24)', borderColor: 'rgba(0,178,169,0.48)' },
  knob: { width: 18, height: 18, borderRadius: 999, backgroundColor: colors.faint },
  knobOn: { alignSelf: 'flex-end', backgroundColor: colors.teal },
});
