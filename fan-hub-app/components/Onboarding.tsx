import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
import { teamLogoUrl } from '../lib/nba';
import { colors } from '../lib/theme';

const PAGES = [
  {
    id: 'welcome' as const,
    accentColor: colors.teal,
    title: 'YOUR GAME\nDAY HUB',
    body: 'Live scores, stats, highlights, and exclusive fan content — built for Spurs fans.',
    cta: 'Get Started',
    skip: null,
  },
  {
    id: 'notifications' as const,
    accentColor: colors.orange,
    title: 'NEVER MISS\nA MOMENT',
    body: 'Get alerts for tip-off, big plays, trades, and breaking Spurs news the second it drops.',
    cta: 'Allow Notifications',
    skip: 'Maybe later',
  },
  {
    id: 'location' as const,
    accentColor: colors.pink,
    title: 'FIND YOUR\nWAY IN',
    body: 'Enable location for Frost Bank Center directions, parking, and nearby game-day events.',
    cta: 'Allow Location',
    skip: 'Not now',
  },
] as const;

type PageId = (typeof PAGES)[number]['id'];

export default function Onboarding({ onDone, startPage = 0 }: { onDone: () => void; startPage?: number }) {
  const [index, setIndex] = useState(startPage);
  const page = PAGES[index];
  const isLast = index === PAGES.length - 1;

  function advance() {
    if (isLast) onDone();
    else setIndex(index + 1);
  }

  const accentBg = `${page.accentColor}10`;

  return (
    <View style={styles.root}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: '#080c10' }]}>
        <HeroScene id={page.id} color={page.accentColor} />
      </View>

      {/* Content — subtle accent wash */}
      <View style={[styles.content, { backgroundColor: accentBg }]}>
        <View style={[styles.accentBar, { backgroundColor: page.accentColor }]} />
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.body}>{page.body}</Text>

        <Pressable style={[styles.cta, { backgroundColor: page.accentColor }]} onPress={advance}>
          <Text style={styles.ctaText}>{isLast ? "LET'S GO SPURS" : page.cta.toUpperCase()}</Text>
        </Pressable>

        {page.skip && !isLast && (
          <Pressable onPress={advance} style={styles.skipBtn}>
            <Text style={styles.skipText}>{page.skip}</Text>
          </Pressable>
        )}
      </View>

      {/* Dots */}
      <View style={[styles.dots, { backgroundColor: accentBg }]}>
        {PAGES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && { width: 22, backgroundColor: page.accentColor }]} />
        ))}
      </View>
    </View>
  );
}

// ─── Hero scenes ────────────────────────────────────────────────────────────

function HeroScene({ id, color }: { id: PageId; color: string }) {
  if (id === 'welcome') return <WelcomeHero color={color} />;
  if (id === 'notifications') return <NotificationsHero color={color} />;
  return <LocationHero color={color} />;
}

// Welcome: Spurs logo with 4 pulsing sonar rings in fiesta colors
function WelcomeHero({ color }: { color: string }) {
  const rings = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const anims = rings.map((r, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 480),
          Animated.timing(r, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(r, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ),
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ringColors = [colors.teal, colors.pink, colors.orange, '#c4ced4'];

  return (
    <View style={styles.heroCenter}>
      {/* Basketball court background lines */}
      <View style={StyleSheet.absoluteFill}>
        <CourtBg />
      </View>

      {/* Sonar rings */}
      {rings.map((r, i) => (
        <Animated.View
          key={i}
          style={[
            styles.ring,
            {
              borderColor: ringColors[i],
              opacity: r.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.55, 0] }),
              transform: [{ scale: r.interpolate({ inputRange: [0, 1], outputRange: [0.55, 2.4] }) }],
            },
          ]}
        />
      ))}

      {/* Logo */}
      <View style={[styles.logoRing, { borderColor: `${color}50` }]}>
        <View style={[styles.logoRingInner, { borderColor: `${color}28` }]}>
          <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.welcomeLogo} />
        </View>
      </View>

      {/* Fiesta stripe */}
      <View style={styles.fiestaRow}>
        <View style={[styles.fiestaChip, { backgroundColor: colors.teal }]} />
        <View style={[styles.fiestaChip, { backgroundColor: colors.pink }]} />
        <View style={[styles.fiestaChip, { backgroundColor: colors.orange }]} />
      </View>
    </View>
  );
}

