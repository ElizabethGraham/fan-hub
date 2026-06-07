import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shared } from '../lib/theme';

const DOTS = [
  { key: 'red',   label: 'Red',   color: '#ef4444' },
  { key: 'green', label: 'Green', color: '#22c55e' },
  { key: 'blue',  label: 'Blue',  color: '#3b82f6' },
] as const;

type Dot = (typeof DOTS)[number]['key'];
type Phase = 'pick' | 'locked' | 'countdown' | 'racing' | 'result';
type MockOutcome = 'random' | 'win' | 'loss';
type SaveState = 'idle' | 'busy' | 'done';

const RACE_MS = 8000;

function pickWinner(): Dot { return DOTS[Math.floor(Math.random() * DOTS.length)].key; }
function losingDotFor(pick: Dot): Dot { return DOTS.find((d) => d.key !== pick)?.key ?? 'red'; }

function progressFor(dot: Dot, elapsed: number, winner: Dot): number {
  const t = Math.min(elapsed / RACE_MS, 1);
  const idx = DOTS.findIndex((e) => e.key === dot);
  const wave = Math.sin(t * Math.PI * 4.8 + idx * 1.7) * 7 + Math.sin(t * Math.PI * 9.2 + idx * 0.9) * 3.5;
  const earlyLaneBias = [2.5, 8, 4][idx] * (1 - t);
  const fadeOthers = dot === winner ? 0 : Math.max(0, t - 0.78) * 18;
  const base = t * 86;
  if (t >= 1) return dot === winner ? 100 : 88 + idx * 2;
  if (dot !== winner) return Math.max(3, Math.min(96, base + wave + earlyLaneBias - fadeOthers));
  const ss = 0.72;
  if (t < ss) return Math.max(3, Math.min(84, base + wave + earlyLaneBias));
  const sb = ss * 86;
  const sw = Math.sin(ss * Math.PI * 4.8 + idx * 1.7) * 7 + Math.sin(ss * Math.PI * 9.2 + idx * 0.9) * 3.5;
  const posAtSprint = Math.max(3, Math.min(84, sb + sw + [2.5, 8, 4][idx] * (1 - ss)));
  const kt = (t - ss) / (1 - ss);
  return posAtSprint + kt * kt * (3 - 2 * kt) * (100 - posAtSprint);
}

