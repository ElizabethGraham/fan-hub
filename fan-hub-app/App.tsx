import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DevPanel, { type DotRaceOutcome, type NavDest } from './components/DevPanel';
import Layout, { type TabName } from './components/Layout';
import { MOCK_ACCOUNT, type MockAccount } from './lib/account';
import { getGameDetailPageData, type GameDetailPageData } from './lib/gameDetailData';
import { getHomePageData, type HomePageData } from './lib/homePageData';
import { colors, shared } from './lib/theme';
import AlertsScreen from './screens/AlertsScreen';
import AuthScreen from './screens/AuthScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import GameScreen from './screens/GameScreen';
import HomeScreen from './screens/HomeScreen';
import LegalScreen from './screens/LegalScreen';
import NewsDetailScreen from './screens/NewsDetailScreen';
import NewsScreen from './screens/NewsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import OnboardingScreen from './screens/OnboardingScreenRevamp';
import ProfileScreen from './screens/ProfileScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import CommandScreen from './screens/CommandScreen';
import SettingsScreen from './screens/SettingsScreen';
import ShopScreen from './screens/ShopScreen';
import SplashScreen from './screens/SplashScreenRevamp';
import TicketsScreen from './screens/TicketsScreen';
import type { GameDisplay } from './lib/types';
import { SPURS_ROSTER } from './lib/roster';

type Phase = 'splash' | 'onboarding' | 'auth' | 'main';
const SHOW_DEV_TOOLS = __DEV__ || process.env.EXPO_PUBLIC_MOCK_API === '1';

type OnboardingSetup = {
  favoritePlayerIds: string[];
  alertIds: string[];
};

type Route =
  | { name: 'home' }
  | { name: 'command' }
  | { name: 'game'; id: string }
  | { name: 'shop'; itemId?: string; gameId?: string }
  | { name: 'profile' }
  | { name: 'news' }
  | { name: 'newsDetail'; id: string }
  | { name: 'schedule' }
  | { name: 'favorites' }
  | { name: 'alerts' }
  | { name: 'notifications' }
  | { name: 'tickets' }
  | { name: 'settings' }
  | { name: 'legal'; kind: 'terms' | 'privacy' };

