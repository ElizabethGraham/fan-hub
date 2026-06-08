import { Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import StatusPill from '../components/StatusPill';
import { NOTIFICATIONS } from '../lib/experience';
import { colors } from '../lib/theme';

export default function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const unreadCount = NOTIFICATIONS.filter((item) => item.unread).length;

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        eyebrow="Inbox"
        title="Notifications"
        copy="A mock push inbox for lineups, close games, player milestones, wallet updates, and shop rewards."
        onBack={onBack}
        backLabel="Back to profile"
      />
      <View style={styles.summary}>
        <Text style={styles.summaryValue}>{unreadCount}</Text>
        <Text style={styles.summaryLabel}>Unread updates</Text>
        <StatusPill label="Mock push center" tone="orange" />
      </View>
      {NOTIFICATIONS.map((item) => (
        <Pressable key={item.id} style={({ pressed }) => [styles.card, item.unread && styles.unread, pressed && styles.pressed]}>
          <View style={styles.cardHeader}>
            <StatusPill label={item.category} tone={item.category === 'Wallet' ? 'teal' : item.category === 'Shop' ? 'pink' : 'neutral'} />
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  summary: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245,130,32,0.26)',
    backgroundColor: 'rgba(245,130,32,0.08)',
    padding: 16,
    gap: 6,
  },
  summaryValue: { color: colors.text, fontSize: 32, fontWeight: '900' },
  summaryLabel: { color: colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 14,
  },
  unread: { borderColor: 'rgba(0,178,169,0.34)', backgroundColor: 'rgba(0,178,169,0.08)' },
  pressed: { opacity: 0.86 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  time: { color: colors.faint, fontSize: 11, fontWeight: '800' },
  title: { color: colors.text, fontSize: 15, fontWeight: '900', marginTop: 10 },
  body: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
});
