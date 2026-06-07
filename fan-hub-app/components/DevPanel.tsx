import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../lib/theme';

export type NavDest =
  | 'splash'
  | 'onboarding-0'
  | 'onboarding-1'
  | 'onboarding-2'
  | 'home'
  | 'news'
  | 'schedule'
  | 'shop'
  | 'profile'
  | 'game';

export type DotRaceOutcome = 'random' | 'win' | 'loss';

interface Props {
  visible: boolean;
  onClose: () => void;
  onNavigate: (dest: NavDest) => void;
  dotRaceOutcome: DotRaceOutcome;
  onDotRaceOutcome: (o: DotRaceOutcome) => void;
  simulateError: boolean;
  onSimulateError: (v: boolean) => void;
  currentRoute: string;
  currentPhase: string;
}

export default function DevPanel({
  visible,
  onClose,
  onNavigate,
  dotRaceOutcome,
  onDotRaceOutcome,
  simulateError,
  onSimulateError,
  currentRoute,
  currentPhase,
}: Props) {
  const insets = useSafeAreaInsets();

  function nav(dest: NavDest) {
    onClose();
    // slight delay so the modal closes before navigation kicks in
    setTimeout(() => onNavigate(dest), 120);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header row */}
        <View style={styles.sheetHeader}>
          <View style={styles.sheetTitleRow}>
            <Text style={styles.sheetTitle}>DEV TOOLS</Text>
            <View style={styles.contextPill}>
              <Text style={styles.contextText}>{currentPhase} · {currentRoute}</Text>
            </View>
          </View>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── Navigate to ───────────────────────────────── */}
          <SectionHeader label="Navigate To" />
          <View style={styles.chipGrid}>
            {NAV_ITEMS.map(({ label, dest, accent }) => (
              <Pressable
                key={dest}
                style={[styles.chip, accent ? { borderColor: `${accent}55`, backgroundColor: `${accent}12` } : null]}
                onPress={() => nav(dest)}
              >
                <Text style={[styles.chipText, accent ? { color: accent } : null]}>{label}</Text>
              </Pressable>
            ))}
          </View>

          {/* ── Dot Race outcome ──────────────────────────── */}
          <SectionHeader label="Dot Race Outcome" note="applies to next race" />
          <View style={styles.toggleRow}>
            {OUTCOME_OPTIONS.map(({ value, label }) => (
              <Pressable
                key={value}
                style={[styles.toggleChip, dotRaceOutcome === value && styles.toggleChipActive]}
                onPress={() => onDotRaceOutcome(value)}
              >
                {dotRaceOutcome === value && <View style={styles.toggleDot} />}
                <Text style={[styles.toggleText, dotRaceOutcome === value && styles.toggleTextActive]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* ── App state ─────────────────────────────────── */}
          <SectionHeader label="App State" />
          <View style={styles.actionList}>
            <Pressable style={styles.actionRow} onPress={() => nav('onboarding-0')}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>↺</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionLabel}>Restart Onboarding</Text>
                <Text style={styles.actionSub}>Re-run the first-launch setup flow from page 1</Text>
              </View>
            </Pressable>

            <Pressable
              style={[styles.actionRow, simulateError && styles.actionRowActive]}
              onPress={() => onSimulateError(!simulateError)}
            >
              <View style={[styles.actionIcon, simulateError && styles.actionIconActive]}>
                <Text style={styles.actionIconText}>!</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionLabel, simulateError && { color: colors.orange }]}>
                  Simulate API Error{simulateError ? ' — ON' : ''}
                </Text>
                <Text style={styles.actionSub}>Show error state on data-loading screens</Text>
              </View>
              <View style={[styles.toggle, simulateError && styles.toggleOn]}>
                <View style={[styles.toggleThumb, simulateError && styles.toggleThumbOn]} />
              </View>
            </Pressable>
          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}

function SectionHeader({ label, note }: { label: string; note?: string }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionHeader}>{label}</Text>
      {note && <Text style={styles.sectionNote}>{note}</Text>}
    </View>
  );
}

const NAV_ITEMS: { label: string; dest: NavDest; accent?: string }[] = [
  { label: 'Splash', dest: 'splash', accent: colors.teal },
  { label: 'Onboard ①', dest: 'onboarding-0', accent: colors.teal },
  { label: 'Onboard ②', dest: 'onboarding-1', accent: colors.orange },
  { label: 'Onboard ③', dest: 'onboarding-2', accent: colors.pink },
  { label: 'Home', dest: 'home' },
  { label: 'News', dest: 'news' },
  { label: 'Schedule', dest: 'schedule' },
  { label: 'Shop', dest: 'shop' },
  { label: 'Profile', dest: 'profile' },
  { label: 'Game Detail', dest: 'game' },
];

const OUTCOME_OPTIONS: { value: DotRaceOutcome; label: string }[] = [
  { value: 'random', label: 'Random' },
  { value: 'win', label: 'Force Win' },
  { value: 'loss', label: 'Force Loss' },
];

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0f0f0f',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.12)',
    maxHeight: '82%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3f3f46',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196,206,212,0.08)',
  },
  sheetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sheetTitle: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  contextPill: {
    backgroundColor: 'rgba(245,130,32,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(245,130,32,0.3)',
  },
  contextText: { color: colors.orange, fontSize: 10, fontWeight: '700', fontVariant: ['tabular-nums'] },
  closeBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#71717a', fontSize: 22, lineHeight: 24 },

  scrollContent: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 16, gap: 6 },

  // Section headers
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 16, marginBottom: 8 },
  sectionHeader: { color: colors.orange, fontSize: 9, fontWeight: '900', letterSpacing: 1.8, textTransform: 'uppercase' },
  sectionNote: { color: '#52525b', fontSize: 9, fontStyle: 'italic' },

  // Nav chips grid
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.18)',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { color: '#c4ced4', fontSize: 12, fontWeight: '700' },

  // Dot race toggle
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#141414',
    paddingVertical: 10,
  },
  toggleChipActive: {
    borderColor: 'rgba(0,178,169,0.5)',
    backgroundColor: 'rgba(0,178,169,0.1)',
  },
  toggleDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.teal },
  toggleText: { color: '#71717a', fontSize: 12, fontWeight: '700' },
  toggleTextActive: { color: colors.teal },

  // Action list
  actionList: { gap: 2 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#141414',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    padding: 12,
  },
  actionRowActive: {
    borderColor: 'rgba(245,130,32,0.3)',
    backgroundColor: 'rgba(245,130,32,0.06)',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconActive: { backgroundColor: 'rgba(245,130,32,0.2)' },
  actionIconText: { color: '#c4ced4', fontSize: 15, fontWeight: '900' },
  actionContent: { flex: 1, gap: 2 },
  actionLabel: { color: '#e4e4e7', fontSize: 13, fontWeight: '700' },
  actionSub: { color: '#52525b', fontSize: 11, lineHeight: 15 },

  // iOS-style toggle switch
  toggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: { backgroundColor: colors.orange },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleThumbOn: { transform: [{ translateX: 16 }] },
});
