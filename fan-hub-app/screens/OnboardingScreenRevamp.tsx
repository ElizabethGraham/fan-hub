import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { MOCK_ACCOUNT } from '../lib/account';
import { colors } from '../lib/theme';
import LocationHeroRevamp from './onboarding/LocationHeroRevamp';
import NotificationsHeroRevamp from './onboarding/NotificationsHeroRevamp';
import SetupRosterRevamp, { defaultFavoriteIds } from './onboarding/SetupRosterRevamp';
import { ONBOARDING_PAGES, type OnboardingPageId } from './onboarding/onboardingContent';
import WelcomeHeroRevamp from './onboarding/WelcomeHeroRevamp';

const PAGE_COPY: Record<OnboardingPageId, { title: string; body: string }> = {
  welcome: {
    title: 'Your Game Day Hub',
    body: 'Live game state, wallet passes, alerts, and Spurs moments in one place.',
  },
  notifications: {
    title: 'Never Miss a Moment',
    body: 'Lineups, close games, player runs, and rewards arrive with game context.',
  },
  location: {
    title: 'Find Your Way In',
    body: 'Parking, mobile entry, and arena timing stay attached to your game pass.',
  },
  setup: {
    title: 'Pick your favorite players',
    body: '',
  },
};

export default function OnboardingScreenRevamp({
  onDone,
  startPage = 0,
}: {
  onDone: (setup?: OnboardingSetup) => void;
  startPage?: number;
}) {
  const [index, setIndex] = useState(startPage);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(defaultFavoriteIds());
  const copyAnim = useRef(new Animated.Value(1)).current;
  const page = ONBOARDING_PAGES[index];
  const isLast = index === ONBOARDING_PAGES.length - 1;
  const copy = PAGE_COPY[page.id];

  useEffect(() => {
    copyAnim.setValue(0);
    Animated.timing(copyAnim, { toValue: 1, duration: 340, useNativeDriver: true }).start();
  }, [copyAnim, index]);

  function finish() {
    onDone({
      favoritePlayerIds: favoriteIds,
      alertIds: MOCK_ACCOUNT.alerts.filter((alert) => alert.enabled).map((alert) => alert.id),
    });
  }

  function advance() {
    if (isLast) finish();
    else setIndex(index + 1);
  }

  if (page.id === 'setup') {
    return (
      <SetupRosterRevamp
        favoriteIds={favoriteIds}
        onFavoriteIdsChange={setFavoriteIds}
        onDone={finish}
      />
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <HeroSceneRevamp key={page.id} id={page.id} color={page.accentColor} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: copyAnim,
            transform: [
              { translateY: copyAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
            ],
          },
        ]}
      >
        <View style={styles.copyBlock}>
          <View style={[styles.accentBar, { backgroundColor: page.accentColor }]} />
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.body}>{copy.body}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {ONBOARDING_PAGES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index && { width: 24, backgroundColor: page.accentColor }]}
              />
            ))}
          </View>

          <Pressable style={[styles.cta, { backgroundColor: page.accentColor }]} onPress={advance}>
            <Text style={styles.ctaText}>{page.cta.toUpperCase()}</Text>
          </Pressable>

          {page.skip && (
            <Pressable onPress={advance} style={styles.skip}>
              <Text style={styles.skipText}>{page.skip}</Text>
            </Pressable>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

function HeroSceneRevamp({ id, color }: { id: OnboardingPageId; color: string }) {
  if (id === 'welcome') return <WelcomeHeroRevamp color={color} />;
  if (id === 'notifications') return <NotificationsHeroRevamp color={color} />;
  return <LocationHeroRevamp color={color} />;
}

type OnboardingSetup = {
  favoritePlayerIds: string[];
  alertIds: string[];
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050505' },
  hero: {
    flex: 64,
    overflow: 'hidden',
    backgroundColor: '#050505',
  },
  content: {
    flex: 36,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 14,
    justifyContent: 'space-between',
    backgroundColor: '#050505',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  copyBlock: { gap: 8 },
  accentBar: { width: 44, height: 3, borderRadius: 999 },
  title: { color: '#fff', fontSize: 34, fontWeight: '900', lineHeight: 39 },
  body: { color: 'rgba(255,255,255,0.62)', fontSize: 14, lineHeight: 21, fontWeight: '700' },
  footer: { gap: 10 },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 2 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#3f3f46' },
  cta: {
    borderRadius: 13,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  skip: { alignItems: 'center', paddingVertical: 6 },
  skipText: { color: colors.faint, fontSize: 13, fontWeight: '700' },
});
