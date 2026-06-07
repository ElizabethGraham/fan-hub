import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { teamLogoUrl } from '../lib/nba';
import { colors } from '../lib/theme';

const HERO_BG = '#0d1117';

export default function ProfileScreen({ onBack, onLoginPress }: { onBack: () => void; onLoginPress?: () => void }) {
  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backChevron}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        <Text style={styles.heroTitle}>My Profile</Text>

        <ProfileIllustration />

        {/* Fiesta stripe */}
        <View style={styles.fiestaStripe}>
          <View style={[styles.fiestaSegment, { backgroundColor: colors.teal }]} />
          <View style={[styles.fiestaSegment, { backgroundColor: colors.pink }]} />
          <View style={[styles.fiestaSegment, { backgroundColor: colors.orange }]} />
        </View>
      </View>

      {/* Wave separator — hero color wave on app-bg */}
      <Svg
        width="100%"
        height={36}
        viewBox="0 0 400 36"
        preserveAspectRatio="none"
        style={styles.wave}
      >
        <Path
          d="M0,0 Q80,36 160,12 Q260,-12 340,24 Q370,36 400,18 L400,0 Z"
          fill={HERO_BG}
        />
      </Svg>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          Sign in to track your favourite players, get personalised game alerts, and unlock exclusive fan rewards.
        </Text>

        <Pressable style={styles.loginBtn} onPress={onLoginPress}>
          <Text style={styles.loginBtnText}>LOG IN / CREATE ACCOUNT</Text>
        </Pressable>

        <View style={styles.listSection}>
          {(['App Settings', 'Terms & Conditions', 'Privacy Policy'] as const).map((label, i, arr) => (
            <Pressable key={label} style={[styles.listItem, i < arr.length - 1 && styles.listItemBorder]}>
              <Text style={styles.listItemText}>{label}</Text>
              <Text style={styles.listChevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

function ProfileIllustration() {
  return (
    <View style={styles.illustration}>
      {/* ID card — angled left */}
      <View style={styles.idCard}>
        <View style={styles.idPersonCircle} />
        <View style={styles.idPersonBody} />
        <Text style={styles.idLabel}>ID</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarStack}>
        {/* Head */}
        <View style={styles.avatarHead}>
          <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.avatarLogo} />
        </View>
        {/* Jersey body */}
        <View style={styles.avatarBody} />
      </View>

      {/* + badge */}
      <View style={styles.plusBadge}>
        <Text style={styles.plusText}>+</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -16,
    marginTop: -18,
  },

  // Hero
  hero: {
    backgroundColor: HERO_BG,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backChevron: { color: '#c4ced4', fontSize: 24, lineHeight: 26, fontWeight: '300' },
  backLabel: { color: '#c4ced4', fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 24,
  },

  // Illustration
  illustration: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 0,
    marginBottom: 24,
    height: 130,
  },
  idCard: {
    width: 68,
    height: 86,
    backgroundColor: '#1e2533',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    transform: [{ rotate: '-10deg' }, { translateY: 10 }],
    marginRight: -12,
    zIndex: 1,
  },
  idPersonCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#c4ced4',
  },
  idPersonBody: {
    width: 34,
    height: 16,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#c4ced4',
  },
  idLabel: {
    color: '#c4ced4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  avatarStack: { alignItems: 'center', zIndex: 2 },
  avatarHead: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#c4ced4',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  avatarLogo: { width: 50, height: 50, resizeMode: 'contain' },
  avatarBody: {
    width: 88,
    height: 68,
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: 'rgba(196,206,212,0.25)',
    marginTop: -4,
  },
  plusBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    marginLeft: -18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  plusText: { color: '#000', fontSize: 18, fontWeight: '800', lineHeight: 22 },

  // Fiesta stripe
  fiestaStripe: { flexDirection: 'row', marginHorizontal: -20, height: 3 },
  fiestaSegment: { flex: 1, opacity: 0.85 },

  // Wave
  wave: { marginTop: -1, backgroundColor: colors.bg },

  // Body
  body: { backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  bodyText: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loginBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  listSection: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.12)',
    backgroundColor: '#18181b',
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196,206,212,0.1)',
  },
  listItemText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  listChevron: { color: '#71717a', fontSize: 20, fontWeight: '300' },
});