// A simplified court background using SVG (key, arc, center circle)
function CourtBg() {
  const stroke = 'rgba(255,255,255,0.045)';
  const sw = 1.2;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 320 340" preserveAspectRatio="xMidYMid slice">
      {/* Court border */}
      <Rect x="20" y="20" width="280" height="300" stroke={stroke} strokeWidth={sw} fill="none" />
      {/* Center circle */}
      <Circle cx="160" cy="170" r="48" stroke={stroke} strokeWidth={sw} fill="none" />
      {/* Center line */}
      <Line x1="20" y1="170" x2="300" y2="170" stroke={stroke} strokeWidth={sw} />
      {/* Paint top */}
      <Rect x="100" y="20" width="120" height="80" stroke={stroke} strokeWidth={sw} fill="none" />
      {/* Paint bottom */}
      <Rect x="100" y="240" width="120" height="80" stroke={stroke} strokeWidth={sw} fill="none" />
      {/* 3pt arc top */}
      <Path d="M 55,20 A 105,105 0 0 1 265,20" stroke={stroke} strokeWidth={sw} fill="none" />
      {/* 3pt arc bottom */}
      <Path d="M 55,320 A 105,105 0 0 0 265,320" stroke={stroke} strokeWidth={sw} fill="none" />
      {/* Free throw circles */}
      <Circle cx="160" cy="100" r="32" stroke={stroke} strokeWidth={sw} fill="none" />
      <Circle cx="160" cy="240" r="32" stroke={stroke} strokeWidth={sw} fill="none" />
    </Svg>
  );
}

// Notifications: animated mock notification card
function NotificationsHero({ color }: { color: string }) {
  const floatY = useRef(new Animated.Value(0)).current;
  const card1Scale = useRef(new Animated.Value(0.85)).current;
  const card1Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -10, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    ).start();

    // Card slide-in
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(card1Scale, { toValue: 1, friction: 6, tension: 180, useNativeDriver: true }),
        Animated.timing(card1Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.heroCenter}>
      {/* Background glow */}
      <View style={[styles.glowOrb, { backgroundColor: color, width: 260, height: 260, opacity: 0.12 }]} />

      <Animated.View style={{ transform: [{ translateY: floatY }], alignItems: 'center', gap: 14 }}>
        {/* Main notification card */}
        <Animated.View style={[styles.notifCard, { opacity: card1Opacity, transform: [{ scale: card1Scale }] }]}>
          <View style={[styles.notifAccent, { backgroundColor: color }]} />
          <View style={styles.notifHeader}>
            <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.notifLogo} />
            <View style={{ flex: 1 }}>
              <Text style={styles.notifApp}>SAN ANTONIO SPURS</Text>
              <Text style={styles.notifTime}>just now</Text>
            </View>
          </View>
          <Text style={styles.notifTitle}>🏀 Tip-off in 15 minutes</Text>
          <Text style={styles.notifBody}>Spurs vs Thunder · Wembanyama is listed as probable</Text>
        </Animated.View>

        {/* Second smaller card */}
        <Animated.View style={[styles.notifCardSmall, { opacity: card1Opacity }]}>
          <View style={[styles.notifAccent, { backgroundColor: colors.pink }]} />
          <Text style={styles.notifSmallText}>🔥 Wemby just dropped 12 pts in Q2</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// Location: top-down Frost Bank Center court with animated pin drop