export default function DotRaces({ forcedOutcome = 'random' }: { forcedOutcome?: MockOutcome }) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [pick, setPick] = useState<Dot | null>(null);
  const [winner, setWinner] = useState<Dot | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  // Single confetti value — drives everything with gravity-arc keyframes
  const confetti = useRef(new Animated.Value(0)).current;

  // Save button morph (needs useNativeDriver: false for width animation)
  const morphProg = useRef(new Animated.Value(0)).current;

  const values = useMemo(
    () => DOTS.reduce((acc, d) => ({ ...acc, [d.key]: new Animated.Value(0.04) }), {} as Record<Dot, Animated.Value>),
    [],
  );
  const winnerRef = useRef<Dot | null>(null);

  // ── Save button ──────────────────────────────────────────────────────────
  const btnW      = morphProg.interpolate({ inputRange: [0, 1, 2], outputRange: [80, 44, 80] });
  const saveOpa   = morphProg.interpolate({ inputRange: [0, 0.45, 1, 2], outputRange: [1, 0, 0, 0], extrapolate: 'clamp' });
  const thumbOpa  = morphProg.interpolate({ inputRange: [0.65, 1, 1.5, 1.8], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' });
  const savedOpa  = morphProg.interpolate({ inputRange: [1.5, 2], outputRange: [0, 1], extrapolate: 'clamp' });

  function handleSave() {
    if (saveState !== 'idle') return;
    setSaveState('busy');
    Animated.sequence([
      Animated.timing(morphProg, { toValue: 1, duration: 280, useNativeDriver: false, easing: Easing.inOut(Easing.quad) }),
      Animated.delay(660),
      Animated.timing(morphProg, { toValue: 2, duration: 280, useNativeDriver: false, easing: Easing.inOut(Easing.quad) }),
    ]).start(() => setSaveState('done'));
  }

  function reset() {
    DOTS.forEach((d) => values[d.key].setValue(0.04));
    winnerRef.current = null;
    setPick(null); setWinner(null);
    setSaveState('idle');
    morphProg.setValue(0);
    confetti.setValue(0);
    setCountdown(3); setPhase('pick');
  }

  function lockIn(chosen: Dot) {
    if (phase !== 'pick') return;
    const next = forcedOutcome === 'win' ? chosen : forcedOutcome === 'loss' ? losingDotFor(chosen) : pickWinner();
    winnerRef.current = next;
    DOTS.forEach((d) => values[d.key].setValue(0.04));
    setPick(chosen); setWinner(next); setPhase('locked');
  }

  useEffect(() => {
    if (phase !== 'locked') return;
    const t = setTimeout(() => { setCountdown(3); setPhase('countdown'); }, 1200);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'countdown') return;
    const t1 = setTimeout(() => setCountdown(2), 800);
    const t2 = setTimeout(() => setCountdown(1), 1600);
    const t3 = setTimeout(() => setPhase('racing'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'racing' || !winnerRef.current) return;
    const started = Date.now(); let frame = 0;
    const tick = () => {
      const rw = winnerRef.current; if (!rw) return;
      const elapsed = Date.now() - started;
      DOTS.forEach((d) => values[d.key].setValue(progressFor(d.key, elapsed, rw) / 100));
      if (elapsed >= RACE_MS) {
        setPhase('result');
        if (pick === rw) {
          confetti.setValue(0);
          Animated.timing(confetti, { toValue: 1, duration: 1100, useNativeDriver: true }).start();
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, values]);

  const correct = phase === 'result' && pick === winner;

  return (
    <View style={shared.panel}>
      <View style={styles.header}>
        <View>
          <Text style={shared.eyebrow}>Fan Zone</Text>
          <Text style={styles.title}>Valero Dot Race</Text>
        </View>
        {phase === 'result' ? (
          <Pressable onPress={reset} style={styles.reset}><Text style={styles.resetText}>Race again</Text></Pressable>
        ) : phase === 'pick' ? (
          <View style={styles.pickOne}><Text style={styles.pickOneText}>Pick one</Text></View>
        ) : null}
      </View>

      <View style={styles.tracks}>
        <ConfettiBurst value={confetti} />
        {DOTS.map((dot) => (
          <View key={dot.key} style={styles.trackRow}>
            <View style={styles.rowHeader}>
              <View style={[styles.smallDot, { backgroundColor: dot.color }]} />
              <Text style={styles.dotLabel}>{dot.label}</Text>
              {pick === dot.key && <Text style={styles.yourPick}>Your pick</Text>}
            </View>
            <View style={styles.track}>
              <Animated.View style={[styles.fill, { backgroundColor: dot.color, width: values[dot.key].interpolate({ inputRange: [0,1], outputRange: ['4%','100%'] }) }]} />
              <Animated.View style={[styles.racerWrap, { left: values[dot.key].interpolate({ inputRange: [0,1], outputRange: ['4%','96%'] }) }]}>
                <View style={[styles.racer, { borderColor: dot.color }]}>
                  <View style={[styles.racerCore, { backgroundColor: dot.color }]} />
                </View>
              </Animated.View>
              <FinishLine />
            </View>
          </View>
        ))}
      </View>

      {phase === 'pick' && (
        <View style={styles.buttons}>
          {DOTS.map((dot) => (
            <Pressable key={dot.key} onPress={() => lockIn(dot.key)} style={[styles.pick, { borderColor: dot.color }]}>
              <View style={[styles.buttonDot, { backgroundColor: dot.color }]} />
              <Text style={[styles.pickText, { color: dot.color }]}>{dot.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {phase === 'locked' && pick && (
        <View style={styles.message}>
          <Text style={styles.messageTitle}>{"You're locked in."}</Text>
          <Text style={styles.messageText}>The Valero Dot Race segment is queued.</Text>
        </View>
      )}

      {phase === 'countdown' && (
        <View style={styles.countdown}>
          <Text style={styles.messageText}>Starting in</Text>
          <Text style={styles.countNumber}>{countdown}</Text>
        </View>
      )}

      {phase === 'racing' && pick && (
        <View style={styles.message}>
          <Text style={styles.messageText}>Your pick: {DOTS.find((d) => d.key === pick)?.label}</Text>
        </View>
      )}

      {phase === 'result' && winner && pick && (
        <View style={[styles.result, correct && styles.correctResult]}>
          <Text style={styles.resultTitle}>{DOTS.find((d) => d.key === winner)?.label} wins the race.</Text>
          <Text style={styles.messageText}>
            {correct
              ? 'Good pick. Your Fan Shop reward is ready.'
              : `${DOTS.find((d) => d.key === pick)?.label} had a run, but ${DOTS.find((d) => d.key === winner)?.label} closed it out.`}
          </Text>
          {correct && (
            <View style={styles.coupon}>
              <View>
                <Text style={styles.couponLabel}>Fan Shop code</Text>
                <Text style={styles.couponCode}>DOTRACE5</Text>
              </View>

              {/* Morphing save button */}
              <Pressable onPress={handleSave} disabled={saveState !== 'idle'}>
                <Animated.View style={[
                  styles.saveCoupon,
                  saveState === 'done' && styles.saveCouponDone,
                  { width: btnW },
                ]}>
                  <Animated.Text style={[styles.saveCouponText, { opacity: saveOpa }]}>Save</Animated.Text>
                  <Animated.Text style={[styles.saveCouponText, styles.thumbText, { opacity: thumbOpa }]}>👍</Animated.Text>
                  <Animated.Text style={[styles.saveCouponText, { opacity: savedOpa }]}>✓ Saved</Animated.Text>
                </Animated.View>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ── Finish line ──────────────────────────────────────────────────────────────
function FinishLine() {
  const COL_W = 7, ROW_H = 6;
  const rows = Math.ceil(42 / ROW_H);
  const cells = Array.from({ length: rows }, (_, r) =>
    [0, 1].map(c => ({ r, c, light: (r + c) % 2 === 0 }))
  ).flat();
  return (
    <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: COL_W * 2 }}>
      {cells.map(({ r, c, light }) => (
        <View
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            left: c * COL_W,
            top: r * ROW_H,
            width: COL_W,
            height: ROW_H,
            backgroundColor: light ? 'rgba(255,255,255,0.72)' : 'rgba(5,5,8,0.52)',
          }}
        />
      ))}
    </View>
  );
}

// ── Confetti ─────────────────────────────────────────────────────────────────
// Single animated value 0→1 drives everything.
// Each piece: burst to peak at t=0.55, then gravity-arc continues:
//   X continues outward (× 1.25), Y falls further (+60 gravity).
// Opacity: appears, holds through burst, fades during gravity arc.
// This ensures pieces are ALWAYS moving — no freeze at the end.
function ConfettiBurst({ value }: { value: Animated.Value }) {
  const pieces = [
    { x: -145, y: -48,  rot: -110, color: colors.teal,   w: 11, h: 7  },
    { x: -118, y: -88,  rot:  60,  color: colors.pink,   w: 7,  h: 13 },
    { x: -88,  y: -60,  rot: -40,  color: colors.orange, w: 13, h: 5  },
    { x: -62,  y: -108, rot:  140, color: '#fff',         w: 6,  h: 11 },
    { x: -32,  y: -78,  rot: -80,  color: colors.teal,   w: 10, h: 8  },
    { x: -8,   y: -118, rot:  30,  color: colors.pink,   w: 8,  h: 12 },
    { x: 22,   y: -85,  rot: -130, color: colors.orange, w: 12, h: 5  },
    { x: 48,   y: -112, rot:  90,  color: '#fff',         w: 5,  h: 10 },
    { x: 75,   y: -72,  rot: -50,  color: colors.teal,   w: 10, h: 13 },
    { x: 102,  y: -95,  rot:  160, color: colors.pink,   w: 7,  h: 7  },
    { x: 128,  y: -55,  rot: -100, color: colors.orange, w: 13, h: 5  },
    { x: 150,  y: -82,  rot:  40,  color: colors.teal,   w: 6,  h: 11 },
    { x: -168, y: -28,  rot:  120, color: colors.pink,   w: 7,  h: 9  },
    { x: -152, y: -72,  rot: -70,  color: colors.pink,   w: 11, h: 5  },
    { x:  162, y: -38,  rot:  80,  color: colors.teal,   w: 7,  h: 9  },
    { x:  148, y: -90,  rot: -120, color: colors.orange, w: 5,  h: 11 },
    { x: -85,  y:  32,  rot:  50,  color: colors.orange, w: 8,  h: 7  },
    { x: -35,  y:  44,  rot: -90,  color: '#fff',         w: 6,  h: 9  },
    { x:  18,  y:  48,  rot:  110, color: colors.teal,   w: 9,  h: 5  },
    { x:  72,  y:  36,  rot: -60,  color: colors.pink,   w: 7,  h: 8  },
    { x: -120, y: -125, rot:  20,  color: colors.orange, w: 5,  h: 7  },
    { x:  115, y: -120, rot: -30,  color: colors.teal,   w: 7,  h: 5  },
    { x:   0,  y: -138, rot:  100, color: colors.pink,   w: 9,  h: 4  },
    { x:  -58, y:  55,  rot: -140, color: colors.orange, w: 5,  h: 9  },
  ];

  return (
    <View pointerEvents="none" style={styles.confettiLayer}>
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            width: p.w,
            height: p.h,
            borderRadius: 2,
            backgroundColor: p.color,
            opacity: value.interpolate({
              inputRange:  [0,    0.04, 0.5,  1  ],
              outputRange: [0,    1,    0.95, 0  ],
            }),
            transform: [
              // X: shoot to peak, continue outward with momentum
              { translateX: value.interpolate({
                  inputRange:  [0, 0.55, 1],
                  outputRange: [0, p.x,  p.x * 1.25],
              })},
              // Y: shoot to peak, then gravity arc pulls down
              { translateY: value.interpolate({
                  inputRange:  [0, 0.55, 1],
                  outputRange: [0, p.y,  p.y + 60],
              })},
              // Rotation: continuous throughout — always spinning
              { rotate: value.interpolate({
                  inputRange:  [0, 1],
                  outputRange: ['0deg', `${p.rot}deg`],
              })},
              // Scale: burst big, settle, then shrink while falling
              { scale: value.interpolate({
                  inputRange:  [0,    0.18, 0.55, 1  ],
                  outputRange: [0,    1.3,  1,    0.55],
              })},
            ],
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  title: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 5 },
  reset: { minHeight: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#3f3f46', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  resetText: { color: colors.muted, fontSize: 12, lineHeight: 14, fontWeight: '800', textAlign: 'center' },
  pickOne: { borderWidth: 1, borderColor: '#3f3f46', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  pickOneText: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  tracks: { gap: 12, marginTop: 18 },
  confettiLayer: { position: 'absolute', left: 0, right: 0, top: 40, alignItems: 'center', zIndex: 5 },
  trackRow: { gap: 6 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallDot: { width: 10, height: 10, borderRadius: 5 },
  dotLabel: { color: colors.text, fontSize: 12, fontWeight: '900' },
  yourPick: { color: colors.teal, fontSize: 9, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  track: { height: 38, borderRadius: 999, overflow: 'hidden', backgroundColor: colors.panelSoft, borderWidth: 1, borderColor: colors.border },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, opacity: 0.18 },
  racerWrap: { position: 'absolute', top: 5, bottom: 5, width: 28, marginLeft: -14, alignItems: 'center', justifyContent: 'center' },
  racer: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  racerCore: { width: 14, height: 14, borderRadius: 7 },
  buttons: { flexDirection: 'row', gap: 8, marginTop: 18 },
  pick: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 11, alignItems: 'center', backgroundColor: colors.panelSoft, gap: 5 },
  buttonDot: { width: 11, height: 11, borderRadius: 6 },
  pickText: { fontSize: 12, fontWeight: '900' },
  message: { marginTop: 16, borderWidth: 1, borderColor: 'rgba(0,178,169,0.28)', backgroundColor: 'rgba(0,178,169,0.06)', borderRadius: 12, padding: 12, alignItems: 'center' },
  messageTitle: { color: colors.teal, fontSize: 12, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  messageText: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 3, textAlign: 'center' },
  countdown: { alignItems: 'center', marginTop: 16 },
  countNumber: { color: colors.text, fontSize: 48, fontWeight: '900' },
  result: { marginTop: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panelSoft, borderRadius: 12, padding: 12 },
  correctResult: { borderColor: 'rgba(16,185,129,0.45)', backgroundColor: 'rgba(6,78,59,0.28)' },
  resultTitle: { color: colors.text, fontSize: 14, fontWeight: '900' },
  coupon: { marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245,130,32,0.34)', backgroundColor: 'rgba(245,130,32,0.1)', padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  couponLabel: { color: colors.orange, fontSize: 9, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
  couponCode: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 2 },
  // Save button — width is animated; all three text states sit at center, absolute
  saveCoupon: {
    borderRadius: 999,
    backgroundColor: colors.orange,
    height: 36,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCouponDone: { backgroundColor: '#166834' },
  saveCouponText: { position: 'absolute', color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center' },
  thumbText: { fontSize: 18, letterSpacing: 0 },
});
