import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../lib/theme';
import { OnboardingBackdropRevamp, SpursMark } from './OnboardingPrimitivesRevamp';

export default function LocationHeroRevamp({ color }: { color: string }) {
  const intro = useRef(new Animated.Value(0)).current;
  const passLift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const introAnim = Animated.timing(intro, { toValue: 1, duration: 620, useNativeDriver: true });
    const liftAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(passLift, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(passLift, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ]),
    );

    introAnim.start();
    liftAnim.start();
    return () => {
      introAnim.stop();
      liftAnim.stop();
    };
  }, [intro, passLift]);

  return (
    <View style={styles.root}>
      <OnboardingBackdropRevamp accent={color} />
      <Animated.View
        style={[
          styles.pass,
          {
            opacity: intro,
            transform: [
              { translateY: intro.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
              { translateY: passLift.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
            ],
          },
        ]}
      >
        <View style={styles.passHeader}>
          <SpursMark size={42} />
          <View style={styles.readyPill}>
            <Text style={styles.readyText}>READY</Text>
          </View>
        </View>
        <Text style={styles.passTitle}>Frost Bank Center</Text>
        <Text style={styles.passMeta}>Gate 3 - Lot B - 18 min</Text>

        <View style={styles.mapPanel}>
          <Svg width="100%" height="132" viewBox="0 0 292 132">
            <Rect x="0" y="0" width="292" height="132" rx="22" fill="rgba(255,255,255,0.05)" />
            <Path d="M 18 96 C 56 54 93 106 132 64 C 166 28 199 44 226 28 C 246 16 264 20 276 10" stroke="rgba(255,255,255,0.16)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M 18 96 C 56 54 93 106 132 64 C 166 28 199 44 226 28 C 246 16 264 20 276 10" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <Circle cx="18" cy="96" r="8" fill="#0b0c0f" stroke={color} strokeWidth="3" />
            <Circle cx="276" cy="10" r="8" fill={color} />
            <Rect x="42" y="18" width="62" height="10" rx="5" fill="rgba(255,255,255,0.11)" />
            <Rect x="150" y="92" width="84" height="10" rx="5" fill="rgba(255,255,255,0.09)" />
          </Svg>
        </View>

        <View style={styles.passFooter}>
          <View>
            <Text style={styles.footerLabel}>ENTRY</Text>
            <Text style={styles.footerValue}>Mobile pass</Text>
          </View>
          <View>
            <Text style={styles.footerLabel}>ARRIVE</Text>
            <Text style={styles.footerValue}>6:45 PM</Text>
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
  pass: {
    width: '84%',
    maxWidth: 330,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(8,9,11,0.8)',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.42,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
  },
  passHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  readyPill: {
    borderRadius: 999,
    backgroundColor: 'rgba(0,178,169,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0,178,169,0.36)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  readyText: { color: colors.teal, fontSize: 11, fontWeight: '900' },
  passTitle: { color: '#fff', fontSize: 27, fontWeight: '900', marginTop: 20 },
  passMeta: { color: 'rgba(255,255,255,0.58)', fontSize: 13, fontWeight: '800', marginTop: 5 },
  mapPanel: { marginTop: 16, borderRadius: 22, overflow: 'hidden' },
  passFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    marginTop: 16,
    paddingTop: 14,
  },
  footerLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '900' },
  footerValue: { color: '#fff', fontSize: 13, fontWeight: '900', marginTop: 3 },
});
