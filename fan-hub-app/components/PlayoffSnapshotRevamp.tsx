import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import PlayerAvatar from './PlayerAvatar';
import { colors, shared } from '../lib/theme';
import type {
  PlayoffGameLeader,
  PlayoffLeader,
  PlayoffSnapshotData,
  PlayoffTrendGame,
} from './PlayoffSnapshot';

const W = 320;
const H = 206;
const PAD_X = 26;
const TOP = 26;
const BOTTOM = 48;

type ChartPoint = {
  game: PlayoffTrendGame;
  x: number;
  ySpurs: number;
  yOpponent: number;
};

function fmt(value: number) {
  return value.toFixed(1);
}

function compactGameLabel(label: string) {
  return label.replace('Game ', 'G');
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

export default function PlayoffSnapshotRevamp({ data }: { data: PlayoffSnapshotData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedGame = selectedId ? data.trend.find((game) => game.id === selectedId) ?? null : null;
  const chart = useMemo(() => makeChart(data.trend), [data.trend]);
  const selectedPoint = selectedGame
    ? chart.points.find((point) => point.game.id === selectedGame.id) ?? null
    : null;
  const leaders: (PlayoffLeader | PlayoffGameLeader)[] = selectedGame?.leaders.length
    ? selectedGame.leaders
    : data.leaders.slice(0, 3);

  return (
    <View style={[shared.panel, styles.panel]}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Playoff Pulse</Text>
          <Text style={styles.headline}>Series performance tracker</Text>
        </View>
        <View style={styles.recordBadge}>
          <Text style={styles.record}>
            {data.wins}-{data.losses}
          </Text>
          <Text style={styles.recordLabel}>Record</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <Metric value={fmt(data.avgPoints)} label="PPG" accent={colors.teal} />
        <Metric value={fmt(data.avgAllowed)} label="Allowed ppg" />
        <Metric value={`${fmt(data.fgPct)}%`} label="FG%" />
        <Metric value={`${fmt(data.fg3Pct)}%`} label="3P%" accent={colors.orange} />
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartTop}>
          <View>
            <Text style={styles.chartTitle}>Points Per Game</Text>
            <Text style={styles.chartHint}>Tap a lane for game detail. Tap again for averages.</Text>
          </View>
          <View style={styles.legend}>
            <LegendItem color={colors.teal} label="Spurs" />
            <LegendItem color="#8d929c" label="Opp" />
          </View>
        </View>

        <View style={styles.chartFrame}>
          <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
            <Defs>
              <LinearGradient id="spursArea" x1="0" x2="0" y1="0" y2="1">
                <Stop offset="0" stopColor={colors.teal} stopOpacity="0.28" />
                <Stop offset="0.72" stopColor={colors.teal} stopOpacity="0.045" />
                <Stop offset="1" stopColor={colors.teal} stopOpacity="0" />
              </LinearGradient>
              <LinearGradient id="selectedLane" x1="0" x2="0" y1="0" y2="1">
                <Stop offset="0" stopColor="#ffffff" stopOpacity="0.08" />
                <Stop offset="1" stopColor="#ffffff" stopOpacity="0.015" />
              </LinearGradient>
            </Defs>

            {chart.yTicks.map((tick) => (
              <G key={tick.value}>
                <Line
                  x1={PAD_X}
                  x2={W - PAD_X}
                  y1={tick.y}
                  y2={tick.y}
                  stroke="#2a2d34"
                  strokeWidth={1}
                />
                <SvgText x={8} y={tick.y + 3} fill="#6f7480" fontSize="8" fontWeight="800">
                  {tick.value}
                </SvgText>
              </G>
            ))}

            {chart.boundaries.map((boundary) => (
              <Line
                key={boundary.x}
                x1={boundary.x}
                x2={boundary.x}
                y1={TOP - 4}
                y2={H - BOTTOM + 12}
                stroke="#ffffff"
                strokeWidth={1}
                strokeDasharray="4 6"
                opacity={0.16}
              />
            ))}

            {selectedPoint && (
              <>
                <Rect
                  x={selectedPoint.x - chart.laneWidth / 2}
                  y={TOP - 6}
                  width={chart.laneWidth}
                  height={H - TOP - 20}
                  rx={12}
                  fill="url(#selectedLane)"
                />
                <Line
                  x1={selectedPoint.x}
                  x2={selectedPoint.x}
                  y1={TOP - 4}
                  y2={H - BOTTOM + 14}
                  stroke="#ffffff"
                  strokeWidth={1}
                  opacity={0.18}
                />
              </>
            )}

            <Path d={chart.areaPath} fill="url(#spursArea)" />
            <Path
              d={chart.opponentPath}
              fill="none"
              stroke="#8d929c"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.86}
            />
            <Path
              d={chart.spursPath}
              fill="none"
              stroke={colors.teal}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chart.points.map((point) => {
              const selected = selectedGame?.id === point.game.id;
              const margin = point.game.spursPoints - point.game.opponentPoints;
              return (
                <G key={point.game.id}>
                  <Rect
                    x={point.x - chart.laneWidth / 2}
                    y={0}
                    width={chart.laneWidth}
                    height={H}
                    fill="transparent"
                    onPress={() =>
                      setSelectedId((current) => (current === point.game.id ? null : point.game.id))
                    }
                  />
                  <Circle
                    cx={point.x}
                    cy={point.yOpponent}
                    r={selected ? 5 : 3.5}
                    fill="#8d929c"
                    opacity={selected ? 1 : 0.72}
                  />
                  <Circle
                    cx={point.x}
                    cy={point.ySpurs}
                    r={selected ? 15 : 9}
                    fill={colors.teal}
                    opacity={selected ? 0.2 : 0.12}
                  />
                  <Circle
                    cx={point.x}
                    cy={point.ySpurs}
                    r={selected ? 6 : 4}
                    fill={selected ? '#ffffff' : colors.teal}
                    stroke={colors.teal}
                    strokeWidth={2}
                  />
                  <SvgText
                    x={point.x}
                    y={point.ySpurs - 15}
                    fill={margin >= 0 ? colors.teal : colors.pink}
                    fontSize="9"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {margin >= 0 ? `+${margin}` : margin}
                  </SvgText>
                  <SvgText
                    x={point.x}
                    y={H - 14}
                    fill={selected ? '#ffffff' : '#858a94'}
                    fontSize="10"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {compactGameLabel(point.game.label)}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>
      </View>

      {selectedGame && (
        <View style={styles.spotlight}>
          <View style={styles.spotlightMain}>
            <Text style={styles.round}>{selectedGame.seriesLabel}</Text>
            <Text style={styles.finalScore}>
              SAS {selectedGame.spursPoints} - {selectedGame.opponentAlias}{' '}
              {selectedGame.opponentPoints}
            </Text>
          </View>
          <View style={styles.contextStack}>
            <View
              style={[
                styles.resultBadge,
                selectedGame.result === 'W' ? styles.resultWin : styles.resultLoss,
              ]}
            >
              <Text style={styles.resultText}>{selectedGame.result}</Text>
            </View>
            <Text style={styles.contextMeta}>{fmt(selectedGame.fgPct)} FG%</Text>
          </View>
        </View>
      )}

      <View style={styles.leaderPanel}>
        <Text style={styles.sectionTitle}>
          {selectedGame?.leaders.length ? 'Game Leaders' : 'Series Leaders'}
        </Text>
        {leaders.map((leader) => (
          <View key={leader.key} style={styles.leaderRow}>
            <PlayerAvatar
              firstName={leader.firstName}
              lastName={leader.lastName}
              reference={leader.reference}
              size="sm"
            />
            <View style={styles.leaderText}>
              <Text style={styles.leaderName} numberOfLines={1}>
                {leader.name}
              </Text>
              <Text style={styles.leaderMeta}>
                {fmt(leaderRebounds(leader))} reb - {fmt(leaderAssists(leader))} ast
              </Text>
            </View>
            <View style={styles.leaderValue}>
              <Text style={styles.leaderPrimary}>{leaderPrimary(leader)}</Text>
              <Text style={styles.leaderLabel}>{selectedGame?.leaders.length ? 'PTS' : 'PPG'}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.miniStats}>
        <MiniStat label="REB" value={String(Math.round(selectedGame?.reb ?? data.rebounds))} />
        <MiniStat label="AST" value={String(Math.round(selectedGame?.ast ?? data.assists))} />
        <MiniStat label="TOV" value={String(Math.round(data.turnovers))} />
      </View>
    </View>
  );
}

function makeChart(games: PlayoffTrendGame[]) {
  const values = games.flatMap((game) => [game.spursPoints, game.opponentPoints]);
  const min = Math.floor((Math.min(...values) - 6) / 5) * 5;
  const max = Math.ceil((Math.max(...values) + 6) / 5) * 5;
  const chartHeight = H - TOP - BOTTOM;
  const laneWidth = (W - PAD_X * 2) / Math.max(games.length, 1);
  const x = (index: number) => PAD_X + laneWidth / 2 + index * laneWidth;
  const y = (value: number) => TOP + (1 - (value - min) / Math.max(max - min, 1)) * chartHeight;
  const points: ChartPoint[] = games.map((game, index) => ({
    game,
    x: x(index),
    ySpurs: y(game.spursPoints),
    yOpponent: y(game.opponentPoints),
  }));
  const linePath = (selector: (point: ChartPoint) => number) =>
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${selector(point)}`)
      .join(' ');
  const baseline = H - BOTTOM + 2;
  const firstX = points[0]?.x ?? PAD_X;
  const lastX = points.at(-1)?.x ?? PAD_X;
  const areaPath = `${linePath((point) => point.ySpurs)} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`;
  const boundaries = points.flatMap((point, index) => {
    if (index === 0) return [];
    const current = point.game.roundLabel ?? point.game.seriesLabel;
    const previous = points[index - 1].game.roundLabel ?? points[index - 1].game.seriesLabel;
    return current === previous ? [] : [{ x: point.x - laneWidth / 2 }];
  });
  const yTicks = [max, Math.round((max + min) / 2), min].map((value) => ({ value, y: y(value) }));

  return {
    points,
    laneWidth,
    spursPath: linePath((point) => point.ySpurs),
    opponentPath: linePath((point) => point.yOpponent),
    areaPath,
    boundaries,
    yTicks,
  };
}

function Metric({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, accent ? { color: accent } : null]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendLine, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    overflow: 'hidden',
    borderColor: 'rgba(196,206,212,0.18)',
    backgroundColor: '#101114',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
  },
  headerCopy: { flex: 1 },
  kicker: {
    color: colors.pink,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  },
  headline: { color: colors.text, fontSize: 19, fontWeight: '900', lineHeight: 23, marginTop: 5 },
  recordBadge: {
    minWidth: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.16)',
    backgroundColor: 'rgba(255,255,255,0.045)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  record: { color: colors.text, fontSize: 25, fontWeight: '900' },
  recordLabel: {
    color: colors.faint,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  metric: {
    width: '48%',
    minHeight: 74,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.12)',
    backgroundColor: 'rgba(255,255,255,0.045)',
    paddingHorizontal: 12,
    paddingVertical: 11,
    justifyContent: 'center',
  },
  metricValue: { color: colors.text, fontSize: 22, fontWeight: '900' },
  metricLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  chartCard: {
    marginTop: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.14)',
    backgroundColor: 'rgba(4,5,7,0.56)',
    padding: 12,
  },
  chartTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  chartTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chartHint: { color: colors.faint, fontSize: 10, fontWeight: '700', marginTop: 3 },
  legend: { flexDirection: 'row', gap: 10, paddingTop: 1 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendLine: { width: 16, height: 3, borderRadius: 999 },
  legendText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  chartFrame: { marginTop: 4 },
  spotlight: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,178,169,0.22)',
    backgroundColor: 'rgba(0,178,169,0.08)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  spotlightMain: { flex: 1 },
  round: {
    color: colors.faint,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  finalScore: { color: colors.text, fontSize: 15, lineHeight: 19, fontWeight: '900', marginTop: 4 },
  contextStack: { alignItems: 'flex-end', gap: 5 },
  resultBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultWin: { backgroundColor: colors.teal },
  resultLoss: { backgroundColor: '#3f3f46' },
  resultText: { color: '#050505', fontSize: 16, fontWeight: '900' },
  contextMeta: { color: colors.muted, fontSize: 9, fontWeight: '900' },
  leaderPanel: { marginTop: 16 },
  sectionTitle: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.1)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    padding: 10,
    marginBottom: 8,
  },
  leaderText: { flex: 1, minWidth: 0 },
  leaderName: { color: colors.text, fontSize: 13, fontWeight: '900' },
  leaderMeta: { color: colors.muted, fontSize: 11, marginTop: 2 },
  leaderValue: { alignItems: 'flex-end' },
  leaderPrimary: { color: colors.text, fontSize: 16, fontWeight: '900' },
  leaderLabel: { color: colors.faint, fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  miniStats: { flexDirection: 'row', gap: 8, marginTop: 4 },
  miniStat: {
    flex: 1,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.1)',
    backgroundColor: '#15161a',
    paddingVertical: 10,
    alignItems: 'center',
  },
  miniValue: { color: colors.text, fontSize: 15, fontWeight: '900' },
  miniLabel: {
    color: colors.faint,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginTop: 2,
  },
});
