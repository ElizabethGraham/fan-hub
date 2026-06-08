import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors } from '../../lib/theme';
import {
  OnboardingBackdropRevamp,
  SpursMark,
  nbaHeadshot,
} from './OnboardingPrimitivesRevamp';

const FEATURED_PLAYERS = [
  { first: 'Victor', last: 'Wembanyama', ref: '1641705', stat: '29 PTS' },
  { first: 'Stephon', last: 'Castle', ref: '1642264', stat: '8 AST' },
  { first: "De'Aaron", last: 'Fox', ref: '1628368', stat: 'CLUTCH' },
];

export default function WelcomeHeroRevamp({ color }: { color: string }) {
  const { width } = useWindowDimensions();
  const intro = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const introAnim = Animated.timing(intro, { toValue: 1, duration: 620, useNativeDriver: true });
    const driftAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 2600, useNativeDriver: true }),
      ]),
    );

    introAnim.start();
    driftAnim.start();
    return () => {
      introAnim.stop();
      driftAnim.stop();
    };
  }, [drift, intro]);

  const stageWidth = Math.min(width, 430);
  const heroHeight = Math.min(stageWidth * 0.9, 376);
  const mainPlayerWidth = Math.min(stageWidth * 0.72, 292);
  const mainPlayerHeight = mainPlayerWidth * 0.74;
  const introY = intro.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });
  const playerY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
  const cardY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 5] });

  return (
    <View style={styles.root}>
      <OnboardingBackdropRevamp accent={color} />

      <Animated.View
        style={[
          styles.editorialStage,
          {
            width: stageWidth,
            height: heroHeight,
            opacity: intro,
            transform: [{ translateY: introY }],
          },
        ]}
      >
        <View style={styles.topLockup}>
          <SpursMark size={38} />
          <View>
            <Text style={styles.lockupText}>SAN ANTONIO</Text>
            <Text style={styles.lockupTitle}>SPURS</Text>
          </View>
        </View>

        <Animated.Image
          source={{ uri: nbaHeadshot(FEATURED_PLAYERS[0].ref) }}
          style={[
            styles.mainPlayer,
            {
              width: mainPlayerWidth,
              height: mainPlayerHeight,
              right: -stageWidth * 0.08,
              bottom: heroHeight * 0.02,
              transform: [{ translateY: playerY }, { scale: 1.08 }],
            },
          ]}
        />

        <View pointerEvents="none" style={styles.playerShadow} />

        <Animated.View style={[styles.liveCard, { transform: [{ translateY: cardY }] }]}>
          <View style={styles.liveHeader}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>LIVE</Text>
            <Text style={styles.liveClock}>Q4 3:28</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.team}>SAS</Text>
            <Text style={styles.score}>112</Text>
          </View>
          <View style={styles.scoreRowMuted}>
            <Text style={styles.teamMuted}>NYK</Text>
            <Text style={styles.scoreMuted}>108</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.playerRail,
            {
              transform: [
                {
                  translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }),
                },
              ],
            },
          ]}
        >
          {FEATURED_PLAYERS.slice(1).map((player) => (
            <View key={player.ref} style={styles.railCard}>
              <Image source={{ uri: nbaHeadshot(player.ref) }} style={styles.railImage} />
              <View style={styles.railText}>
                <Text style={styles.railName}>{player.last}</Text>
                <Text style={styles.railStat}>{player.stat}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        <View style={styles.ticketPass}>
          <View style={styles.ticketBody}>
            <Text style={styles.hubEyebrow}>TONIGHT</Text>
            <Text style={styles.hubTitle}>Tickets ready</Text>
            <View style={styles.ticketMetaRow}>
              <Text style={styles.ticketMeta}>Gate 3</Text>
              <Text style={styles.ticketMetaMuted}>Lot B</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  editorialStage: {
    position: 'relative',
    overflow: 'hidden',
  },
  topLockup: {
    position: 'absolute',
    top: 22,
    left: 22,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lockupText: { color: 'rgba(255,255,255,0.56)', fontSize: 10, fontWeight: '900' },
  lockupTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: -1 },
  mainPlayer: {
    position: 'absolute',
    resizeMode: 'contain',
    zIndex: 2,
  },
  playerShadow: {
    position: 'absolute',
    right: 28,
    bottom: 16,
    width: 206,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.48)',
    transform: [{ scaleX: 1.18 }],
  },
  liveCard: {
    position: 'absolute',
    left: 22,
    top: 92,
    zIndex: 6,
    width: 148,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(8,9,11,0.78)',
    padding: 12,
  },
  liveHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444' },
  liveLabel: { color: '#fff', fontSize: 10, fontWeight: '900', flex: 1 },
  liveClock: { color: 'rgba(255,255,255,0.58)', fontSize: 10, fontWeight: '800' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scoreRowMuted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  team: { color: '#fff', fontSize: 13, fontWeight: '900' },
  score: { color: '#fff', fontSize: 28, fontWeight: '900' },
  teamMuted: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '900' },
  scoreMuted: { color: 'rgba(255,255,255,0.56)', fontSize: 20, fontWeight: '900' },
  playerRail: {
    position: 'absolute',
    right: 18,
    top: 22,
    zIndex: 5,
    gap: 8,
  },
  railCard: {
    width: 124,
    minHeight: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(8,9,11,0.72)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    gap: 6,
  },
  railImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    resizeMode: 'cover',
    backgroundColor: '#22252a',
  },
  railText: { flex: 1 },
  railName: { color: '#fff', fontSize: 10, fontWeight: '900' },
  railStat: { color: colors.teal, fontSize: 10, fontWeight: '900', marginTop: 1 },
  ticketPass: {
    position: 'absolute',
    left: 22,
    bottom: 18,
    zIndex: 6,
    width: 178,
    minHeight: 102,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(10,11,13,0.82)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
  ticketBody: { padding: 13 },
  hubEyebrow: { color: 'rgba(255,255,255,0.52)', fontSize: 10, fontWeight: '900' },
  hubTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 4 },
  ticketMetaRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  ticketMeta: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  ticketMetaMuted: { color: 'rgba(255,255,255,0.58)', fontSize: 11, fontWeight: '900' },
});
