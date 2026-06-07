import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { MockAccount } from '../lib/account';
import { teamLogoUrl } from '../lib/nba';
import { colors } from '../lib/theme';

type ProfileAction = {
  label: string;
  detail: string;
  accent: string;
  onPress: () => void;
};

export default function ProfileScreen({
  onBack,
  onLoginPress,
  account,
  onFavoritesPress,
  onAlertsPress,
  onTicketsPress,
  onSettingsPress,
  onTermsPress,
  onPrivacyPress,
}: {
  onBack: () => void;
  onLoginPress?: () => void;
  account: MockAccount;
  onFavoritesPress: () => void;
  onAlertsPress: () => void;
  onTicketsPress: () => void;
  onSettingsPress: () => void;
  onTermsPress: () => void;
  onPrivacyPress: () => void;
}) {
  const actions: ProfileAction[] = [
    { label: 'Favorite Players', detail: `${account.favoritePlayers.length} tracked Spurs`, accent: colors.teal, onPress: onFavoritesPress },
    { label: 'Personalized Game Alerts', detail: `${account.alerts.filter((alert) => alert.enabled).length} active alert types`, accent: colors.pink, onPress: onAlertsPress },
    { label: 'Tickets & Wallet', detail: `${account.tickets.length} upcoming ticket packages`, accent: colors.orange, onPress: onTicketsPress },
    { label: 'App Settings', detail: 'Display, haptics, and mock confirmations', accent: '#c4ced4', onPress: onSettingsPress },
    { label: 'Terms & Conditions', detail: 'Mock build usage terms', accent: colors.faint, onPress: onTermsPress },
    { label: 'Privacy Policy', detail: 'Local-only data handling notes', accent: colors.faint, onPress: onPrivacyPress },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backChevron}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        <View style={styles.accountRow}>
          <View style={styles.avatar}>
            <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.logo} />
          </View>
          <View style={styles.accountText}>
            <Text style={styles.heroTitle}>My Spurs</Text>
            <Text style={styles.name}>{account.name}</Text>
            <Text style={styles.email}>{account.email}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{account.membership}</Text>
            <Text style={styles.statLabel}>Membership</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{account.rewardBalance.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Reward pts</Text>
          </View>
        </View>

        <Pressable style={styles.loginBtn} onPress={onLoginPress}>
          <Text style={styles.loginBtnText}>Refresh mock account</Text>
        </Pressable>
      </View>

      <View style={styles.fiestaStripe}>
        <View style={[styles.fiestaSegment, { backgroundColor: colors.teal }]} />
        <View style={[styles.fiestaSegment, { backgroundColor: colors.pink }]} />
        <View style={[styles.fiestaSegment, { backgroundColor: colors.orange }]} />
      </View>

      <View style={styles.body}>
        {actions.map((action) => (
          <Pressable key={action.label} onPress={action.onPress} style={({ pressed }) => [styles.listItem, pressed && styles.pressed]}>
            <View style={[styles.actionMark, { backgroundColor: action.accent }]} />
            <View style={styles.listText}>
              <Text style={styles.listItemText}>{action.label}</Text>
              <Text style={styles.listDetail}>{action.detail}</Text>
            </View>
            <Text style={styles.listChevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: -16, marginTop: -18 },
  hero: {
    backgroundColor: '#080c10',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  backChevron: { color: '#c4ced4', fontSize: 24, lineHeight: 26, fontWeight: '300' },
  backLabel: { color: '#c4ced4', fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#c4ced4',
  },
  logo: { width: 52, height: 52, resizeMode: 'contain' },
  accountText: { flex: 1 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '900' },
  name: { color: '#fff', fontSize: 16, fontWeight: '900', marginTop: 4 },
  email: { color: colors.muted, fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  stat: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 12,
  },
  statValue: { color: colors.text, fontSize: 14, fontWeight: '900' },
  statLabel: { color: colors.faint, fontSize: 10, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase', marginTop: 4 },
  loginBtn: {
    alignSelf: 'flex-start',
    marginTop: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loginBtnText: { color: colors.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  fiestaStripe: { flexDirection: 'row', height: 3 },
  fiestaSegment: { flex: 1 },
  body: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 10 },
  pressed: { opacity: 0.82 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.12)',
    backgroundColor: colors.panel,
    padding: 14,
  },
  actionMark: { width: 8, height: 36, borderRadius: 999 },
  listText: { flex: 1 },
  listItemText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  listDetail: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  listChevron: { color: colors.faint, fontSize: 22, fontWeight: '300' },
});
