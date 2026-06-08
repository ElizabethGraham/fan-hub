import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import PlayerAvatar from '../components/PlayerAvatar';
import { SPURS_ROSTER } from '../lib/roster';
import { MOCK_ACCOUNT } from '../lib/account';
import { colors } from '../lib/theme';
import LocationHero from './onboarding/LocationHero';
import NotificationsHero from './onboarding/NotificationsHero';
import { ONBOARDING_PAGES, type OnboardingPageId } from './onboarding/onboardingContent';
import WelcomeHero from './onboarding/WelcomeHero';

const SETUP_COLUMNS = 2;
const SETUP_MAX_VISIBLE_ROWS = 5;
const SETUP_GRID_GAP = 10;
const SETUP_VERTICAL_CHROME = 166;

export default function OnboardingScreen({
  onDone,
  startPage = 0,
}: {
  onDone: (setup?: OnboardingSetup) => void;
  startPage?: number;
}) {
  const { height } = useWindowDimensions();
  const [index, setIndex] = useState(startPage);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(
    MOCK_ACCOUNT.favoritePlayers.map((player) => player.id),
  );
  const page = ONBOARDING_PAGES[index];
  const isLast = index === ONBOARDING_PAGES.length - 1;
  const setupRowCount = Math.ceil(SPURS_ROSTER.length / SETUP_COLUMNS);
  const setupVisibleRows = Math.max(1, Math.min(setupRowCount, SETUP_MAX_VISIBLE_ROWS));
  const setupRosterHeight = Math.max(380, height - SETUP_VERTICAL_CHROME);
  const setupCardHeight = Math.max(
    82,
    Math.floor((setupRosterHeight - SETUP_GRID_GAP * (setupVisibleRows - 1)) / setupVisibleRows),
  );

  function advance() {
    if (isLast) {
      onDone({
        favoritePlayerIds: favoriteIds,
        alertIds: MOCK_ACCOUNT.alerts.filter((alert) => alert.enabled).map((alert) => alert.id),
      });
    }
    else setIndex(index + 1);
  }

  const accentBg = `${page.accentColor}10`;

  if (page.id === 'setup') {
    return (
      <View style={styles.rootSetup}>
        <View style={styles.setupHeader}>
          <View style={[styles.accentBar, { backgroundColor: colors.teal }]} />
          <Text style={styles.setupPageTitle}>Pick your favorite players</Text>
        </View>

        <View style={[styles.setupRoster, { height: setupRosterHeight }]}>
          <ScrollView
            style={styles.setupScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.playerScroll, { gap: SETUP_GRID_GAP }]}
          >
            <SetupControls
              cardHeight={setupCardHeight}
              favoriteIds={favoriteIds}
              onFavoriteIdsChange={(ids) => {
                setFavoriteIds(ids);
              }}
            />
          </ScrollView>
        </View>

        <Pressable style={styles.setupCta} onPress={advance}>
          <Text style={styles.ctaText}>FINISH SETUP</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <HeroScene id={page.id} color={page.accentColor} />
      </View>

      <View style={[styles.content, { backgroundColor: accentBg }]}>
        <View style={styles.textGroup}>
          <View style={[styles.accentBar, { backgroundColor: page.accentColor }]} />
          <Text style={styles.title}>{page.title}</Text>
          <Text style={styles.body}>{page.body}</Text>
        </View>

        <View style={styles.btnGroup}>
          <Pressable style={[styles.cta, { backgroundColor: page.accentColor }]} onPress={advance}>
            <Text style={styles.ctaText}>{isLast ? "LET'S GO SPURS" : page.cta.toUpperCase()}</Text>
          </Pressable>
          {page.skip && !isLast && (
            <Pressable onPress={advance} style={styles.skipBtn}>
              <Text style={styles.skipText}>{page.skip}</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={[styles.dots, { backgroundColor: accentBg }]}>
        {ONBOARDING_PAGES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index && { width: 22, backgroundColor: page.accentColor }]}
          />
        ))}
      </View>
    </View>
  );
}

function HeroScene({ id, color }: { id: OnboardingPageId; color: string }) {
  if (id === 'welcome') return <WelcomeHero color={color} />;
  if (id === 'notifications') return <NotificationsHero color={color} />;
  return <LocationHero color={color} />;
}

type OnboardingSetup = {
  favoritePlayerIds: string[];
  alertIds: string[];
};

function SetupControls({
  cardHeight,
  favoriteIds,
  onFavoriteIdsChange,
}: {
  cardHeight: number;
  favoriteIds: string[];
  onFavoriteIdsChange: (ids: string[]) => void;
}) {
  return (
    <View style={styles.playerGrid}>
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
            style={[styles.playerCard, { height: cardHeight }, active && styles.playerCardActive]}
          >
            <View style={styles.playerTop}>
              <PlayerAvatar
                firstName={player.firstName}
                lastName={player.lastName}
                reference={player.reference}
                size="sm"
                featured={active}
              />
              <Text style={styles.playerJersey}>#{player.jerseyNumber}</Text>
            </View>
            <Text style={styles.playerName} numberOfLines={1}>
              {player.firstName[0]}. {player.lastName}
            </Text>
            <Text style={styles.playerMeta}>{player.position}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050505' },
  rootSetup: {
    flex: 1,
    backgroundColor: '#050505',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 0,
  },
  hero: {
    flex: 62,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#080c10',
  },
  content: {
    flex: 38,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  setupHeader: { alignItems: 'flex-start', marginBottom: 12 },
  setupPageTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 33,
    marginTop: 8,
  },
  setupRoster: { minHeight: 0 },
  setupScroll: { flex: 1 },
  textGroup: { gap: 8 },
  btnGroup: { gap: 2 },
  accentBar: { height: 3, width: 44, borderRadius: 2, marginBottom: 2 },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -0.5, lineHeight: 36 },
  setupTitle: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -0.5, lineHeight: 36 },
  body: { color: '#a1a1aa', fontSize: 14, lineHeight: 21 },
  playerScroll: { paddingBottom: 112 },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SETUP_GRID_GAP,
    alignContent: 'flex-start',
    paddingTop: 4,
  },
  playerCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#18181b',
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 4,
    justifyContent: 'space-between',
  },
  playerCardActive: { borderColor: 'rgba(0,178,169,0.48)', backgroundColor: 'rgba(0,178,169,0.12)' },
  playerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  playerJersey: { color: colors.orange, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  playerName: { color: colors.text, fontSize: 12, fontWeight: '900' },
  playerMeta: { color: colors.faint, fontSize: 10, fontWeight: '800' },
  setupCta: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 18,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.teal,
    zIndex: 10,
    elevation: 10,
  },
  cta: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1.3 },
  skipBtn: { alignItems: 'center', paddingVertical: 10 },
  skipText: { color: '#52525b', fontSize: 13 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#27272a' },
});
