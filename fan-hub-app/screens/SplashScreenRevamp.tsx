import { useEffect, useRef } from 'react';
import { Animated, Image, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { teamLogoUrl } from '../lib/nba';
import { colors } from '../lib/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const SASH_PATH = 'M -45 744 C 128 478 345 406 448 244 C 524 124 533 28 560 -68';
const SASH_LENGTH = 980;

function FrostLogo({ width = 106, color = '#ffffff' }: { width?: number; color?: string }) {
  const height = width * (100.66 / 300);

  return (
    <Svg width={width} height={height} viewBox="0 0 300 100.66">
      <Path
        fill={color}
        d="M157.99,82.22v-3.76c4.64-0.22,6.86-1.33,6.86-4.87V48.6c0-4.42-0.66-5.53-6.86-5.53v-3.76c5.31-0.44,10.39-1.55,13.27-3.32v13.05h0.22c1.99-7.52,7.74-13.05,16.81-13.05l-1.33,8.18c-5.31-0.22-8.4,0.66-10.39,2.43c-3.1,3.1-4.2,8.4-4.2,20.57c0,9.29,0.44,11.28,8.18,11.06v3.76h-22.56V82.22z M271.22,42.19v-3.76c5.53-0.66,9.51-4.2,10.17-13.27h4.42v12.16h7.96c2.65,0,4.42-0.44,5.97-0.88l-1.77,5.97H285.6v28.53c0,5.09,3.1,6.19,11.06,6.19c1.55,0,1.11,0,2.65-0.22l-0.88,5.31c-2.43,0.66-4.42,0.88-7.74,0.88c-6.19,0-12.61-3.32-12.61-9.51V42.63h-6.86V42.19z M237.16,66.07h4.42v2.43c0,7.96,3.54,9.95,10.84,9.95c5.97,0,8.85-2.65,8.85-6.41c0-12.16-24.33-8.63-24.33-24.11c0-5.97,4.42-11.06,14.82-11.5c4.87-0.22,10.84,1.11,14.6,0.44v12.38l-4.42,1.33c0-8.63-4.2-9.29-8.85-9.29c-5.31-0.22-9.29,0.88-9.29,5.09c0,9.73,24.33,7.52,24.33,23.22c0,6.41-3.98,13.27-15.04,13.27c-6.63,0-11.94-1.11-15.92-0.88V66.07z M211.95,77.13c9.29,0,12.16-4.42,12.16-18.58c0-13.05-3.76-16.59-15.26-16.59c-8.85,0-13.27,1.55-13.27,18.8C195.36,71.6,199.79,77.13,211.95,77.13z M115.75,19.41h44.89V34l-4.42,1.33c-0.66-10.17-2.88-11.5-13.93-11.72c-6.86-0.22-10.39,1.33-10.39,8.4v16.14h8.4c5.75,0,6.63-3.76,6.63-8.4h4.42v21.01h-4.42c0-6.63-1.55-7.74-6.41-7.74h-8.63V64.3c0,11.5,1.77,14.15,9.29,13.93v3.76h-25.43v-3.76c4.64,0,8.18-2.43,8.18-7.96V32.9c0-6.86-1.33-9.73-8.18-9.73V19.41z M211.07,35.99c15.04,0,20.13,9.51,20.13,21.45c0,15.26-7.74,25.88-23.44,25.88c-13.49,0-20.13-8.4-20.13-22.12C187.85,44.62,196.47,35.99,211.07,35.99z M40.11,0.83c1.55-0.66,3.54-0.88,5.53-0.66c0.44,0,0.88,0.22,1.33,0.22c5.09,1.11,8.4,5.97,7.3,11.28l-3.98,20.13L40.11,0.83z M21.09,9.23c1.11-1.33,2.65-2.21,4.64-2.88c0.44-0.22,0.88-0.22,1.33-0.22c5.09-1.11,10.17,1.99,11.28,7.3l4.42,19.9L21.09,9.23z M6.94,24.72c0.44-1.55,1.55-3.1,3.1-4.42c0.44-0.44,0.66-0.66,1.11-0.88c4.2-3.1,10.17-2.21,13.27,1.99L36.8,37.76L6.94,24.72z M0.31,44.4c-0.22-1.77,0.22-3.54,1.11-5.31c0.22-0.44,0.44-0.66,0.66-1.11c2.65-4.64,8.4-6.19,12.83-3.54l17.91,9.95H0.31z M2.3,65.19c-0.88-1.55-1.33-3.32-1.33-5.31c0-0.44,0-0.88,0-1.33c0.44-5.31,5.09-9.07,10.39-8.63l20.35,1.99L2.3,65.19z M12.69,83.54c-1.33-0.88-2.43-2.43-3.32-4.42c-0.22-0.44-0.22-0.88-0.44-1.33c-1.55-4.87,1.11-10.39,5.97-11.94l19.46-6.63L12.69,83.54z M29.5,95.93c-1.55-0.44-3.32-1.33-4.87-2.65c-0.22-0.22-0.66-0.66-0.88-0.88c-3.54-3.76-3.32-9.95,0.66-13.49l15.04-13.93L29.5,95.93z M50.07,100.35c-1.55,0.44-3.54,0.22-5.53-0.44c-0.44-0.22-0.88-0.22-1.11-0.44c-4.87-1.99-7.08-7.74-4.87-12.38l8.18-18.8L50.07,100.35z M70.41,96.15c-1.33,0.88-3.1,1.55-5.31,1.77c-0.44,0-0.88,0-1.33,0c-5.31,0-9.51-4.2-9.51-9.51l-0.22-20.57L70.41,96.15z M87.44,83.98c-0.88,1.55-2.21,2.88-3.98,3.76c-0.44,0.22-0.66,0.44-1.11,0.44c-4.87,2.21-10.39,0-12.61-4.64l-8.63-18.58L87.44,83.98z M98.06,65.85c-0.22,1.77-0.88,3.54-2.21,5.09c-0.22,0.44-0.44,0.66-0.88,0.88c-3.54,3.98-9.51,4.2-13.49,0.88L65.99,59.22L98.06,65.85z M100.49,45.06c0.44,1.55,0.66,3.54,0,5.53c0,0.44-0.22,0.88-0.44,1.11c-1.55,5.09-6.86,7.74-11.94,6.19L68.42,51.7L100.49,45.06z M94.08,25.16c1.11,1.33,1.99,2.88,2.43,5.09c0,0.44,0.22,0.88,0.22,1.33c0.66,5.31-3.1,9.95-8.4,10.39L67.98,44.4L94.08,25.16z M80.14,9.68c1.55,0.66,3.1,1.77,4.2,3.54c0.22,0.44,0.44,0.66,0.66,1.11c2.65,4.42,1.11,10.39-3.32,13.05L64,37.76L80.14,9.68z M61.12,1.05c1.77,0,3.54,0.44,5.31,1.55c0.44,0.22,0.66,0.44,1.11,0.66c4.2,3.1,5.31,9.07,2.21,13.27L57.81,33.34L61.12,1.05z"
      />
    </Svg>
  );
}

export default function SplashScreenRevamp({ onDone }: { onDone: () => void }) {
  const { width, height } = useWindowDimensions();
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const lockup = useRef(new Animated.Value(0.9)).current;
  const sashDraw = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    Animated.parallel([
      Animated.sequence([
        Animated.timing(screenOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.delay(1900),
        Animated.timing(screenOpacity, { toValue: 0, duration: 460, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.delay(120),
        Animated.timing(sashDraw, { toValue: 1, duration: 980, useNativeDriver: false }),
      ]),
      Animated.sequence([
        Animated.delay(260),
        Animated.spring(lockup, { toValue: 1, damping: 14, stiffness: 95, useNativeDriver: true }),
      ]),
    ]).start(() => {
      if (mounted) onDone();
    });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoSize = Math.min(width * 0.5, 218);
  const frostWidth = Math.min(width * 0.31, 118);
  const watermarkSize = Math.max(width * 1.72, 680);
  const sashCanvasWidth = width + 220;
  const sashCanvasHeight = height + 180;
  const sashOffset = sashDraw.interpolate({
    inputRange: [0, 1],
    outputRange: [SASH_LENGTH, 0],
  });
  const sashOpacity = sashDraw.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#060608" />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: screenOpacity }]}>
        <View style={styles.baseFill} />

        <Image
          source={{ uri: teamLogoUrl('SAS') }}
          style={[
            styles.watermark,
            {
              width: watermarkSize,
              height: watermarkSize,
              left: (width - watermarkSize) / 2,
              top: height * 0.2,
              transform: [
                { perspective: 820 },
                { rotate: '11deg' },
                { rotateX: '54deg' },
                { translateX: -width * 0.04 },
                { translateY: -watermarkSize * 0.2 },
                { scaleX: 1.08 },
              ],
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.sashStage,
            {
              opacity: sashOpacity,
              width: sashCanvasWidth,
              height: sashCanvasHeight,
            },
          ]}
        >
          <Svg
            width={sashCanvasWidth}
            height={sashCanvasHeight}
            viewBox="0 0 640 980"
            preserveAspectRatio="none"
          >
            <Path
              d={SASH_PATH}
              stroke="rgba(0,0,0,0.16)"
              strokeWidth="122"
              strokeLinecap="round"
              fill="none"
            />
            <AnimatedPath
              d={SASH_PATH}
              stroke={colors.teal}
              strokeWidth="34"
              strokeLinecap="butt"
              fill="none"
              strokeDasharray={SASH_LENGTH}
              strokeDashoffset={sashOffset}
            />
            <AnimatedPath
              d="M -12 768 C 161 502 378 430 481 268 C 557 148 566 52 593 -44"
              stroke={colors.pink}
              strokeWidth="34"
              strokeLinecap="butt"
              fill="none"
              strokeDasharray={SASH_LENGTH}
              strokeDashoffset={sashOffset}
            />
            <AnimatedPath
              d="M 21 792 C 194 526 411 454 514 292 C 590 172 599 76 626 -20"
              stroke={colors.orange}
              strokeWidth="34"
              strokeLinecap="butt"
              fill="none"
              strokeDasharray={SASH_LENGTH}
              strokeDashoffset={sashOffset}
            />
          </Svg>
        </Animated.View>

        <View style={styles.vignetteTop} />

        <Animated.View
          style={[
            styles.lockup,
            {
              transform: [{ scale: lockup }],
            },
          ]}
        >
          <View />
          <Image
            source={{ uri: teamLogoUrl('SAS') }}
            style={[styles.logo, { width: logoSize, height: logoSize }]}
          />
          <View style={styles.sponsorLockup}>
            <View style={styles.sponsorRule} />
            <FrostLogo width={frostWidth} color="rgba(255,255,255,0.88)" />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#060608',
    zIndex: 999,
  },
  baseFill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#060608',
  },
  watermark: {
    position: 'absolute',
    resizeMode: 'contain',
    opacity: 0.032,
  },
  sashStage: {
    position: 'absolute',
    left: -70,
    top: -86,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '28%',
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  lockup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 140,
    backgroundColor: 'rgba(6,6,8,0.54)',
    shadowColor: '#ffffff',
    shadowOpacity: 0.16,
    shadowRadius: 42,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    resizeMode: 'contain',
  },
  sponsorLockup: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  sponsorRule: {
    width: 78,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
});
