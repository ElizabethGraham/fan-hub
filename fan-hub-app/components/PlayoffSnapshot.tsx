import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import PlayerAvatar from './PlayerAvatar';
import { colors, shared } from '../lib/theme';

export type PlayoffTrendGame = {
  id: string;
  label: string;
  roundLabel?: string;
  seriesLabel: string;
  opponentAlias: string;
  spursPoints: number;
  opponentPoints: number;
  result: 'W' | 'L';
  fgPct: number;
  reb: number;
  ast: number;
  leaders: PlayoffGameLeader[];
};

export type PlayoffLeader = {
  key: string;
  name: string;
  firstName: string;
  lastName: string;
  reference?: string;
  ppg: number;
  rpg: number;
  apg: number;
};

export type PlayoffGameLeader = {
  key: string;
  name: string;
  firstName: string;
  lastName: string;
  reference?: string;
  pts: number;
  reb: number;
  ast: number;
};

export type PlayoffSnapshotData = {
  wins: number;
  losses: number;
  avgPoints: number;
  avgAllowed: number;
  avgMargin: number;
  fgPct: number;
  fg3Pct: number;
  rebounds: number;
  assists: number;
  turnovers: number;
  trend: PlayoffTrendGame[];
  leaders: PlayoffLeader[];
};

function fmt(value: number) {
  return value.toFixed(1);
}

function leaderPrimary(leader: PlayoffLeader | PlayoffGameLeader): string {
  return 'ppg' in leader ? fmt(leader.ppg) : String(Math.round(leader.pts));
}

function leaderRebounds(leader: PlayoffLeader | PlayoffGameLeader): number {
  return 'rpg' in leader ? leader.rpg : leader.reb;
}

function leaderAssists(leader: PlayoffLeader | PlayoffGameLeader): number {
  return 'apg' in leader ? leader.apg : leader.ast;
}

