import { StyleSheet, Text, View } from 'react-native';
import ActionRow from '../components/ActionRow';
import ScreenHeader from '../components/ScreenHeader';
import StatusPill from '../components/StatusPill';
import { NOTIFICATIONS, WALLET_PASSES } from '../lib/experience';
import { colors } from '../lib/theme';

export default function CommandScreen({
  onBack,
  onWalletPress,
  onAlertsPress,
  onShopPress,
}: {
  onBack: () => void;
  onWalletPress: () => void;
  onAlertsPress: () => void;
  onShopPress: () => void;
}) {
  const commands = [
    { label: 'Open live game', detail: 'Jump to the current Spurs game center.', accent: colors.teal, onPress: onBack },
    { label: 'View wallet', detail: `${WALLET_PASSES.length} passes, tickets, rewards, and pickup orders.`, accent: colors.orange, onPress: onWalletPress },
    { label: 'Notification center', detail: `${NOTIFICATIONS.filter((item) => item.unread).length} unread mock updates.`, accent: colors.pink, onPress: onAlertsPress },
    { label: 'Fan shop', detail: 'Browse arena pickup gear and saved rewards.', accent: '#c4ced4', onPress: onShopPress },
  ];

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        eyebrow="Command"
        title="Quick Actions"
        copy="A compact search-style surface for common game-day tasks."
        onBack={onBack}
        backLabel="Back home"
      />
      <View style={styles.searchBox}>
        <Text style={styles.searchText}>Search games, players, shop, passes...</Text>
        <StatusPill label="Mock" tone="orange" />
      </View>
      {commands.map((command) => (
        <ActionRow key={command.label} {...command} />
      ))}
      <View style={styles.hints}>
        <Text style={styles.hintsTitle}>Suggested</Text>
        <View style={styles.hintRow}>
          {['Wembanyama', 'Tickets', 'Dot Race reward', 'Lineups'].map((hint) => (
            <View key={hint} style={styles.hint}>
              <Text style={styles.hintText}>{hint}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 14,
  },
  searchText: { flex: 1, color: colors.faint, fontSize: 13, fontWeight: '800' },
  hints: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    padding: 14,
    gap: 10,
  },
  hintsTitle: { color: colors.text, fontSize: 14, fontWeight: '900' },
  hintRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hint: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 10, paddingVertical: 7 },
  hintText: { color: colors.muted, fontSize: 11, fontWeight: '900' },
});
