import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../lib/theme';
import { OnboardingBackdropRevamp, SpursMark, nbaHeadshot } from './OnboardingPrimitivesRevamp';

const ALERTS = [
  { title: 'Starting five posted', body: 'Wembanyama, Fox, Castle, Vassell, Sochan', time: 'now' },
  { title: 'Close game watch', body: 'Spurs within 3 with 4:12 left', time: '2m' },
  { title: 'Reward saved', body: 'Dot Race coupon added to Wallet', time: '6m' },
];

export default function NotificationsHeroRevamp({ color }: { color: string }) {
  const intro = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const introAnim = Animated.timing(intro, { toValue: 1, duration: 620, useNativeDriver: true });
    const floatAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ]),
    );

    introAnim.start();
    floatAnim.start();
    return () => {
      introAnim.stop();
      floatAnim.stop();
    };
  }, [float, intro]);

  return (
    <View style={styles.root}>
      <OnboardingBackdropRevamp accent={color} />
      <Animated.View
        style={[
          styles.stream,
          {
            opacity: intro,
            transform: [
              { translateY: intro.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) },
            ],
          },
        ]}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <SpursMark size={34} />
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.headerTitle}>Spurs alerts</Text>
          <Text style={styles.headerMeta}>Personalized and game-aware</Text>
        </View>

        <Animated.View
          style={[
            styles.alertStack,
            {
              transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }],
            },
          ]}
        >
          {ALERTS.map((alert, index) => (
            <View key={alert.title} style={[styles.alertCard, { marginLeft: index * 10 }]}>
              <View style={styles.alertTop}>
                <Image source={{ uri: nbaHeadshot(index === 0 ? '1641705' : index === 1 ? '1628368' : '1642264') }} style={styles.alertAvatar} />
                <Text style={styles.alertApp}>SPURS</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
              <Text style={styles.alertTitle} numberOfLines={1}>{alert.title}</Text>
              <Text style={styles.alertBody} numberOfLines={1}>{alert.body}</Text>
            </View>
          ))}
        </Animated.View>
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
  stream: {
    width: '86%',
    maxWidth: 348,
    gap: 12,
  },
  headerCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    backgroundColor: 'rgba(8,9,11,0.76)',
    padding: 16,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.orange,
    shadowColor: colors.orange,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 18 },
  headerMeta: { color: 'rgba(255,255,255,0.58)', fontSize: 12, fontWeight: '800', marginTop: 4 },
  alertStack: { gap: 9 },
  alertCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(244,244,245,0.94)',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  alertTop: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 7 },
  alertAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#d4d4d8' },
  alertApp: { flex: 1, color: '#27272a', fontSize: 10, fontWeight: '900' },
  alertTime: { color: '#71717a', fontSize: 10, fontWeight: '800' },
  alertTitle: { color: '#111113', fontSize: 14, fontWeight: '900' },
  alertBody: { color: '#52525b', fontSize: 12, fontWeight: '700', marginTop: 3 },
});