export default function PlayoffSnapshot({ data }: { data: PlayoffSnapshotData }) {
  const [selectedId, setSelectedId] = useState<string | null>(data.trend.at(-1)?.id ?? null);
  const selectedGame = data.trend.find((game) => game.id === selectedId) ?? data.trend.at(-1) ?? null;
  const displayedLeaders: (PlayoffLeader | PlayoffGameLeader)[] =
    selectedGame?.leaders.length ? selectedGame.leaders : data.leaders.slice(0, 3);
  const chart = useMemo(() => makeChart(data.trend), [data.trend]);

  return (
    <View style={[shared.panel, styles.panel]}>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>Playoff Pulse</Text>
          <Text style={styles.subtitle}>Postseason scoring pressure, game by game.</Text>
        </View>
        <View style={styles.recordPlate}>
          <Text style={styles.record}>{data.wins}-{data.losses}</Text>
          <Text style={styles.recordLabel}>Record</Text>
        </View>
      </View>

      <View style={styles.heroGrid}>
        <Metric label="PPG" value={fmt(data.avgPoints)} tone="teal" />
        <Metric label="Allowed ppg" value={fmt(data.avgAllowed)} />
        <Metric label="FG%" value={`${fmt(data.fgPct)}%`} />
        <Metric label="3P%" value={`${fmt(data.fg3Pct)}%`} tone="orange" />
      </View>

      <View style={styles.graphCard}>
        <View style={styles.graphHeader}>
          <Text style={styles.graphTitle}>Scoring Trend</Text>
          <View style={styles.legend}>
            <LegendDot color={colors.teal} label="Spurs" />
            <LegendDot color="#71717a" label="Opponent" />
          </View>
        </View>

        <View style={styles.chartWrap}>
          <Svg width="100%" height={156} viewBox="0 0 300 156">
            {[0.25, 0.5, 0.75].map((tick) => (
              <Line
                key={tick}
                x1={chart.pad}
                x2={300 - chart.pad}
                y1={chart.pad + tick * (chart.height - chart.pad * 2)}
                y2={chart.pad + tick * (chart.height - chart.pad * 2)}
                stroke="#27272a"
                strokeWidth={1}
              />
            ))}
            {chart.seriesBoundaries.map((x) => (
              <Line key={x} x1={x} x2={x} y1={10} y2={124} stroke="#ffffff" strokeWidth={1} strokeDasharray="3 4" opacity={0.18} />
            ))}
            <Polyline points={chart.opponentPoints} fill="none" stroke="#71717a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points={chart.spursPoints} fill="none" stroke={colors.teal} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />

            {data.trend.map((game, index) => {
              const selected = selectedGame?.id === game.id;
              const x = chart.x(index);
              const spursY = chart.y(game.spursPoints);
              const oppY = chart.y(game.opponentPoints);
              return (
                <View key={game.id}>
                  <Rect x={x - 20} y={0} width={40} height={132} fill="transparent" onPress={() => setSelectedId(selected ? null : game.id)} />
                  <Circle cx={x} cy={oppY} r={selected ? 5 : 4} fill="#71717a" opacity={selected ? 1 : 0.75} />
                  <Circle cx={x} cy={spursY} r={selected ? 11 : 8} fill={colors.teal} opacity={0.16} />
                  <Circle cx={x} cy={spursY} r={selected ? 5 : 3.5} fill={selected ? '#ffffff' : colors.teal} stroke={colors.teal} strokeWidth={2} />
                  <SvgText x={x} y={146} fill={selected ? '#ffffff' : colors.muted} fontSize="9" fontWeight="800" textAnchor="middle">
                    {game.label.replace('Game ', 'G')}
                  </SvgText>
                </View>
              );
            })}
          </Svg>
        </View>

        <View style={styles.gameChips}>
          {data.trend.map((game) => {
            const selected = selectedGame?.id === game.id;
            return (
              <Pressable key={game.id} onPress={() => setSelectedId(selected ? null : game.id)} style={[styles.gameChip, selected && styles.gameChipSelected]}>
                <Text style={[styles.gameChipTop, selected && styles.gameChipTopSelected]}>{game.label.replace('Game ', 'G')}</Text>
                <Text style={styles.gameChipScore}>SAS {game.spursPoints}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {selectedGame && (
        <View style={styles.selectedCard}>
          <View>
            <Text style={styles.selectedSeries}>{selectedGame.seriesLabel}</Text>
            <Text style={styles.selectedLabel}>{selectedGame.label}</Text>
          </View>
          <View style={styles.selectedScore}>
            <Text style={[styles.result, selectedGame.result === 'W' ? styles.win : styles.loss]}>{selectedGame.result}</Text>
            <Text style={styles.scoreText}>SAS {selectedGame.spursPoints} - {selectedGame.opponentAlias} {selectedGame.opponentPoints}</Text>
          </View>
        </View>
      )}

      <View style={styles.split}>
        <View style={styles.leadersBlock}>
          <Text style={styles.blockTitle}>{selectedGame?.leaders.length ? 'Game Scorers' : 'Leading Scorers'}</Text>
          <View style={styles.leaders}>
            {displayedLeaders.map((leader) => (
              <View key={leader.key} style={styles.leader}>
                <PlayerAvatar firstName={leader.firstName} lastName={leader.lastName} reference={leader.reference} size="sm" />
                <View style={styles.leaderBody}>
                  <Text style={styles.leaderName} numberOfLines={1}>{leader.name}</Text>
                  <Text style={styles.leaderMeta}>{fmt(leaderRebounds(leader))} reb - {fmt(leaderAssists(leader))} ast</Text>
                </View>
                <View style={styles.leaderStat}>
                  <Text style={styles.leaderPrimary}>{leaderPrimary(leader)}</Text>
                  <Text style={styles.leaderPrimaryLabel}>{selectedGame?.leaders.length ? 'PTS' : 'PPG'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.detailMetrics}>
          <Metric label="FG%" value={`${fmt(selectedGame?.fgPct ?? data.fgPct)}%`} compact />
          <Metric label="REB" value={String(Math.round(selectedGame?.reb ?? data.rebounds))} compact />
          <Metric label="AST" value={String(Math.round(selectedGame?.ast ?? data.assists))} compact />
        </View>
      </View>
    </View>
  );
}

function makeChart(games: PlayoffTrendGame[]) {
  const width = 300;
  const height = 132;
  const pad = 20;
  const values = games.flatMap((game) => [game.spursPoints, game.opponentPoints]);
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  const x = (index: number) => pad + (index / Math.max(games.length - 1, 1)) * (width - pad * 2);
  const y = (value: number) => height - pad - ((value - min) / Math.max(max - min, 1)) * (height - pad * 2);
  const points = (selector: (game: PlayoffTrendGame) => number) =>
    games.map((game, index) => `${x(index)},${y(selector(game))}`).join(' ');
  const seriesBoundaries = games.flatMap((game, index) => {
    const currentRound = game.roundLabel ?? game.seriesLabel;
    const previousRound = games[index - 1]?.roundLabel ?? games[index - 1]?.seriesLabel;
    if (index === 0 || currentRound === previousRound) return [];
    return [(x(index - 1) + x(index)) / 2];
  });

  return {
    height,
    pad,
    x,
    y,
    spursPoints: points((game) => game.spursPoints),
    opponentPoints: points((game) => game.opponentPoints),
    seriesBoundaries,
  };
}

function Metric({
  label,
  value,
  tone = 'default',
  compact = false,
}: {
  label: string;
  value: string;
  tone?: 'default' | 'teal' | 'orange';
  compact?: boolean;
}) {
  return (
    <View style={[styles.metric, compact && styles.metricCompact]}>
      <Text style={[styles.metricValue, tone === 'teal' && styles.metricTeal, tone === 'orange' && styles.metricOrange]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { overflow: 'hidden' },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  titleBlock: { flex: 1 },
  eyebrow: { color: colors.pink, fontSize: 11, fontWeight: '900', letterSpacing: 1.5, textTransform: 'uppercase' },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  recordPlate: { alignItems: 'flex-end' },
  record: { color: colors.text, fontSize: 31, fontWeight: '900' },
  recordLabel: { color: colors.faint, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  metric: { minWidth: '46%', flexGrow: 1, borderWidth: 1, borderColor: 'rgba(196,206,212,0.12)', backgroundColor: 'rgba(9,9,11,0.48)', borderRadius: 13, padding: 11 },
  metricCompact: { minWidth: 0, paddingVertical: 10 },
  metricValue: { color: colors.text, fontSize: 18, fontWeight: '900' },
  metricTeal: { color: colors.teal },
  metricOrange: { color: colors.orange },
  metricLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase', marginTop: 2 },
  graphCard: { marginTop: 16, borderWidth: 1, borderColor: 'rgba(196,206,212,0.12)', backgroundColor: 'rgba(9,9,11,0.44)', borderRadius: 16, padding: 12 },
  graphHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  graphTitle: { color: colors.text, fontSize: 12, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
  legend: { flexDirection: 'row', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.muted, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  chartWrap: { marginTop: 8 },
  gameChips: { flexDirection: 'row', gap: 7, marginTop: 8 },
  gameChip: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingVertical: 8, alignItems: 'center', backgroundColor: colors.panelSoft },
  gameChipSelected: { borderColor: 'rgba(0,178,169,0.52)', backgroundColor: 'rgba(0,178,169,0.12)' },
  gameChipTop: { color: colors.faint, fontSize: 10, fontWeight: '900' },
  gameChipTopSelected: { color: colors.teal },
  gameChipScore: { color: colors.muted, fontSize: 9, fontWeight: '800', marginTop: 2 },
  selectedCard: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderWidth: 1, borderColor: 'rgba(0,178,169,0.24)', backgroundColor: 'rgba(0,178,169,0.07)', borderRadius: 14, padding: 12 },
  selectedSeries: { color: colors.faint, fontSize: 9, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
  selectedLabel: { color: colors.text, fontSize: 14, fontWeight: '900', marginTop: 2 },
  selectedScore: { alignItems: 'flex-end' },
  result: { fontSize: 15, fontWeight: '900' },
  win: { color: colors.teal },
  loss: { color: colors.muted },
  scoreText: { color: colors.text, fontSize: 12, fontWeight: '900', marginTop: 2 },
  split: { marginTop: 16, gap: 12 },
  blockTitle: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 8 },
  leadersBlock: {},
  leaders: { gap: 8 },
  leader: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panelSoft, borderRadius: 12, padding: 10 },
  leaderBody: { flex: 1, minWidth: 0 },
  leaderName: { color: colors.text, fontSize: 13, fontWeight: '900' },
  leaderMeta: { color: colors.muted, fontSize: 11, marginTop: 2 },
  leaderStat: { alignItems: 'flex-end' },
  leaderPrimary: { color: colors.text, fontSize: 15, fontWeight: '900' },
  leaderPrimaryLabel: { color: colors.faint, fontSize: 8, fontWeight: '900', letterSpacing: 1.1, marginTop: 1 },
  detailMetrics: { flexDirection: 'row', gap: 8 },
});
