import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';

export default function ActionRow({
  label,
  detail,
  accent,
  onPress,
}: {
  label: string;
  detail: string;
  accent: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.mark, { backgroundColor: accent }]} />
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.12)',
    backgroundColor: colors.panel,
    padding: 14,
  },
  pressed: { opacity: 0.82 },
  mark: { width: 8, height: 36, borderRadius: 999 },
  text: { flex: 1 },
  label: { color: colors.text, fontSize: 14, fontWeight: '900' },
  detail: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  chevron: { color: colors.faint, fontSize: 22, fontWeight: '300' },
});
