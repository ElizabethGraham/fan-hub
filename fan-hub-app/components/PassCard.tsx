import { Pressable, StyleSheet, Text, View } from 'react-native';
import StatusPill from './StatusPill';
import type { WalletPass } from '../lib/experience';
import { colors } from '../lib/theme';

function toneForStatus(status: WalletPass['status']) {
  if (status === 'Ready') return 'teal';
  if (status === 'Preparing') return 'orange';
  if (status === 'Saved') return 'pink';
  if (status === 'Upcoming') return 'orange';
  return 'neutral';
}

export default function PassCard({ pass, compact = false }: { pass: WalletPass; compact?: boolean }) {
  return (
    <Pressable style={({ pressed }) => [styles.pass, compact && styles.compact, pressed && styles.pressed]}>
      <View style={[styles.side, { backgroundColor: pass.accent }]}>
        <Text style={styles.sideText}>{pass.kind}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{pass.title}</Text>
          <StatusPill label={pass.status} tone={toneForStatus(pass.status)} />
        </View>
        <Text style={styles.subtitle}>{pass.subtitle}</Text>
        <Text style={styles.detail}>{pass.detail}</Text>
        {!compact && (
          <View style={styles.barcode}>
            {Array.from({ length: 20 }).map((_, index) => (
              <View key={index} style={[styles.bar, { height: index % 3 === 0 ? 28 : index % 2 === 0 ? 18 : 23 }]} />
            ))}
          </View>
        )}
        <Text style={styles.action}>{pass.primaryAction}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pass: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.14)',
    backgroundColor: colors.panel,
  },
  compact: { minHeight: 124 },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.9 },
  side: { width: 46, alignItems: 'center', justifyContent: 'center' },
  sideText: { color: '#061010', fontSize: 10, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase', transform: [{ rotate: '-90deg' }] },
  body: { flex: 1, padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  title: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 12, fontWeight: '800', marginTop: 6 },
  detail: { color: colors.text, fontSize: 12, fontWeight: '800', marginTop: 8 },
  barcode: {
    height: 42,
    borderRadius: 9,
    backgroundColor: '#f4f4f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  bar: { width: 3, borderRadius: 2, backgroundColor: '#111113' },
  action: { color: colors.teal, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12 },
});
