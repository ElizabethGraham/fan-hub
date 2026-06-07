import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { teamLogoUrl } from '../../lib/nba';
import { colors } from '../../lib/theme';

export default function WelcomeHero({ color }: { color: string }) {
  const rings = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anims = rings.map((r, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 480),
          Animated.timing(r, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(r, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ),
    );
    const floatAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -7, duration: 1900, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1900, useNativeDriver: true }),
      ]),
    );
    const orbitAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(orbit, { toValue: 1, duration: 5200, useNativeDriver: true }),
        Animated.timing(orbit, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    anims.forEach((a) => a.start());
    floatAnim.start();
    orbitAnim.start();
    return () => {
      anims.forEach((a) => a.stop());
      floatAnim.stop();
      orbitAnim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ringColors = [colors.teal, colors.pink, colors.orange, '#c4ced4'];

  return (
    <View style={styles.root}>
      <PremiumBackdrop color={color} />

      <Animated.View style={[styles.stage, { transform: [{ translateY: floatY }] }]}>
        <View pointerEvents="none" style={styles.centerLayer}>
          {rings.map((r, i) => (
            <Animated.View
              key={i}
              style={[
                styles.ring,
                {
                  borderColor: ringColors[i],
                  opacity: r.interpolate({ inputRange: [0, 0.28, 1], outputRange: [0, 0.36, 0] }),
                  transform: [
                    { scale: r.interpolate({ inputRange: [0, 1], outputRange: [0.78, 2.15] }) },
                  ],
                },
              ]}
            />
          ))}
        </View>

        <View pointerEvents="none" style={styles.centerLayer}>
          <Svg width={292} height={292} viewBox="0 0 292 292">
            <Circle
              cx="146"
              cy="146"
              r="120"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              fill="none"
            />
            <Circle
              cx="146"
              cy="146"
              r="92"
              stroke={color}
              strokeWidth="1.2"
              opacity="0.22"
              fill="none"
            />
            <Path
              d="M 42 146 C 86 103 126 102 146 146 C 168 192 207 189 250 146"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.2"
              fill="none"
            />
            <Path
              d="M 42 146 C 86 189 126 190 146 146 C 168 102 207 103 250 146"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1.2"
              fill="none"
            />
          </Svg>
        </View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.orbitTrack,
            {
              transform: [
                {
                  rotate: orbit.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.orbitDot, styles.orbitDotPrimary, { backgroundColor: color }]} />
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.orbitTrack,
            {
              width: 232,
              height: 232,
              transform: [
                {
                  rotate: orbit.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['140deg', '500deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[styles.orbitDot, styles.orbitDotSecondary, { backgroundColor: colors.pink }]}
          />
        </Animated.View>

        <View style={[styles.logoHalo, { borderColor: `${color}66` }]}>
          <View style={styles.logoBackplate}>
            <View style={[styles.logoRing, { borderColor: `${color}42` }]}>
              <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.welcomeLogo} />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function PremiumBackdrop({ color }: { color: string }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 390 360" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="welcomeGlow" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.22" />
            <Stop offset="0.48" stopColor="#ffffff" stopOpacity="0.045" />
            <Stop offset="1" stopColor={colors.pink} stopOpacity="0.13" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="390" height="360" fill="#080c10" />
        <Circle cx="195" cy="164" r="128" fill="url(#welcomeGlow)" opacity="0.7" />
        <Circle
          cx="195"
          cy="164"
          r="96"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
          fill="none"
        />
        <Circle
          cx="195"
          cy="164"
          r="142"
          stroke={color}
          strokeWidth="1"
          opacity="0.12"
          fill="none"
        />
        <Line x1="35" y1="72" x2="355" y2="28" stroke="rgba(255,255,255,0.11)" strokeWidth="1" />
        <Line x1="20" y1="112" x2="372" y2="64" stroke={color} strokeWidth="1.4" opacity="0.28" />
        <Line x1="4" y1="283" x2="386" y2="222" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
        <Line
          x1="44"
          y1="320"
          x2="340"
          y2="272"
          stroke={colors.orange}
          strokeWidth="1.2"
          opacity="0.24"
        />
        <Rect
          x="47"
          y="53"
          width="296"
          height="222"
          rx="40"
          stroke="rgba(255,255,255,0.075)"
          fill="none"
        />
        <Rect
          x="67"
          y="74"
          width="256"
          height="180"
          rx="34"
          stroke={color}
          opacity="0.16"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    width: 292,
    height: 292,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLayer: {
    position: 'absolute',
    width: 292,
    height: 292,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1.2,
  },
  orbitTrack: {
    position: 'absolute',
    width: 276,
    height: 276,
    borderRadius: 138,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orbitDot: {
    borderRadius: 999,
    shadowColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  orbitDotPrimary: { width: 8, height: 8 },
  orbitDotSecondary: { width: 6, height: 6, opacity: 0.86 },
  logoHalo: {
    width: 164,
    height: 164,
    borderRadius: 82,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.018)',
  },
  logoBackplate: {
    width: 138,
    height: 138,
    borderRadius: 69,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5,5,7,0.76)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
  },
  logoRing: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeLogo: { width: 92, height: 92, resizeMode: 'contain' },
});
