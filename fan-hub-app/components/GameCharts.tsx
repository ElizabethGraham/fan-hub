import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { isPregameGame } from '../lib/gameDisplay';
import { colors, shared } from '../lib/theme';
import type { GameDisplay, NBAGameChartData, NBATeamChartStats } from '../lib/types';

type MetricKey = keyof NBATeamChartStats;

const METRICS: { key: MetricKey; label: string; maxVal: number; isPercent?: boolean }[] = [
  { key: 'fgPct', label: 'FG%', maxVal: 60, isPercent: true },
  { key: 'fg3Pct', label: '3P%', maxVal: 50, isPercent: true },
  { key: 'reb', label: 'REB', maxVal: 60 },
  { key: 'ast', label: 'AST', maxVal: 40 },
  { key: 'stl', label: 'STL', maxVal: 15 },
  { key: 'tov', label: 'TOV', maxVal: 25 },
];

function fmt(value: number, isPercent?: boolean) {
  return isPercent ? `${value.toFixed(1)}%` : String(Math.round(value));
}

export default function GameCharts({
  game,
  chartData,
}: {
  game: GameDisplay;
  chartData?: NBAGameChartData | null;
}) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey | null>(null);
  const isPregame = isPregameGame(game.status);
  if (!chartData) {
    return (
      <View style={shared.panel}>
        <Header isPregame={isPregame} />
        <Text style={shared.body}>{isPregame ? 'Season stat data is unavailable right now.' : 'Game stats are unavailable right now.'}</Text>
      </View>
    );
  }

  const selectedMetricDef = selectedMetric ? METRICS.find((metric) => metric.key === selectedMetric) : null;

  return (
    <View style={shared.panel}>
      <Header isPregame={isPregame} />
      <View style={styles.metrics}>
        {METRICS.map((metric) => (
          <Metric
            key={metric.key}
            label={metric.label}
            home={chartData.homeStats[metric.key]}
            away={chartData.awayStats[metric.key]}
            max={metric.maxVal}
            isPercent={metric.isPercent}
            selected={selectedMetric === metric.key}
            onPress={() => setSelectedMetric(selectedMetric === metric.key ? null : metric.key)}
          />
        ))}
      </View>
      {chartData.periods.length > 0 && (
        <View style={styles.quarters}>
          <Text style={styles.quarterTitle}>{selectedMetricDef ? `${selectedMetricDef.label} by Quarter` : 'Points by Quarter'}</Text>
          <Svg width="100%" height={130} viewBox="0 0 300 130">
            {chartData.periods.map((period, index) => {
              const x = 28 + index * 58;
              const values = chartData.periods.flatMap((p) => [
                selectedMetric ? (p.homeStats?.[selectedMetric] ?? p.home) : p.home,
                selectedMetric ? (p.awayStats?.[selectedMetric] ?? p.away) : p.away,
              ]);
              const max = Math.max(...values, 1);
              const homeValue = selectedMetric ? (period.homeStats?.[selectedMetric] ?? period.home) : period.home;
              const awayValue = selectedMetric ? (period.awayStats?.[selectedMetric] ?? period.away) : period.away;
              const homeH = (homeValue / max) * 82;
              const awayH = (awayValue / max) * 82;
              return (
                <React.Fragment key={period.label}>
                  <Rect x={x} y={92 - homeH} width={18} height={homeH} rx={3} fill={colors.teal} />
                  <Rect x={x + 21} y={92 - awayH} width={18} height={awayH} rx={3} fill={colors.pink} />
                  <SvgText x={x + 9} y={88 - homeH} fill={colors.teal} fontSize="8" textAnchor="middle">{fmt(homeValue, selectedMetricDef?.isPercent)}</SvgText>
                  <SvgText x={x + 30} y={88 - awayH} fill={colors.pink} fontSize="8" textAnchor="middle">{fmt(awayValue, selectedMetricDef?.isPercent)}</SvgText>
                  <SvgText x={x + 20} y={114} fill={colors.muted} fontSize="10" textAnchor="middle">{period.label}</SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      )}
    </View>
  );
}

function Header({ isPregame }: { isPregame: boolean }) {
  return (
    <View style={styles.header}>
      <Text style={shared.eyebrow}>{isPregame ? 'Season Averages' : 'Game Stats'}</Text>
      {isPregame && (
        <View style={styles.pregameBadge}>
          <Text style={styles.pregameText}>Pregame</Text>
        </View>
      )}
    </View>
  );
}

function Metric({
  label,
  home,
  away,
  max,
  isPercent,
  selected,
  onPress,
}: {
  label: string;
  home: number;
  away: number;
  max: number;
  isPercent?: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const homeHasEdge = label === 'TOV' ? home < away : home > away;
  const awayHasEdge = label === 'TOV' ? away < home : away > home;
  return (
    <Pressable onPress={onPress} style={[styles.metric, selected && styles.metricSelected]}>
      <Text style={styles.value}>{fmt(home, isPercent)}</Text>
      <View style={styles.barWrap}><View style={[styles.homeBar, { width: `${Math.min((home / max) * 100, 100)}%` }]} /></View>
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.edge}>{homeHasEdge ? 'SAS' : awayHasEdge ? 'OPP' : 'EVEN'}</Text>
      </View>
      <View style={styles.barWrap}><View style={[styles.awayBar, { width: `${Math.min((away / max) * 100, 100)}%` }]} /></View>
      <Text style={[styles.value, styles.awayValue]}>{fmt(away, isPercent)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  pregameBadge: { borderWidth: 1, borderColor: 'rgba(245,130,32,0.3)', backgroundColor: 'rgba(245,130,32,0.1)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  pregameText: { color: colors.orange, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, textTransform: 'uppercase' },
  metrics: { gap: 10 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 4 },
  metricSelected: { backgroundColor: 'rgba(255,255,255,0.04)' },
  value: { minWidth: 44, textAlign: 'right', color: colors.teal, fontSize: 12, fontWeight: '900' },
  awayValue: { textAlign: 'left', color: colors.pink },
  labelWrap: { width: 38, alignItems: 'center' },
  label: { textAlign: 'center', color: colors.muted, fontSize: 9, fontWeight: '900' },
  edge: { color: colors.faint, fontSize: 7, fontWeight: '900', marginTop: 1 },
  barWrap: { flex: 1, height: 8, borderRadius: 999, overflow: 'hidden', backgroundColor: '#27272a' },
  homeBar: { height: 8, alignSelf: 'flex-end', borderRadius: 999, backgroundColor: colors.teal },
  awayBar: { height: 8, borderRadius: 999, backgroundColor: colors.pink },
  quarters: { marginTop: 18 },
  quarterTitle: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase' },
});
