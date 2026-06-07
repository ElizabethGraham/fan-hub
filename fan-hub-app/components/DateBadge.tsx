import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';

function parseParts(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return {
    month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dt).toUpperCase(),
    day: new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(dt),
  };
}

export default function DateBadge({ date }: { date: string }) {
  const parts = parseParts(date);
  return (
    <View style={styles.badge}>
      <Text style={styles.month}>{parts.month}</Text>
      <Text style={styles.day}>{parts.day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 44,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3f3f46',
    backgroundColor: '#27272a',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  month: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  day: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
});
