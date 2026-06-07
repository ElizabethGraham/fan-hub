import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../lib/theme';

export default function SignalBackdrop({ color }: { color: string }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 390 360" preserveAspectRatio="none">
        <Path d="M -40 86 L 430 22" stroke="rgba(255,255,255,0.09)" strokeWidth="1.2" />
        <Path d="M -30 132 L 420 72" stroke={color} strokeWidth="1.8" opacity="0.42" />
        <Path d="M -36 250 L 430 175" stroke="rgba(196,206,212,0.13)" strokeWidth="1.3" />
        <Path d="M -20 286 L 410 225" stroke={colors.pink} strokeWidth="1.3" opacity="0.38" />
        <Path d="M 40 332 L 390 282" stroke={colors.orange} strokeWidth="1.3" opacity="0.34" />
        <Rect
          x="52"
          y="56"
          width="286"
          height="210"
          rx="34"
          stroke="rgba(255,255,255,0.075)"
          fill="rgba(255,255,255,0.018)"
        />
        <Rect
          x="73"
          y="78"
          width="244"
          height="166"
          rx="30"
          stroke={color}
          opacity="0.22"
          fill="none"
        />
        <Circle
          cx="195"
          cy="160"
          r="92"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.2"
          fill="none"
        />
        <Circle
          cx="195"
          cy="160"
          r="124"
          stroke={color}
          strokeWidth="1"
          opacity="0.14"
          fill="none"
        />
      </Svg>
    </View>
  );
}
