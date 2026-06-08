import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import StatusPill from '../components/StatusPill';
import type { GameAlert } from '../lib/account';
import { NOTIFICATIONS } from '../lib/experience';
import { colors } from '../lib/theme';

export default function AlertsScreen({
  alerts,
  onBack,
  onInboxPress,
}: {
  alerts: GameAlert[];
  onBack: () => void;
  onInboxPress?: () => void;
}) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(alerts.map((alert) => [alert.id, alert.enabled])),
  );

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        eyebrow="Notifications"
        title="Personalized Game Alerts"
        copy="Mock push preferences for lineups, close games, player runs, wallet updates, and shop rewards."
        onBack={onBack}
        backLabel="Back to profile"
      />
      <Pressable onPress={onInboxPress} style={styles.inboxCard}>
        <View>
          <Text style={styles.inboxTitle}>Notification Center</Text>
          <Text style={styles.inboxCopy}>{NOTIFICATIONS.filter((item) => item.unread).length} unread mock updates</Text>
        </View>
        <StatusPill label="Open inbox" tone="orange" />
      </Pressable>
      {alerts.map((alert) => (
        <Pressable
          key={alert.id}
          onPress={() => setEnabled((current) => ({ ...current, [alert.id]: !current[alert.id] }))}
          style={styles.row}
        >
          <View style={styles.rowText}>
            <Text style={styles.label}>{alert.label}</Text>
            <Text style={styles.detail}>{alert.detail}</Text>
          </View>
          <View style={[styles.status, enabled[alert.id] && styles.statusOn]}>
            <Text style={[styles.statusText, enabled[alert.id] && styles.statusTextOn]}>
              {enabled[alert.id] ? 'ON' : 'OFF'}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  title: { marginTop: 4, marginBottom: 8 },
  inboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245,130,32,0.26)',
    backgroundColor: 'rgba(245,130,32,0.08)',
    padding: 14,
  },
  inboxTitle: { color: colors.text, fontSize: 14, fontWeight: '900' },
  inboxCopy: { color: colors.muted, fontSize: 12, marginTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 14,
  },
  rowText: { flex: 1 },
  label: { color: colors.text, fontSize: 14, fontWeight: '900' },
  detail: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  status: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.panelSoft,
  },
  statusOn: { borderColor: 'rgba(0,178,169,0.42)', backgroundColor: 'rgba(0,178,169,0.12)' },
  statusText: { color: colors.faint, fontSize: 10, fontWeight: '900' },
  statusTextOn: { color: colors.teal },
});
