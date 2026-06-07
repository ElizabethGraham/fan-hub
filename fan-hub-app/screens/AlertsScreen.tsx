import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { GameAlert } from '../lib/account';
import { colors, shared } from '../lib/theme';

export default function AlertsScreen({ alerts, onBack }: { alerts: GameAlert[]; onBack: () => void }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(alerts.map((alert) => [alert.id, alert.enabled])),
  );

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>Back to profile</Text>
      </Pressable>
      <View style={shared.panel}>
        <Text style={shared.eyebrow}>Notifications</Text>
        <Text style={[shared.title, styles.title]}>Personalized Game Alerts</Text>
        <Text style={shared.body}>Mock push preferences for lineups, close games, player runs, and shop rewards.</Text>
      </View>
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
