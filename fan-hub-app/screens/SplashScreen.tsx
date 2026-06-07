import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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

function FrostLogo({
  width = 112,
  color = '#ffffff',
}: {
  width?: number;
  color?: string;
}) {
  const height = width * (100.66 / 300);

  return (
    <Svg width={width} height={height} viewBox="0 0 300 100.66">
      <Path
        fill={color}
        d="M157.99,82.22v-3.76c4.64-0.22,6.86-1.33,6.86-4.87V48.6c0-4.42-0.66-5.53-6.86-5.53v-3.76c5.31-0.44,10.39-1.55,13.27-3.32v13.05h0.22c1.99-7.52,7.74-13.05,16.81-13.05l-1.33,8.18c-5.31-0.22-8.4,0.66-10.39,2.43c-3.1,3.1-4.2,8.4-4.2,20.57c0,9.29,0.44,11.28,8.18,11.06v3.76h-22.56V82.22z M271.22,42.19v-3.76c5.53-0.66,9.51-4.2,10.17-13.27h4.42v12.16h7.96c2.65,0,4.42-0.44,5.97-0.88l-1.77,5.97H285.6v28.53c0,5.09,3.1,6.19,11.06,6.19c1.55,0,1.11,0,2.65-0.22l-0.88,5.31c-2.43,0.66-4.42,0.88-7.74,0.88c-6.19,0-12.61-3.32-12.61-9.51V42.63h-6.86V42.19z M237.16,66.07h4.42v2.43c0,7.96,3.54,9.95,10.84,9.95c5.97,0,8.85-2.65,8.85-6.41c0-12.16-24.33-8.63-24.33-24.11c0-5.97,4.42-11.06,14.82-11.5c4.87-0.22,10.84,1.11,14.6,0.44v12.38l-4.42,1.33c0-8.63-4.2-9.29-8.85-9.29c-5.31-0.22-9.29,0.88-9.29,5.09c0,9.73,24.33,7.52,24.33,23.22c0,6.41-3.98,13.27-15.04,13.27c-6.63,0-11.94-1.11-15.92-0.88V66.07z M211.95,77.13c9.29,0,12.16-4.42,12.16-18.58c0-13.05-3.76-16.59-15.26-16.59c-8.85,0-13.27,1.55-13.27,18.8C195.36,71.6,199.79,77.13,211.95,77.13z M115.75,19.41h44.89V34l-4.42,1.33c-0.66-10.17-2.88-11.5-13.93-11.72c-6.86-0.22-10.39,1.33-10.39,8.4v16.14h8.4c5.75,0,6.63-3.76,6.63-8.4h4.42v21.01h-4.42c0-6.63-1.55-7.74-6.41-7.74h-8.63V64.3c0,11.5,1.77,14.15,9.29,13.93v3.76h-25.43v-3.76c4.64,0,8.18-2.43,8.18-7.96V32.9c0-6.86-1.33-9.73-8.18-9.73V19.41z M211.07,35.99c15.04,0,20.13,9.51,20.13,21.45c0,15.26-7.74,25.88-23.44,25.88c-13.49,0-20.13-8.4-20.13-22.12C187.85,44.62,196.47,35.99,211.07,35.99z M40.11,0.83c1.55-0.66,3.54-0.88,5.53-0.66c0.44,0,0.88,0.22,1.33,0.22c5.09,1.11,8.4,5.97,7.3,11.28l-3.98,20.13L40.11,0.83z M21.09,9.23c1.11-1.33,2.65-2.21,4.64-2.88c0.44-0.22,0.88-0.22,1.33-0.22c5.09-1.11,10.17,1.99,11.28,7.3l4.42,19.9L21.09,9.23z M6.94,24.72c0.44-1.55,1.55-3.1,3.1-4.42c0.44-0.44,0.66-0.66,1.11-0.88c4.2-3.1,10.17-2.21,13.27,1.99L36.8,37.76L6.94,24.72z M0.31,44.4c-0.22-1.77,0.22-3.54,1.11-5.31c0.22-0.44,0.44-0.66,0.66-1.11c2.65-4.64,8.4-6.19,12.83-3.54l17.91,9.95H0.31z M2.3,65.19c-0.88-1.55-1.33-3.32-1.33-5.31c0-0.44,0-0.88,0-1.33c0.44-5.31,5.09-9.07,10.39-8.63l20.35,1.99L2.3,65.19z M12.69,83.54c-1.33-0.88-2.43-2.43-3.32-4.42c-0.22-0.44-0.22-0.88-0.44-1.33c-1.55-4.87,1.11-10.39,5.97-11.94l19.46-6.63L12.69,83.54z M29.5,95.93c-1.55-0.44-3.32-1.33-4.87-2.65c-0.22-0.22-0.66-0.66-0.88-0.88c-3.54-3.76-3.32-9.95,0.66-13.49l15.04-13.93L29.5,95.93z M50.07,100.35c-1.55,0.44-3.54,0.22-5.53-0.44c-0.44-0.22-0.88-0.22-1.11-0.44c-4.87-1.99-7.08-7.74-4.87-12.38l8.18-18.8L50.07,100.35z M70.41,96.15c-1.33,0.88-3.1,1.55-5.31,1.77c-0.44,0-0.88,0-1.33,0c-5.31,0-9.51-4.2-9.51-9.51l-0.22-20.57L70.41,96.15z M87.44,83.98c-0.88,1.55-2.21,2.88-3.98,3.76c-0.44,0.22-0.66,0.44-1.11,0.44c-4.87,2.21-10.39,0-12.61-4.64l-8.63-18.58L87.44,83.98z M98.06,65.85c-0.22,1.77-0.88,3.54-2.21,5.09c-0.22,0.44-0.44,0.66-0.88,0.88c-3.54,3.98-9.51,4.2-13.49,0.88L65.99,59.22L98.06,65.85z M100.49,45.06c0.44,1.55,0.66,3.54,0,5.53c0,0.44-0.22,0.88-0.44,1.11c-1.55,5.09-6.86,7.74-11.94,6.19L68.42,51.7L100.49,45.06z M94.08,25.16c1.11,1.33,1.99,2.88,2.43,5.09c0,0.44,0.22,0.88,0.22,1.33c0.66,5.31-3.1,9.95-8.4,10.39L67.98,44.4L94.08,25.16z M80.14,9.68c1.55,0.66,3.1,1.77,4.2,3.54c0.22,0.44,0.44,0.66,0.66,1.11c2.65,4.42,1.11,10.39-3.32,13.05L64,37.76L80.14,9.68z M61.12,1.05c1.77,0,3.54,0.44,5.31,1.55c0.44,0.22,0.66,0.44,1.11,0.66c4.2,3.1,5.31,9.07,2.21,13.27L57.81,33.34L61.12,1.05z"
      />
    </Svg>
  );
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
          <FrostLogo width={98} color="rgba(255,255,255,0.86)" />
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
});
