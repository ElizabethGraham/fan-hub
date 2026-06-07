import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';
import DateBadge from './DateBadge';
import { CENTRAL_TIMEZONE_LABEL } from '../lib/constants';
import { isSpursHome as isSpursHomeGame, gameDisplayLabel } from '../lib/gameDisplay';
import { teamLogoUrl } from '../lib/nba';
import { spursPlayoffStageForGame } from '../lib/playoffs';
import { colors } from '../lib/theme';
import type { GameDisplay } from '../lib/types';

type Props = {
  game: GameDisplay;
  onPress?: (game: GameDisplay) => void;
};

function fullName(team: GameDisplay['homeTeam']): string {
  return [team.market, team.name].filter(Boolean).join(' ');
}

function fmtTime(t: string) {
  return t.replace(/\bpm\b/i, 'PM').replace(/\bam\b/i, 'AM');
}

function spursContext(game: GameDisplay) {
  const isSpursHome = isSpursHomeGame(game);
  const opponent = isSpursHome ? game.awayTeam : game.homeTeam;
  const spursScore = isSpursHome ? game.homeTeamScore : game.awayTeamScore;
  const opponentScore = isSpursHome ? game.awayTeamScore : game.homeTeamScore;
  return { isSpursHome, opponent, spursScore, opponentScore };
}

function cardBlurb(game: GameDisplay): string {
  const { isSpursHome, opponent, spursScore, opponentScore } = spursContext(game);
  const opponentName = fullName(opponent);
  const margin = Math.abs(spursScore - opponentScore);
  const stage = spursPlayoffStageForGame(game);

  if (game.status === 'live') {
    if (spursScore === opponentScore) {
      return `Spurs are level with ${opponentName}; the next clean stretch can tilt this ${stage ?? 'game'}.`;
    }
    if (spursScore > opponentScore) {
      return 'Spurs have the edge right now; the story is whether they can keep the pace controlled.';
    }
    return `Spurs are within ${margin}; the next run is the story.`;
  }
  if (game.status === 'final') {
    return spursScore > opponentScore
      ? `Spurs created separation and kept ${opponentName} chasing late.`
      : `Spurs stayed close enough for useful takeaways in the possession details.`;
  }
  return isSpursHome
    ? `Spurs host the ${opponentName}; game preview, projected lineups, matchup notes, and key storylines.`
    : `Spurs visit the ${opponentName}; game preview, projected lineups, matchup notes, and key storylines.`;
}

function PulsingDot() {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.2, duration: 550, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 550, useNativeDriver: true }),
      ])
    ).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Animated.View style={[styles.liveDot, { opacity }]} />;
}

function StatusBadge({ status }: { status: GameDisplay['status'] }) {
  if (status === 'live') {
    return (
      <View style={[styles.status, styles.liveStatus]}>
        <PulsingDot />
        <Text style={styles.liveText}>Live</Text>
      </View>
    );
  }
  const label = status === 'final' ? 'Final' : status === 'if-necessary' ? 'If Necessary' : 'Upcoming';
  return (
    <View style={styles.status}>
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
}

function TeamBlock({ team }: { team: GameDisplay['homeTeam'] }) {
  return (
    <View style={styles.team}>
      <Image source={{ uri: teamLogoUrl(team.alias) }} style={styles.logo} />
      <Text style={styles.alias}>{team.alias}</Text>
      <Text style={styles.teamName} numberOfLines={2}>{team.name}</Text>
    </View>
  );
}

export default function GameCard({ game, onPress }: Props) {
  const isFinal = game.status === 'final';
  const showScore = game.status === 'live' || isFinal;
  const label = gameDisplayLabel(game);
  const time = game.time ? fmtTime(game.time) : game.status === 'scheduled' ? 'TBD' : `7:00 PM ${CENTRAL_TIMEZONE_LABEL}`;
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
    <Pressable
      onPress={() => onPress?.(game)}
      onPressIn={() => Animated.spring(scale, { toValue: 0.965, friction: 8, tension: 200, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 5, tension: 180, useNativeDriver: true }).start()}
      style={styles.card}
    >
      {label && (
        <View style={styles.series}>
          <Text style={styles.seriesText}>{label}</Text>
          <View style={styles.rule} />
        </View>
      )}

      <View style={styles.matchup}>
        <TeamBlock team={game.homeTeam} />
        <View style={styles.center}>
          {showScore ? (
            <Text style={styles.score}>{game.homeTeamScore} <Text style={styles.dash}>-</Text> {game.awayTeamScore}</Text>
          ) : (
            <Text style={styles.vs}>vs</Text>
          )}
        </View>
        <TeamBlock team={game.awayTeam} />
      </View>

      <View style={styles.footer}>
        <DateBadge date={game.date} />
        <Text style={styles.time}>{time}</Text>
        <StatusBadge status={game.status} />
      </View>

      <Text style={styles.blurb} numberOfLines={2}>{cardBlurb(game)}</Text>
    </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  pressed: { opacity: 0.82 },
  series: { alignItems: 'center', gap: 8 },
  seriesText: { color: colors.text, fontSize: 11, fontWeight: '900', letterSpacing: 1.6, textTransform: 'uppercase' },
  rule: { width: 80, height: 1, backgroundColor: '#71717a' },
  matchup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  team: { width: 94, alignItems: 'center', gap: 4 },
  logo: { width: 46, height: 46, resizeMode: 'contain' },
  teamName: { color: colors.text, fontSize: 12, fontWeight: '800', lineHeight: 14, textAlign: 'center', minHeight: 28 },
  alias: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  center: { flex: 1, minWidth: 76, alignItems: 'center' },
  score: { color: colors.text, fontSize: 24, fontWeight: '900' },
  dash: { color: colors.muted, fontSize: 14 },
  vs: { color: colors.muted, fontSize: 11, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  footer: { borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  time: { flex: 1, textAlign: 'center', color: colors.muted, fontSize: 13, fontWeight: '900' },
  status: { borderColor: '#3f3f46', borderWidth: 1, borderRadius: 999, backgroundColor: '#27272a', paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  liveStatus: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.redBg, borderColor: colors.redBorder },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#f87171' },
  liveText: { color: '#fca5a5', fontSize: 12, fontWeight: '800' },
  blurb: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
