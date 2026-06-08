import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import PlayerAvatar from '../../components/PlayerAvatar';
import { MOCK_ACCOUNT } from '../../lib/account';
import { SPURS_ROSTER } from '../../lib/roster';
import { colors } from '../../lib/theme';
import { OnboardingBackdropRevamp, SpursMark } from './OnboardingPrimitivesRevamp';

const COLUMNS = 2;
const MAX_VISIBLE_ROWS = 5;
const GAP = 10;
const HORIZONTAL_PADDING = 20;
const VERTICAL_CHROME = 178;
const SETUP_ACCENT = colors.teal;
const CTA_BG = '#f4f4f5';

export default function SetupRosterRevamp({
  favoriteIds,
  onFavoriteIdsChange,
  onDone,
}: {
  favoriteIds: string[];
  onFavoriteIdsChange: (ids: string[]) => void;
  onDone: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const rows = Math.ceil(SPURS_ROSTER.length / COLUMNS);
  const visibleRows = Math.max(1, Math.min(rows, MAX_VISIBLE_ROWS));
  const rosterHeight = Math.max(380, height - VERTICAL_CHROME);
  const cardHeight = Math.max(82, Math.floor((rosterHeight - GAP * (visibleRows - 1)) / visibleRows));
  const cardWidth = Math.floor((width - HORIZONTAL_PADDING * 2 - GAP) / COLUMNS);
  const selectedCount = favoriteIds.length;

  return (
    <View style={styles.root}>
      <OnboardingBackdropRevamp accent={SETUP_ACCENT} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brandMark}>
            <SpursMark size={30} />
          </View>
          <View style={styles.selectedPill}>
            <View style={styles.selectedDot} />
            <Text style={styles.selectedText}>{selectedCount} selected</Text>
          </View>
        </View>
        <View style={styles.accent} />
        <Text style={styles.title}>Pick your favorite players</Text>
      </View>

      <View style={[styles.rosterWindow, { height: rosterHeight }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.grid, { gap: GAP }]}>
          {SPURS_ROSTER.map((player) => {
            const active = favoriteIds.includes(player.id);
            return (
              <Pressable
                key={player.id}
                onPress={() =>
                  onFavoriteIdsChange(
                    active ? favoriteIds.filter((id) => id !== player.id) : [...favoriteIds, player.id],
                  )
                }
                style={({ pressed }) => [
                  styles.playerCard,
                  { width: cardWidth, height: cardHeight },
                  active && styles.playerCardActive,
                  pressed && styles.playerCardPressed,
                ]}
              >
                {active && <View style={styles.activeRail} />}
                <View style={styles.playerTop}>
                  <View style={styles.avatarWrap}>
                    <PlayerAvatar
                      firstName={player.firstName}
                      lastName={player.lastName}
                      reference={player.reference}
                      size="sm"
                      featured={active}
                    />
                    {active && (
                      <View style={styles.checkBadge}>
                        <View style={styles.checkDot} />
                      </View>
                    )}
                  </View>
                  <View style={[styles.numberPill, active && styles.numberPillActive]}>
                    <Text style={[styles.playerNumber, active && styles.playerNumberActive]}>
                      #{player.jerseyNumber}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {player.firstName[0]}. {player.lastName}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.playerMeta}>{player.position}</Text>
                    {active && <Text style={styles.trackingLabel}>TRACKING</Text>}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View pointerEvents="none" style={styles.footerScrim} />
      <Pressable style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]} onPress={onDone}>
        <Text style={styles.ctaText}>FINISH SETUP</Text>
        <Text style={styles.ctaMeta}>{selectedCount} players saved to your hub</Text>
      </Pressable>
    </View>
  );
}

export function defaultFavoriteIds() {
  return MOCK_ACCOUNT.favoritePlayers.map((player) => player.id);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 16,
  },
  header: { alignItems: 'flex-start', marginBottom: 12 },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8,9,11,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,178,169,0.3)',
    backgroundColor: 'rgba(0,178,169,0.11)',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  selectedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: SETUP_ACCENT },
  selectedText: { color: '#d7fffb', fontSize: 11, fontWeight: '900' },
  accent: { width: 46, height: 3, borderRadius: 999, backgroundColor: SETUP_ACCENT },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', lineHeight: 34, marginTop: 10 },
  rosterWindow: { minHeight: 0 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    paddingTop: 4,
    paddingBottom: 112,
  },
  playerCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(18,19,22,0.82)',
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  playerCardActive: {
    borderColor: 'rgba(0,178,169,0.5)',
    backgroundColor: 'rgba(0,178,169,0.13)',
  },
  playerCardPressed: { transform: [{ scale: 0.985 }], opacity: 0.92 },
  activeRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: SETUP_ACCENT,
  },
  playerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  avatarWrap: { position: 'relative' },
  checkBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SETUP_ACCENT,
    borderWidth: 2,
    borderColor: '#0b0c0f',
  },
  checkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#052f2d' },
  numberPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245,130,32,0.22)',
    backgroundColor: 'rgba(245,130,32,0.08)',
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  numberPillActive: {
    borderColor: 'rgba(0,178,169,0.34)',
    backgroundColor: 'rgba(0,178,169,0.12)',
  },
  playerNumber: { color: colors.orange, fontSize: 10, fontWeight: '900' },
  playerNumberActive: { color: SETUP_ACCENT },
  playerName: { color: colors.text, fontSize: 12, fontWeight: '900' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 3 },
  playerMeta: { color: colors.faint, fontSize: 10, fontWeight: '800' },
  trackingLabel: { color: SETUP_ACCENT, fontSize: 8, fontWeight: '900' },
  footerScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 136,
    backgroundColor: 'rgba(5,5,5,0.96)',
  },
  cta: {
    position: 'absolute',
    left: HORIZONTAL_PADDING,
    right: HORIZONTAL_PADDING,
    bottom: 8,
    borderRadius: 15,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: CTA_BG,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#ffffff',
    shadowOpacity: 0.24,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
  },
  ctaPressed: { transform: [{ scale: 0.99 }], opacity: 0.92 },
  ctaText: { color: '#050505', fontSize: 13, fontWeight: '900' },
  ctaMeta: { color: 'rgba(5,5,5,0.62)', fontSize: 10, fontWeight: '800', marginTop: 3 },
});
