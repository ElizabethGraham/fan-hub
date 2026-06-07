import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DevPanel, { type DotRaceOutcome, type NavDest } from './components/DevPanel';
import FanShop from './components/FanShop';
import Layout, { type TabName } from './components/Layout';
import Onboarding from './components/Onboarding';
import ProfileScreen from './components/ProfileScreen';
import SplashScreen from './components/SplashScreen';
import { getGameDetailPageData, type GameDetailPageData } from './lib/gameDetailData';
import { getHomePageData, type HomePageData } from './lib/homePageData';
import { colors, shared } from './lib/theme';
import GameScreen from './screens/GameScreen';
import HomeScreen from './screens/HomeScreen';
import NewsScreen from './screens/NewsScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import type { GameDisplay } from './lib/types';

type Phase = 'splash' | 'onboarding' | 'main';
const SHOW_DEV_TOOLS = __DEV__ || process.env.EXPO_PUBLIC_MOCK_API === '1';

type Route =
  | { name: 'home' }
  | { name: 'game'; id: string }
  | { name: 'shop'; itemId?: string; gameId?: string }
  | { name: 'profile' }
  | { name: 'news' }
  | { name: 'schedule' };

export default function App() {
  const [phase, setPhase] = useState<Phase>('splash');
  const [splashDest, setSplashDest] = useState<'onboarding' | 'main'>('onboarding');
  const [onboardingStart, setOnboardingStart] = useState(0);
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [gameData, setGameData] = useState<GameDetailPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [devPanelOpen, setDevPanelOpen] = useState(false);
  const [dotRaceOutcome, setDotRaceOutcome] = useState<DotRaceOutcome>('random');
  const [simulateError, setSimulateError] = useState(false);

  useEffect(() => {
    if (phase !== 'main') return;
    let active = true;
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        if (route.name === 'home' || route.name === 'schedule') {
          const data = await getHomePageData();
          if (active) setHomeData(data);
        } else if (route.name === 'game') {
          const data = await getGameDetailPageData(route.id);
          if (active) setGameData(data);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load data');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [route, phase]);

  function openGame(game: GameDisplay) {
    setRoute({ name: 'game', id: game.id });
  }

  function handleTabPress(tab: TabName) {
    const routeMap: Record<TabName, Route> = {
      home: { name: 'home' },
      news: { name: 'news' },
      schedule: { name: 'schedule' },
      shop: { name: 'shop' },
      profile: { name: 'profile' },
    };
    setRoute(routeMap[tab]);
  }

  function handleDevNavigate(dest: NavDest) {
    if (dest === 'splash') { setSplashDest('main'); setPhase('splash'); return; }
    if (dest.startsWith('onboarding-')) {
      setOnboardingStart(Number(dest.split('-')[1]));
      setPhase('onboarding');
      return;
    }
    setPhase('main');
    if (dest === 'game') { setRoute({ name: 'game', id: 'fixture-live' }); return; }
    if (dest === 'home') { setRoute({ name: 'home' }); return; }
    if (dest === 'news') { setRoute({ name: 'news' }); return; }
    if (dest === 'schedule') { setRoute({ name: 'schedule' }); return; }
    if (dest === 'shop') { setRoute({ name: 'shop' }); return; }
    if (dest === 'profile') { setRoute({ name: 'profile' }); return; }
  }

  // Splash and onboarding render outside Layout
  if (phase === 'splash') {
    return (
      <SafeAreaProvider>
        <SplashScreen onDone={() => { setPhase(splashDest); setSplashDest('onboarding'); }} />
      </SafeAreaProvider>
    );
  }

  if (phase === 'onboarding') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.onboardingShell}>
          <Onboarding onDone={() => setPhase('main')} startPage={onboardingStart} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const activeTab: TabName =
    route.name === 'news' ? 'news' :
    route.name === 'schedule' || route.name === 'game' ? 'schedule' :
    route.name === 'shop' ? 'shop' :
    route.name === 'profile' ? 'profile' : 'home';

  const routeKey = route.name === 'game' ? `game:${route.id}` : route.name === 'shop' ? `shop:${route.itemId ?? 'all'}` : route.name;

  return (
    <SafeAreaProvider>
      <Layout
        routeKey={routeKey}
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onMockPress={SHOW_DEV_TOOLS ? () => setDevPanelOpen(true) : undefined}
      >
        {/* Back button for game detail */}
        {route.name === 'game' && (
          <Pressable onPress={() => setRoute({ name: 'home' })} style={styles.back}>
            <Text style={styles.backText}>← Back to games</Text>
          </Pressable>
        )}

        {/* Route-specific content */}
        {route.name === 'profile' ? (
          <ProfileScreen onBack={() => setRoute({ name: 'home' })} />
        ) : route.name === 'news' ? (
          <NewsScreen />
        ) : route.name === 'schedule' ? (
          <ScheduleScreen homeData={homeData} loading={loading} onGamePress={openGame} />
        ) : route.name === 'shop' ? (
          <FanShop
            initialItemId={route.itemId}
            onBack={() => setRoute(route.gameId ? { name: 'game', id: route.gameId } : { name: 'home' })}
          />
        ) : simulateError ? (
          <View style={shared.panel}>
            <Text style={shared.title}>Schedule unavailable</Text>
            <Text style={[shared.body, { marginTop: 6 }]}>Simulated error — toggle off in Dev Tools.</Text>
          </View>
        ) : loading ? (
          <View style={shared.panel}>
            <ActivityIndicator color={colors.teal} />
          </View>
        ) : error ? (
          <View style={shared.panel}>
            <Text style={shared.title}>Schedule unavailable</Text>
            <Text style={[shared.body, { marginTop: 6 }]}>{error}</Text>
          </View>
        ) : route.name === 'home' ? (
          homeData && <HomeScreen data={homeData} onGamePress={openGame} />
        ) : route.name === 'game' ? (
          gameData && <GameScreen data={gameData} dotRaceOutcome={dotRaceOutcome} onShopOpen={(itemId) => setRoute({ name: 'shop', itemId, gameId: gameData.game.id })} />
        ) : null}
      </Layout>

      {SHOW_DEV_TOOLS && (
        <DevPanel
          visible={devPanelOpen}
          onClose={() => setDevPanelOpen(false)}
          onNavigate={handleDevNavigate}
          dotRaceOutcome={dotRaceOutcome}
          onDotRaceOutcome={setDotRaceOutcome}
          simulateError={simulateError}
          onSimulateError={setSimulateError}
          currentRoute={route.name}
          currentPhase={phase}
        />
      )}
    </SafeAreaProvider>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  onboardingShell: { flex: 1, backgroundColor: '#050505' },
  back: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.panel,
  },
  backText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
});
