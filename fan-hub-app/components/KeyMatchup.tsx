import { StyleSheet, Text, View } from 'react-native';
import { SPURS_ALIAS } from '../lib/constants';
import { gameDisplayLabel } from '../lib/gameDisplay';
import { colors, shared } from '../lib/theme';
import type { GameDisplay, NBAGameChartData } from '../lib/types';

type Props = {
  game: GameDisplay;
  chartData?: NBAGameChartData | null;
};

function fullName(team: GameDisplay['homeTeam']): string {
  return [team.market, team.name].filter(Boolean).join(' ');
}

function teamPerspective(game: GameDisplay) {
  const isSpursHome = game.homeTeam.alias === SPURS_ALIAS;
  const spurs = isSpursHome ? game.homeTeam : game.awayTeam;
  const opponent = isSpursHome ? game.awayTeam : game.homeTeam;
  return { isSpursHome, spurs, opponent };
}

function headline(game: GameDisplay): string {
  const { isSpursHome, spurs, opponent } = teamPerspective(game);
  const spursName = fullName(spurs);
  const opponentName = fullName(opponent);
  const spursScore = isSpursHome ? game.homeTeamScore : game.awayTeamScore;
  const opponentScore = isSpursHome ? game.awayTeamScore : game.homeTeamScore;
  if (game.status === 'live') {
    if (spursScore === opponentScore) return `${spursName} level with ${opponentName}`;
    return spursScore > opponentScore
      ? `${spursName} lead by ${spursScore - opponentScore}`
      : `${spursName} trail by ${opponentScore - spursScore}`;
  }
  if (game.status === 'final') {
    return spursScore > opponentScore
      ? `${spursName} win by ${spursScore - opponentScore}`
      : `${spursName} fall by ${opponentScore - spursScore}`;
  }
  return isSpursHome ? `${spursName} host ${opponentName}` : `${spursName} visit ${opponentName}`;
}

function story(game: GameDisplay): string {
  const { isSpursHome, opponent } = teamPerspective(game);
  const opponentName = fullName(opponent);
  if (game.status === 'live') {
    return 'The live story is still forming, with shot quality and turnovers likely to decide the next Spurs swing.';
  }
  if (game.status === 'final') {
    return 'The final margin tells the result, but the useful Spurs read is in the possession details below.';
  }
  return isSpursHome
    ? `Watch whether San Antonio can control the first stretch against ${opponentName}.`
    : `Watch whether San Antonio can settle in on the road against ${opponentName}.`;
}

function StatusBadge({ status, title }: { status: GameDisplay['status']; title?: string }) {
  if (status === 'live') {
    return (
      <View style={[styles.badge, styles.liveBadge]}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>Live</Text>
      </View>
    );
  }
  const label = status === 'final' ? 'Final' : title ?? 'Game Brief';
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export default function KeyMatchup({ game }: Props) {
  const label = gameDisplayLabel(game);
  const dateLabel = label ? `${label} - ${game.date}` : game.date;
  const { isSpursHome, opponent } = teamPerspective(game);
  return (
    <View style={shared.panel}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={shared.eyebrow}>Game Brief</Text>
          <Text style={styles.headline}>{headline(game)}</Text>
        </View>
        <StatusBadge status={game.status} title={game.title} />
      </View>
      <Text style={[shared.body, styles.story]}>{story(game)}</Text>
      <View style={styles.grid}>
        <Info label={game.title ? 'Game' : 'Date'} value={dateLabel} />
        <Info
          label={game.status === 'scheduled' ? 'Tipoff' : 'Spurs Lens'}
          value={game.status === 'scheduled' ? game.time ?? 'TBD' : isSpursHome ? `Home vs ${opponent.alias}` : `Road at ${opponent.alias}`}
        />
        <Info label="Focus" value={game.status === 'scheduled' ? 'First run' : 'Next swing'} accent />
      </View>
    </View>
  );
}

function Info({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, accent && styles.accent]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  headline: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 6, lineHeight: 27 },
  story: { marginTop: 12 },
  badge: { borderWidth: 1, borderColor: '#3f3f46', backgroundColor: '#27272a', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.redBg, borderColor: colors.redBorder, paddingHorizontal: 8, paddingVertical: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#f87171' },
  liveText: { color: '#fca5a5', fontSize: 12, fontWeight: '800' },
  grid: { gap: 8, marginTop: 18 },
  info: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panelSoft, borderRadius: 12, padding: 12 },
  infoLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase' },
  infoValue: { color: colors.text, fontSize: 14, fontWeight: '800', marginTop: 4 },
  accent: { color: colors.teal },
});
