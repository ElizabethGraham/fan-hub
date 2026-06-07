import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Ticket } from '../lib/account';
import { colors, shared } from '../lib/theme';

export default function TicketsScreen({ tickets, onBack }: { tickets: Ticket[]; onBack: () => void }) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>Back to profile</Text>
      </Pressable>
      <View style={styles.walletHero}>
        <Text style={shared.eyebrow}>Tickets</Text>
        <Text style={styles.walletTitle}>Wallet</Text>
        <Text style={styles.walletCopy}>Mock ticket management for entry, transfers, parking, and account review.</Text>
      </View>
      {tickets.map((ticket) => (
        <View key={ticket.id} style={styles.ticket}>
          <View style={styles.ticketStub}>
            <Text style={styles.stubText}>SAS</Text>
          </View>
          <View style={styles.ticketBody}>
            <View style={styles.ticketHeader}>
              <Text style={styles.opponent}>Spurs vs {ticket.opponent}</Text>
              <Text style={styles.status}>{ticket.status}</Text>
            </View>
            <Text style={styles.date}>{ticket.date}</Text>
            <Text style={styles.seat}>{ticket.seat}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.actionBtn}><Text style={styles.actionText}>Add to Wallet</Text></Pressable>
              <Pressable style={styles.secondaryBtn}><Text style={styles.secondaryText}>Transfer</Text></Pressable>
            </View>
          </View>
        </View>
      ))}
      <View style={shared.panel}>
        <Text style={styles.sectionTitle}>Parking & arena</Text>
        <Text style={shared.body}>Lot B opens 2 hours before tipoff. Mobile entry and concession rewards are mocked for demo mode.</Text>
      </View>
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
  walletHero: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: '#050708',
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.14)',
  },
  walletTitle: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 4 },
  walletCopy: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 8 },
  ticket: {
    flexDirection: 'row',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  ticketStub: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal,
  },
  stubText: { color: '#061010', fontSize: 13, fontWeight: '900', transform: [{ rotate: '-90deg' }] },
  ticketBody: { flex: 1, padding: 14 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  opponent: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '900' },
  status: { color: colors.orange, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  date: { color: colors.muted, fontSize: 12, marginTop: 6 },
  seat: { color: colors.text, fontSize: 12, fontWeight: '800', marginTop: 8 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  actionBtn: { borderRadius: 10, backgroundColor: colors.text, paddingHorizontal: 12, paddingVertical: 9 },
  actionText: { color: colors.bg, fontSize: 11, fontWeight: '900' },
  secondaryBtn: { borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 9 },
  secondaryText: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  sectionTitle: { color: colors.text, fontSize: 14, fontWeight: '900', marginBottom: 6 },
});