export default function App() {
  const [phase, setPhase] = useState<Phase>('splash');
  const [splashDest, setSplashDest] = useState<'onboarding' | 'main'>('onboarding');
  const [onboardingStart, setOnboardingStart] = useState(0);
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [gameData, setGameData] = useState<GameDetailPageData | null>(null);
  const [account, setAccount] = useState<MockAccount>(MOCK_ACCOUNT);
  const [onboardingSetup, setOnboardingSetup] = useState<OnboardingSetup | null>(null);
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

  function completeAuth() {
    setAccount(buildAccount(onboardingSetup));
    setPhase('main');
    setRoute({ name: 'home' });
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
    switch (dest) {
      case 'splash':
        setSplashDest('main');
        setPhase('splash');
        return;
      case 'auth':
        setPhase('auth');
        return;
      case 'onboarding-0':
      case 'onboarding-1':
      case 'onboarding-2':
      case 'onboarding-3':
        setOnboardingStart(Number(dest.split('-')[1]));
        setPhase('onboarding');
        return;
      case 'game':
        setPhase('main');
        setRoute({ name: 'game', id: 'fixture-live' });
        return;
      case 'home':
      case 'news':
      case 'schedule':
      case 'shop':
      case 'profile':
        setPhase('main');
        setRoute(({
          home: { name: 'home' },
          news: { name: 'news' },
          schedule: { name: 'schedule' },
          shop: { name: 'shop' },
          profile: { name: 'profile' },
        } satisfies Record<'home' | 'news' | 'schedule' | 'shop' | 'profile', Route>)[dest]);
        return;
    }
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
          <OnboardingScreen
            onDone={(setup) => {
              if (setup) setOnboardingSetup(setup);
              setPhase('auth');
            }}
            startPage={onboardingStart}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (phase === 'auth') {
    return (
      <SafeAreaProvider>
        <AuthScreen onDone={completeAuth} mockMode={SHOW_DEV_TOOLS} />
      </SafeAreaProvider>
    );
  }

  const activeTab: TabName =
    route.name === 'news' || route.name === 'newsDetail' ? 'news' :
    route.name === 'schedule' || route.name === 'game' ? 'schedule' :
    route.name === 'shop' ? 'shop' :
    route.name === 'profile' || route.name === 'favorites' || route.name === 'alerts' || route.name === 'notifications' || route.name === 'tickets' || route.name === 'settings' || route.name === 'legal' ? 'profile' : 'home';

  const routeKey =
    route.name === 'game' ? `game:${route.id}` :
    route.name === 'shop' ? `shop:${route.itemId ?? 'all'}` :
    route.name === 'newsDetail' ? `news:${route.id}` :
    route.name === 'legal' ? `legal:${route.kind}` :
    route.name;

  return (
    <SafeAreaProvider>
      <Layout
        routeKey={routeKey}
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onMockPress={SHOW_DEV_TOOLS ? () => setDevPanelOpen(true) : undefined}
        onCommandPress={() => setRoute({ name: 'command' })}
      >
        {/* Back button for game detail */}
        {route.name === 'game' && (
          <Pressable onPress={() => setRoute({ name: 'home' })} style={styles.back}>
            <Text style={styles.backText}>← Back to games</Text>
          </Pressable>
        )}

        {/* Route-specific content */}
        {route.name === 'profile' ? (
          <ProfileScreen
            onBack={() => setRoute({ name: 'home' })}
            onLoginPress={() => setPhase('auth')}
            account={account}
            onFavoritesPress={() => setRoute({ name: 'favorites' })}
            onAlertsPress={() => setRoute({ name: 'alerts' })}
            onTicketsPress={() => setRoute({ name: 'tickets' })}
            onSettingsPress={() => setRoute({ name: 'settings' })}
            onNotificationsPress={() => setRoute({ name: 'notifications' })}
            onTermsPress={() => setRoute({ name: 'legal', kind: 'terms' })}
            onPrivacyPress={() => setRoute({ name: 'legal', kind: 'privacy' })}
          />
        ) : route.name === 'news' ? (
          <NewsScreen onOpenArticle={(id) => setRoute({ name: 'newsDetail', id })} />
        ) : route.name === 'newsDetail' ? (
          <NewsDetailScreen
            id={route.id}
            onBack={() => setRoute({ name: 'news' })}
            onOpenGame={(id) => setRoute({ name: 'game', id })}
          />
        ) : route.name === 'favorites' ? (
          <FavoritesScreen players={account.favoritePlayers} onBack={() => setRoute({ name: 'profile' })} />
        ) : route.name === 'alerts' ? (
          <AlertsScreen
            alerts={account.alerts}
            onBack={() => setRoute({ name: 'profile' })}
            onInboxPress={() => setRoute({ name: 'notifications' })}
          />
        ) : route.name === 'notifications' ? (
          <NotificationsScreen onBack={() => setRoute({ name: 'profile' })} />
        ) : route.name === 'tickets' ? (
          <TicketsScreen tickets={account.tickets} onBack={() => setRoute({ name: 'profile' })} />
        ) : route.name === 'settings' ? (
          <SettingsScreen onBack={() => setRoute({ name: 'profile' })} />
        ) : route.name === 'legal' ? (
          <LegalScreen kind={route.kind} onBack={() => setRoute({ name: 'profile' })} />
        ) : route.name === 'command' ? (
          <CommandScreen
            onBack={() => setRoute({ name: 'home' })}
            onWalletPress={() => setRoute({ name: 'tickets' })}
            onAlertsPress={() => setRoute({ name: 'notifications' })}
            onShopPress={() => setRoute({ name: 'shop' })}
          />
        ) : route.name === 'schedule' ? (
          <ScheduleScreen homeData={homeData} loading={loading} onGamePress={openGame} />
        ) : route.name === 'shop' ? (
          <ShopScreen
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
          homeData && (
            <HomeScreen
              data={homeData}
              onGamePress={openGame}
              onWalletPress={() => setRoute({ name: 'tickets' })}
              onNotificationsPress={() => setRoute({ name: 'notifications' })}
            />
          )
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

function buildAccount(setup: OnboardingSetup | null): MockAccount {
  if (!setup) return MOCK_ACCOUNT;
  const favoriteById = new Map(SPURS_ROSTER.map((player) => [player.id, player]));

  return {
    ...MOCK_ACCOUNT,
    favoritePlayers: setup.favoritePlayerIds.flatMap((id) => {
      const player = favoriteById.get(id);
      if (!player) return [];
      return [
        {
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          reference: player.reference,
          position: player.position,
          reason: player.reason,
          alertsEnabled: true,
        },
      ];
    }),
    alerts: MOCK_ACCOUNT.alerts.map((alert) => ({
      ...alert,
      enabled: setup.alertIds.includes(alert.id),
    })),
  };
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
