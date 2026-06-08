import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ActionRow from '../components/ActionRow';
import PassCard from '../components/PassCard';
import StatusPill from '../components/StatusPill';
import type { MockAccount } from '../lib/account';
import { ACTIVITY, NOTIFICATIONS, SETUP_STEPS, WALLET_PASSES } from '../lib/experience';
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
  onNotificationsPress,
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
  onNotificationsPress: () => void;
  onTermsPress: () => void;
  onPrivacyPress: () => void;
}) {
  const setupComplete = SETUP_STEPS.filter((step) => step.complete).length;
  const unread = NOTIFICATIONS.filter((item) => item.unread).length;
  const actions: ProfileAction[] = [
    { label: 'Favorite Players', detail: `${account.favoritePlayers.length} tracked Spurs`, accent: colors.teal, onPress: onFavoritesPress },
    { label: 'Personalized Game Alerts', detail: `${account.alerts.filter((alert) => alert.enabled).length} active alert types`, accent: colors.pink, onPress: onAlertsPress },
    { label: 'Notification Center', detail: `${unread} unread lineup, wallet, and player updates`, accent: colors.orange, onPress: onNotificationsPress },
    { label: 'Wallet', detail: `${WALLET_PASSES.length} tickets, orders, rewards, and coupons`, accent: colors.teal, onPress: onTicketsPress },
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
        <View style={styles.setupCard}>
          <View style={styles.setupHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>Setup</Text>
              <Text style={styles.sectionTitle}>Game day ready</Text>
            </View>
            <StatusPill label={`${setupComplete}/${SETUP_STEPS.length}`} tone="teal" />
          </View>
          {SETUP_STEPS.map((step) => (
            <View key={step.id} style={styles.stepRow}>
              <View style={[styles.stepDot, step.complete && styles.stepDotDone]}>
                <Text style={styles.stepCheck}>{step.complete ? '✓' : ''}</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepDetail}>{step.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.previewBlock}>
          <View style={styles.previewHeader}>
            <Text style={styles.sectionTitle}>Wallet preview</Text>
            <Pressable onPress={onTicketsPress} hitSlop={8}>
              <Text style={styles.previewLink}>View all</Text>
            </Pressable>
          </View>
          <PassCard pass={WALLET_PASSES[0]} compact />
        </View>

        {actions.map((action) => (
          <ActionRow key={action.label} label={action.label} detail={action.detail} accent={action.accent} onPress={action.onPress} />
        ))}

        <View style={styles.activityBlock}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          {ACTIVITY.map((item) => (
            <View key={item.id} style={styles.activityRow}>
              <Text style={styles.activityTime}>{item.time}</Text>
              <View style={styles.activityText}>
                <Text style={styles.activityLabel}>{item.label}</Text>
                <Text style={styles.activityDetail}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>
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
  setupCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,178,169,0.28)',
    backgroundColor: 'rgba(0,178,169,0.08)',
    padding: 14,
    gap: 12,
  },
  setupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  sectionEyebrow: { color: colors.faint, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  stepRow: { flexDirection: 'row', gap: 10 },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: colors.teal, borderColor: colors.teal },
  stepCheck: { color: '#052f2d', fontSize: 12, fontWeight: '900' },
  stepText: { flex: 1 },
  stepLabel: { color: colors.text, fontSize: 13, fontWeight: '900' },
  stepDetail: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  previewBlock: { gap: 10 },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewLink: { color: colors.teal, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  activityBlock: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 14,
    gap: 12,
  },
  activityRow: { flexDirection: 'row', gap: 12 },
  activityTime: { width: 58, color: colors.faint, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  activityText: { flex: 1 },
  activityLabel: { color: colors.text, fontSize: 13, fontWeight: '900' },
  activityDetail: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
});
