import { Pressable, StyleSheet, Text, View } from 'react-native';
import FeaturedGame from '../components/FeaturedGame';
import GameSection from '../components/GameSection';
import PassCard from '../components/PassCard';
import PlayoffSnapshot from '../components/PlayoffSnapshotRevamp';
import StatusPill from '../components/StatusPill';
import { NOTIFICATIONS, WALLET_PASSES } from '../lib/experience';
import { colors, shared } from '../lib/theme';
import type { HomePageData } from '../lib/homePageData';
import type { GameDisplay } from '../lib/types';

export default function HomeScreen({
  data,
  onGamePress,
  onWalletPress,
  onNotificationsPress,
}: {
  data: HomePageData;
  onGamePress: (game: GameDisplay) => void;
  onWalletPress: () => void;
  onNotificationsPress: () => void;
}) {
  const { sections } = data;
  if (!sections.featured) {
    return (
      <View style={shared.panel}>
        <Text style={shared.title}>No games found</Text>
        <Text style={[shared.body, styles.emptyCopy]}>
          When mock schedule data is available, live games and wallet shortcuts will appear here.
        </Text>
      </View>
    );
  }

  const liveGames =
    sections.featured.status === 'live'
      ? [sections.featured, ...sections.live.filter((game) => game.id !== sections.featured?.id)]
      : sections.live;
  const nextUp = sections.confirmedUpcoming[0] ?? sections.featured;
  const upcoming = sections.confirmedUpcoming.filter((game) => game.id !== nextUp.id);
  const hasLiveGames = liveGames.length > 0;
  const unread = NOTIFICATIONS.filter((item) => item.unread).length;
  const primaryPass = WALLET_PASSES[0];

  return (
    <>
      <View style={styles.commandCenter}>
        <Text style={styles.commandEyebrow}>Game Day</Text>
        <Text style={styles.commandTitle}>Tonight at Frost Bank Center</Text>
        <Text style={styles.commandCopy}>
          Live game context, ticket access, rewards, and pickup status in one place.
        </Text>
        <View style={styles.quickActions}>
          <Pressable onPress={onWalletPress} style={styles.quickAction}>
            <Text style={styles.quickValue}>{WALLET_PASSES.length}</Text>
            <Text style={styles.quickLabel}>Wallet passes</Text>
          </Pressable>
          <Pressable onPress={onNotificationsPress} style={styles.quickAction}>
            <Text style={styles.quickValue}>{unread}</Text>
            <Text style={styles.quickLabel}>Unread alerts</Text>
          </Pressable>
        </View>
        <View style={styles.liveRow}>
          <StatusPill
            label={hasLiveGames ? 'Live context' : 'Pregame'}
            tone={hasLiveGames ? 'teal' : 'orange'}
          />
          <Text style={styles.liveText}>
            {hasLiveGames
              ? 'Stats and alerts are active.'
              : 'Wallet and setup are ready before tipoff.'}
          </Text>
        </View>
      </View>

      <View style={styles.walletPreview}>
        <View style={styles.walletHeader}>
          <Text style={styles.sectionTitle}>Game Day Wallet</Text>
          <Pressable onPress={onWalletPress} hitSlop={8}>
            <Text style={styles.link}>Open wallet</Text>
          </Pressable>
        </View>
        <PassCard pass={primaryPass} compact />
      </View>

      {hasLiveGames && (
        <>
          <GameSection
            title="Live Updates"
            description="Games in progress right now."
            games={liveGames}
            onGamePress={onGamePress}
          />
          {data.playoffSnapshot && <PlayoffSnapshot data={data.playoffSnapshot} />}
        </>
      )}
      <FeaturedGame game={nextUp} onPress={onGamePress} />
      {!hasLiveGames && data.playoffSnapshot && <PlayoffSnapshot data={data.playoffSnapshot} />}
      <GameSection
        title="Recent Results"
        description="Latest completed games."
        games={sections.recent}
        onGamePress={onGamePress}
      />
      <GameSection
        title="Upcoming"
        description="Next scheduled matchups."
        games={upcoming}
        onGamePress={onGamePress}
      />
      <GameSection
        title="Possible Games"
        description="Conditional playoff dates."
        games={sections.possibleUpcoming}
        onGamePress={onGamePress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  emptyCopy: { marginTop: 6 },
  commandCenter: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.14)',
    backgroundColor: '#050708',
    padding: 18,
    gap: 12,
  },
  commandEyebrow: {
    color: colors.teal,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  commandTitle: { color: colors.text, fontSize: 27, lineHeight: 32, fontWeight: '900' },
  commandCopy: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  quickActions: { flexDirection: 'row', gap: 10 },
  quickAction: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 13,
  },
  quickValue: { color: colors.text, fontSize: 24, fontWeight: '900' },
  quickLabel: {
    color: colors.faint,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 3,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  liveText: { flex: 1, color: colors.muted, fontSize: 12, fontWeight: '800' },
  walletPreview: { gap: 10 },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  link: {
    color: colors.teal,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
