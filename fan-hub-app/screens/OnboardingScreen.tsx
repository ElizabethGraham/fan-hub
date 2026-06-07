import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LocationHero from './onboarding/LocationHero';
import NotificationsHero from './onboarding/NotificationsHero';
import { ONBOARDING_PAGES, type OnboardingPageId } from './onboarding/onboardingContent';
import WelcomeHero from './onboarding/WelcomeHero';

export default function OnboardingScreen({
  onDone,
  startPage = 0,
}: {
  onDone: () => void;
  startPage?: number;
}) {
  const [index, setIndex] = useState(startPage);
  const page = ONBOARDING_PAGES[index];
  const isLast = index === ONBOARDING_PAGES.length - 1;

  function advance() {
    if (isLast) onDone();
    else setIndex(index + 1);
  }

  const accentBg = `${page.accentColor}10`;

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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050505' },
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
  textGroup: { gap: 8 },
  btnGroup: { gap: 2 },
  accentBar: { height: 3, width: 44, borderRadius: 2, marginBottom: 2 },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -0.5, lineHeight: 36 },
  body: { color: '#a1a1aa', fontSize: 14, lineHeight: 21 },
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
