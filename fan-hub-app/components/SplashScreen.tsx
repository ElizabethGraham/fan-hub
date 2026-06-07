import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { teamLogoUrl } from '../lib/nba';
import { colors } from '../lib/theme';

const { width: W, height: H } = Dimensions.get('window');

const PIXEL_SIZE = 6;            // logical dp per pixel square
const COLS = Math.floor(W / PIXEL_SIZE);
const ROWS = Math.floor(H / PIXEL_SIZE);
const PIXEL_COUNT = 220;
const WAVE_DURATION = 1350;      // time for wave to cross from corner to corner (ms)

// Weighted toward silver/white to feel on-brand (spurs primary), with fiesta accents
const PALETTE = [
  '#c4ced4', '#c4ced4', '#c4ced4',   // silver (most common)
  '#ffffff', '#ffffff',               // white
  colors.teal,                        // teal accent
  colors.pink,                        // pink accent
  colors.orange,                      // orange accent
  '#e2e8f0',                          // near-white
];

type PixelDef = { col: number; row: number; color: string };

function makePixels(): PixelDef[] {
  const used = new Set<number>();
  const out: PixelDef[] = [];
  while (out.length < PIXEL_COUNT) {
    const col = Math.floor(Math.random() * COLS);
    const row = Math.floor(Math.random() * ROWS);
    const key = row * COLS + col;
    if (!used.has(key)) {
      used.add(key);
      out.push({ col, row, color: PALETTE[Math.floor(Math.random() * PALETTE.length)] });
    }
  }
  return out;
}

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const screenOpacity = useRef(new Animated.Value(0)).current;

  // Stable pixel positions for the lifetime of the splash
  const pixels = useMemo(() => makePixels(), []);

  // One Animated.Value per pixel slot — stays on native thread
  const opacities = useRef<Animated.Value[]>(
    Array.from({ length: PIXEL_COUNT }, () => new Animated.Value(0)),
  ).current;

  // Fire the pixel wave once on mount
  useEffect(() => {
    const mounted = { current: true };
    const timers: ReturnType<typeof setTimeout>[] = [];

    pixels.forEach((p, i) => {
      // Diagonal distance from top-left corner, normalised 0→1
      const dist = (p.col / COLS + p.row / ROWS) / 2;
      const waveDelay = dist * WAVE_DURATION + Math.random() * 120; // slight jitter
      const riseDur = 120 + Math.random() * 200;
      const holdDur = 80 + Math.random() * 160;
      const fallDur = 200 + Math.random() * 350;
      const peak = 0.45 + Math.random() * 0.45; // variety in brightness

      const timer = setTimeout(() => {
        if (!mounted.current) return;
        Animated.sequence([
          Animated.timing(opacities[i], { toValue: peak, duration: riseDur, useNativeDriver: true }),
          Animated.delay(holdDur),
          Animated.timing(opacities[i], { toValue: 0, duration: fallDur, useNativeDriver: true }),
        ]).start();
      }, waveDelay);
      timers.push(timer);
    });

    return () => {
      mounted.current = false;
      timers.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Overall screen fade-in → hold → fade-out
  useEffect(() => {
    Animated.sequence([
      Animated.timing(screenOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(1700),
      Animated.timing(screenOpacity, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start(onDone);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // Root always visible — dark bg is never transparent so no white flash
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: screenOpacity, alignItems: 'center', justifyContent: 'center' }]}>
        {/* Pixel field */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {pixels.map((p, i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                left: p.col * PIXEL_SIZE,
                top: p.row * PIXEL_SIZE,
                width: PIXEL_SIZE - 1,
                height: PIXEL_SIZE - 1,
                backgroundColor: p.color,
                opacity: opacities[i],
              }}
            />
          ))}
        </View>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.logo} />
        </View>

        {/* Sponsor lockup */}
        <View style={styles.sponsor}>
          <Text style={styles.presentedBy}>PRESENTED BY</Text>
          <Text style={styles.sponsorName}>✳ Frost</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  logoWrap: { marginBottom: 64 },
  logo: { width: 210, height: 210, resizeMode: 'contain' },
  sponsor: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  presentedBy: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
  },
  sponsorName: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
