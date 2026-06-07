import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DotRaces from './components/DotRaces';
import FanShop, { FanShopCarousel } from './components/FanShop';
import FeaturedGame from './components/FeaturedGame';
import GameCharts from './components/GameCharts';
import GameSection from './components/GameSection';
import KeyMatchup from './components/KeyMatchup';
import DevPanel, { type DotRaceOutcome, type NavDest } from './components/DevPanel';
import Layout, { type TabName } from './components/Layout';
import Onboarding from './components/Onboarding';
import PlayersToWatch from './components/PlayersToWatch';
import PlayoffSnapshot from './components/PlayoffSnapshot';
import ProfileScreen from './components/ProfileScreen';
import SplashScreen from './components/SplashScreen';
import StartingLineups from './components/StartingLineups';
import TeamComparison from './components/TeamComparison';
import { getGameDetailPageData, type GameDetailPageData } from './lib/gameDetailData';
import { getHomePageData, type HomePageData } from './lib/homePageData';
import { colors, shared } from './lib/theme';
import type { GameDisplay } from './lib/types';

type Phase = 'splash' | 'onboarding' | 'main';

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
        onMockPress={() => setDevPanelOpen(true)}
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
    </SafeAreaProvider>
  );
}

// ─── Screens ────────────────────────────────────────────────────────────────

function HomeScreen({ data, onGamePress }: { data: HomePageData; onGamePress: (game: GameDisplay) => void }) {
  const { sections } = data;
  if (!sections.featured) {
    return (
      <View style={shared.panel}>
        <Text style={shared.body}>No games found for this season.</Text>
      </View>
    );
  }
  const liveGames =
    sections.featured.status === 'live'
      ? [sections.featured, ...sections.live.filter((g) => g.id !== sections.featured?.id)]
      : sections.live;
  const nextUp = sections.confirmedUpcoming[0] ?? sections.featured;
  const upcoming = sections.confirmedUpcoming.filter((g) => g.id !== nextUp.id);
  const hasLiveGames = liveGames.length > 0;

  return (
    <>
      {hasLiveGames && (
        <>
          <GameSection title="Live Updates" description="Games in progress right now." games={liveGames} onGamePress={onGamePress} />
          {data.playoffSnapshot && <PlayoffSnapshot data={data.playoffSnapshot} />}
        </>
      )}
      <FeaturedGame game={nextUp} onPress={onGamePress} />
      {!hasLiveGames && data.playoffSnapshot && <PlayoffSnapshot data={data.playoffSnapshot} />}
      <GameSection title="Recent Results" description="Latest completed games." games={sections.recent} onGamePress={onGamePress} />
      <GameSection title="Upcoming" description="Next scheduled matchups." games={upcoming} onGamePress={onGamePress} />
      <GameSection title="Possible Games" description="Conditional playoff dates." games={sections.possibleUpcoming} onGamePress={onGamePress} />
    </>
  );
}

function GameScreen({ data, dotRaceOutcome, onShopOpen }: { data: GameDetailPageData; dotRaceOutcome: DotRaceOutcome; onShopOpen: (itemId: string) => void }) {
  return (
    <>
      <KeyMatchup game={data.game} chartData={data.chartData} />
      <TeamComparison game={data.game} homeWL={data.homeWL} awayWL={data.awayWL} />
      <StartingLineups
        game={data.game}
        homePlayers={data.homePlayers}
        awayPlayers={data.awayPlayers}
        homeStats={data.homeStats}
        awayStats={data.awayStats}
      />
      <PlayersToWatch
        game={data.game}
        homePlayers={data.homePlayers}
        awayPlayers={data.awayPlayers}
        homeStats={data.homeStats}
        awayStats={data.awayStats}
      />
      <GameCharts game={data.game} chartData={data.chartData} />
      <FanShopCarousel onOpen={onShopOpen} />
      {data.showDotRace && <DotRaces forcedOutcome={dotRaceOutcome} />}
    </>
  );
}

const MOCK_NEWS = [
  { tag: 'GAME RECAP', title: 'Spurs hold off Thunder in overtime thriller, 118-114', time: '2h ago' },
  { tag: 'ROSTER', title: 'Wembanyama named All-Rookie First Team — unanimous selection', time: '5h ago' },
  { tag: 'DRAFT', title: 'Spurs hold top-5 lottery odds heading into June draft', time: '1d ago' },
  { tag: 'FEATURE', title: "Inside Wemby's first season: what the numbers really say", time: '2d ago' },
  { tag: 'INJURY', title: 'Keldon Johnson listed as questionable for Thursday matchup', time: '2d ago' },
];

function NewsScreen() {
  return (
    <View style={styles.sectionWrap}>
      <Text style={shared.eyebrow}>Latest</Text>
      <Text style={[shared.title, { marginTop: 4, marginBottom: 16 }]}>Spurs News</Text>
      {MOCK_NEWS.map((item, i) => (
        <Pressable key={i} style={styles.newsCard}>
          <View style={styles.newsTag}>
            <Text style={styles.newsTagText}>{item.tag}</Text>
          </View>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsTime}>{item.time}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ScheduleScreen({
  homeData,
  loading,
  onGamePress,
}: {
  homeData: HomePageData | null;
  loading: boolean;
  onGamePress: (game: GameDisplay) => void;
}) {
  if (loading || !homeData) {
    return (
      <View style={shared.panel}>
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }
  const { sections } = homeData;
  return (
    <View style={styles.sectionWrap}>
      <Text style={shared.eyebrow}>2024–25 Season</Text>
      <Text style={[shared.title, { marginTop: 4, marginBottom: 16 }]}>Schedule</Text>
      <GameSection title="Upcoming" description="Next scheduled matchups." games={sections.confirmedUpcoming} onGamePress={onGamePress} />
      <GameSection title="Recent Results" description="Latest completed games." games={sections.recent} onGamePress={onGamePress} />
      <GameSection title="Possible Playoff Dates" description="Conditional postseason games." games={sections.possibleUpcoming} onGamePress={onGamePress} />
    </View>
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
  sectionWrap: { gap: 0 },
  newsCard: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  newsTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,178,169,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  newsTagText: { color: colors.teal, fontSize: 9, fontWeight: '900', letterSpacing: 1.3 },
  newsTitle: { color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 21 },
  newsTime: { color: colors.faint, fontSize: 11 },
});
