import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shared } from '../lib/theme';

const SETTINGS = [
  { id: 'haptics', label: 'Haptics', detail: 'Use light feedback for game picks and shop actions', initial: true },
  { id: 'compact', label: 'Compact schedule cards', detail: 'Show more games per screen on Home and Schedule', initial: false },
  { id: 'mock', label: 'Mock mode confirmations', detail: 'Show local-only labels for auth, tickets, and checkout', initial: true },
];

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SETTINGS.map((setting) => [setting.id, setting.initial])),
  );

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>Back to profile</Text>
      </Pressable>
      <View style={shared.panel}>
        <Text style={shared.eyebrow}>Preferences</Text>
        <Text style={[shared.title, styles.title]}>App Settings</Text>
        <Text style={shared.body}>Local-only preferences for this mock build.</Text>
      </View>
      {SETTINGS.map((setting) => (
        <Pressable
          key={setting.id}
          onPress={() => setEnabled((current) => ({ ...current, [setting.id]: !current[setting.id] }))}
          style={styles.row}
        >
          <View style={styles.rowText}>
            <Text style={styles.label}>{setting.label}</Text>
            <Text style={styles.detail}>{setting.detail}</Text>
          </View>
          <Text style={[styles.value, enabled[setting.id] && styles.valueOn]}>{enabled[setting.id] ? 'On' : 'Off'}</Text>
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
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 14,
  },
  rowText: { flex: 1 },
  label: { color: colors.text, fontSize: 14, fontWeight: '900' },
  detail: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  value: { color: colors.faint, fontSize: 12, fontWeight: '900' },
  valueOn: { color: colors.teal },
});
