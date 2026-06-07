import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { teamLogoUrl } from '../../lib/nba';
import SignalBackdrop from './SignalBackdrop';

export default function LocationHero({ color }: { color: string }) {
  return (
    <View style={styles.heroCenter}>
      <SignalBackdrop color={color} />

      <View style={styles.accessStack}>
        <View style={[styles.accessPass, { borderColor: `${color}66` }]}>
          <View style={styles.passTopline}>
            <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.passLogo} />
            <View style={styles.passCode}>
              <View style={[styles.passCodeBar, { backgroundColor: color }]} />
              <View style={styles.passCodeBar} />
              <View style={[styles.passCodeBar, { width: 20 }]} />
            </View>
          </View>
          <Text style={styles.passEyebrow}>VENUE ACCESS</Text>
          <Text style={styles.passTitle}>Frost Bank Center</Text>
          <Text style={styles.passMeta}>Gate 3 - Parking Lot B - 18 min</Text>

          <View style={styles.routePanel}>
            <Svg width="100%" height="84" viewBox="0 0 260 84">
              <Path
                d="M 18 61 C 54 22 88 72 122 37 C 154 5 180 34 203 24 C 226 15 236 30 244 19"
                stroke={color}
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d="M 18 61 C 54 22 88 72 122 37 C 154 5 180 34 203 24 C 226 15 236 30 244 19"
                stroke="rgba(255,255,255,0.24)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                opacity="0.22"
              />
              <Circle cx="18" cy="61" r="6" fill="#111217" stroke={color} strokeWidth="2.4" />
              <Circle cx="244" cy="19" r="6" fill={color} />
              <Rect x="68" y="12" width="42" height="8" rx="4" fill="rgba(255,255,255,0.14)" />
              <Rect x="148" y="60" width="64" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
              <Line
                x1="35"
                y1="18"
                x2="52"
                y2="18"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <Line
                x1="216"
                y1="61"
                x2="237"
                y2="61"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </Svg>
          </View>
        </View>
      </View>

      <Text style={[styles.venueLabel, { color }]}>FROST BANK CENTER</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCenter: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  accessStack: {
    width: 306,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessPass: {
    width: 286,
    borderRadius: 24,
    backgroundColor: 'rgba(14,15,20,0.94)',
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
  },
  passTopline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  passLogo: { width: 42, height: 42, resizeMode: 'contain' },
  passCode: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  passCodeBar: {
    width: 8,
    height: 28,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  passEyebrow: {
    color: '#8f949e',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  passTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 3 },
  passMeta: { color: '#a1a1aa', fontSize: 12, fontWeight: '700', marginTop: 5 },
  routePanel: {
    marginTop: 15,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  venueLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
});