function LocationHero({ color }: { color: string }) {
  const pinY = useRef(new Animated.Value(-80)).current;
  const pinOpacity = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(pinY, { toValue: 0, friction: 5, tension: 160, useNativeDriver: true }),
        Animated.timing(pinOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(ripple, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(ripple, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.delay(600),
        ]),
      ),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.heroCenter}>
      {/* Background glow */}
      <View style={[styles.glowOrb, { backgroundColor: color, bottom: -40, right: -40, width: 200, height: 200, opacity: 0.15 }]} />

      {/* Court aerial view */}
      <View style={styles.courtContainer}>
        <Svg width="220" height="140" viewBox="0 0 220 140">
          {/* Court floor */}
          <Rect x="2" y="2" width="216" height="136" rx="6" fill="rgba(180,140,80,0.12)" stroke={`${color}55`} strokeWidth="1.5" />
          {/* Center line */}
          <Line x1="110" y1="2" x2="110" y2="138" stroke={`${color}40`} strokeWidth="1" />
          {/* Center circle */}
          <Circle cx="110" cy="70" r="22" stroke={`${color}55`} strokeWidth="1.2" fill="none" />
          {/* Left key */}
          <Rect x="2" y="42" width="42" height="56" stroke={`${color}50`} strokeWidth="1.2" fill="rgba(255,255,255,0.03)" />
          {/* Right key */}
          <Rect x="176" y="42" width="42" height="56" stroke={`${color}50`} strokeWidth="1.2" fill="rgba(255,255,255,0.03)" />
          {/* Left 3pt arc */}
          <Path d="M 2,24 A 68,68 0 0 1 2,116" stroke={`${color}45`} strokeWidth="1.2" fill="none" />
          {/* Right 3pt arc */}
          <Path d="M 218,24 A 68,68 0 0 0 218,116" stroke={`${color}45`} strokeWidth="1.2" fill="none" />
          {/* Left free throw circle */}
          <Ellipse cx="44" cy="70" rx="18" ry="18" stroke={`${color}40`} strokeWidth="1" fill="none" />
          {/* Right free throw circle */}
          <Ellipse cx="176" cy="70" rx="18" ry="18" stroke={`${color}40`} strokeWidth="1" fill="none" />
          {/* Baskets */}
          <Circle cx="10" cy="70" r="4" stroke={`${color}80`} strokeWidth="1.5" fill="none" />
          <Circle cx="210" cy="70" r="4" stroke={`${color}80`} strokeWidth="1.5" fill="none" />
        </Svg>

        {/* Animated location pin centered on court */}
        <Animated.View style={[styles.pinWrap, { opacity: pinOpacity, transform: [{ translateY: pinY }] }]}>
          {/* Ripple */}
          <Animated.View style={[
            styles.pinRipple,
            {
              borderColor: color,
              opacity: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
              transform: [{ scale: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.2] }) }],
            },
          ]} />
          {/* Pin */}
          <View style={[styles.pin, { backgroundColor: color }]}>
            <View style={styles.pinDot} />
          </View>
        </Animated.View>
      </View>

      <Text style={[styles.venueLabel, { color }]}>FROST BANK CENTER</Text>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050505' },

  hero: {
    flex: 58,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCenter: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  glowOrb: { position: 'absolute', borderRadius: 999 },

  // Welcome
  ring: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
  },
  logoRing: {
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRingInner: {
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeLogo: { width: 108, height: 108, resizeMode: 'contain' },
  fiestaRow: { flexDirection: 'row', gap: 5 },
  fiestaChip: { width: 32, height: 3, borderRadius: 2 },

  // Notifications
  notifCard: {
    width: 280,
    backgroundColor: '#141418',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 14,
    gap: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  notifCardSmall: {
    width: 256,
    backgroundColor: '#0f1014',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 12,
    overflow: 'hidden',
  },
  notifAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifLogo: { width: 22, height: 22, resizeMode: 'contain' },
  notifApp: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  notifTime: { color: 'rgba(255,255,255,0.3)', fontSize: 9 },
  notifTitle: { color: '#fff', fontSize: 13, fontWeight: '800' },
  notifBody: { color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 16 },
  notifSmallText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginLeft: 6 },

  // Location
  courtContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinRipple: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  pin: {
    width: 28,
    height: 36,
    borderRadius: 14,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  pinDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  venueLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  // Content
  content: {
    flex: 42,
    paddingHorizontal: 28,
    paddingTop: 26,
    gap: 10,
  },
  accentBar: { height: 3, width: 44, borderRadius: 2, marginBottom: 2 },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -0.5, lineHeight: 36 },
  body: { color: '#a1a1aa', fontSize: 14, lineHeight: 21 },
  cta: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1.3 },
  skipBtn: { alignItems: 'center', paddingVertical: 10 },
  skipText: { color: '#52525b', fontSize: 13 },

  // Dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#27272a' },
});
