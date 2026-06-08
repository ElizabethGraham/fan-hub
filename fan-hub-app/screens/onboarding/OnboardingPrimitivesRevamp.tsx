import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { teamLogoUrl } from '../../lib/nba';
import { colors } from '../../lib/theme';

const SASH_PATH = 'M -54 494 C 68 314 232 276 298 164 C 346 86 350 18 370 -58';
const SASH_STROKE = 26;
const SASH_OFFSET_X = 20;
const SASH_OFFSET_Y = 16;

export function nbaHeadshot(reference: string) {
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${reference}.png`;
}

export function SpursMark({ size = 42 }: { size?: number }) {
  return <Image source={{ uri: teamLogoUrl('SAS') }} style={{ width: size, height: size, resizeMode: 'contain' }} />;
}

export function OnboardingBackdropRevamp({ accent = colors.teal }: { accent?: string }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 390 430" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="revampBase" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#101114" stopOpacity="1" />
            <Stop offset="0.48" stopColor="#050506" stopOpacity="1" />
            <Stop offset="1" stopColor="#15171b" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="revampGlow" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor={accent} stopOpacity="0.22" />
            <Stop offset="0.52" stopColor="#ffffff" stopOpacity="0.035" />
            <Stop offset="1" stopColor={colors.pink} stopOpacity="0.14" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="390" height="430" fill="url(#revampBase)" />
        <Path
          d={SASH_PATH}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={SASH_STROKE * 3 + 10}
          strokeLinecap="butt"
          opacity="0.34"
          fill="none"
        />
        <Path
          d={SASH_PATH}
          stroke={colors.teal}
          strokeWidth={SASH_STROKE}
          strokeLinecap="butt"
          opacity="0.66"
          fill="none"
        />
        <Path
          d={SASH_PATH}
          stroke={colors.pink}
          strokeWidth={SASH_STROKE}
          strokeLinecap="butt"
          opacity="0.62"
          fill="none"
          transform={`translate(${SASH_OFFSET_X} ${SASH_OFFSET_Y})`}
        />
        <Path
          d={SASH_PATH}
          stroke={colors.orange}
          strokeWidth={SASH_STROKE}
          strokeLinecap="butt"
          opacity="0.62"
          fill="none"
          transform={`translate(${SASH_OFFSET_X * 2} ${SASH_OFFSET_Y * 2})`}
        />
        <Rect x="0" y="0" width="390" height="430" fill="url(#revampGlow)" />
      </Svg>
    </View>
  );
}

export function MetricPill({ label, value, tone = colors.teal }: { label: string; value: string; tone?: string }) {
  return (
    <View style={styles.metricPill}>
      <Text style={[styles.metricValue, { color: tone }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metricPill: {
    minWidth: 74,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(8,9,11,0.72)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metricValue: { fontSize: 14, fontWeight: '900' },
  metricLabel: { color: 'rgba(255,255,255,0.58)', fontSize: 10, fontWeight: '800', marginTop: 2 },
});
