import { StyleSheet, Text, View } from 'react-native';
import PassCard from '../components/PassCard';
import ScreenHeader from '../components/ScreenHeader';
import StatusPill from '../components/StatusPill';
import type { Ticket } from '../lib/account';
import { WALLET_PASSES, type WalletPass } from '../lib/experience';
import { colors, shared } from '../lib/theme';

const PASS_GROUPS: { title: string; kinds: WalletPass['kind'][]; empty: string }[] = [
  { title: 'Tickets', kinds: ['ticket'], empty: 'No game tickets are ready right now.' },
  { title: 'Pickup Orders', kinds: ['order'], empty: 'Shop pickup orders will appear here.' },
  { title: 'Rewards & Coupons', kinds: ['reward', 'coupon'], empty: 'Saved rewards and coupons will appear here.' },
];

export default function TicketsScreen({ tickets, onBack }: { tickets: Ticket[]; onBack: () => void }) {
  const readyCount = WALLET_PASSES.filter((pass) => pass.status === 'Ready').length;
  const savedCount = WALLET_PASSES.filter((pass) => pass.status === 'Saved' || pass.status === 'Preparing').length;

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        eyebrow="Wallet"
        title="Passes"
        copy="Tickets, pickup orders, Dot Race rewards, and fan shop coupons in one Apple Wallet-style hub."
        onBack={onBack}
        backLabel="Back to profile"
      />

      <View style={styles.walletHero}>
        <View>
          <Text style={styles.walletTitle}>Spurs Wallet</Text>
          <Text style={styles.walletCopy}>Mock pass center · {tickets.length} ticket packages linked</Text>
        </View>
        <View style={styles.heroPills}>
          <StatusPill label={`${readyCount} Ready`} tone="teal" />
          <StatusPill label={`${savedCount} Saved`} tone="pink" />
        </View>
      </View>

      {PASS_GROUPS.map((group) => {
        const passes = WALLET_PASSES.filter((pass) => group.kinds.includes(pass.kind));
        return (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {passes.length > 0 ? (
              passes.map((pass) => <PassCard key={pass.id} pass={pass} />)
            ) : (
              <EmptyPassState label={group.empty} />
            )}
          </View>
        );
      })}

      <View style={shared.panel}>
        <Text style={styles.sectionTitle}>Arena details</Text>
        <Text style={shared.body}>Lot B opens 2 hours before tipoff. Mobile entry, pickup orders, and rewards are mocked locally for demo mode.</Text>
      </View>
    </View>
  );
}

function EmptyPassState({ label }: { label: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Nothing here yet</Text>
      <Text style={styles.emptyCopy}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  walletHero: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#050708',
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.14)',
    gap: 14,
  },
  walletTitle: { color: colors.text, fontSize: 30, fontWeight: '900' },
  walletCopy: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 5 },
  heroPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  group: { gap: 10 },
  groupTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  empty: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    padding: 16,
  },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '900' },
  emptyCopy: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  sectionTitle: { color: colors.text, fontSize: 14, fontWeight: '900', marginBottom: 6 },
});
