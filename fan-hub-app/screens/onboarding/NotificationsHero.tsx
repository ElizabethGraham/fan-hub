import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { teamLogoUrl } from '../../lib/nba';
import SignalBackdrop from './SignalBackdrop';

export default function NotificationsHero({ color }: { color: string }) {
  const streamY = useRef(new Animated.Value(0)).current;
  const firstY = useRef(new Animated.Value(-42)).current;
  const firstOpacity = useRef(new Animated.Value(0)).current;
  const secondY = useRef(new Animated.Value(-38)).current;
  const secondOpacity = useRef(new Animated.Value(0)).current;
  const thirdY = useRef(new Animated.Value(-34)).current;
  const thirdOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(streamY, { toValue: -5, duration: 1800, useNativeDriver: true }),
        Animated.timing(streamY, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(420),
      ]),
    );
    const notificationAnim = Animated.sequence([
      Animated.delay(260),
      Animated.parallel([
        Animated.spring(firstY, { toValue: 0, damping: 16, stiffness: 190, useNativeDriver: true }),
        Animated.timing(firstOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      ]),
      Animated.delay(520),
      Animated.parallel([
        Animated.spring(secondY, {
          toValue: 0,
          damping: 17,
          stiffness: 180,
          useNativeDriver: true,
        }),
        Animated.timing(secondOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
      ]),
      Animated.delay(420),
      Animated.parallel([
        Animated.spring(thirdY, { toValue: 0, damping: 18, stiffness: 170, useNativeDriver: true }),
        Animated.timing(thirdOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]),
    ]);

    floatAnim.start();
    pulseAnim.start();
    notificationAnim.start();

    return () => {
      floatAnim.stop();
      pulseAnim.stop();
      notificationAnim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.heroCenter}>
      <SignalBackdrop color={color} />

      <Animated.View style={[styles.alertStream, { transform: [{ translateY: streamY }] }]}>
        <View style={styles.alertBeaconWrap}>
          <Animated.View
            style={[
              styles.alertBeaconPulse,
              {
                borderColor: color,
                opacity: pulse.interpolate({
                  inputRange: [0, 0.08, 1],
                  outputRange: [0, 0.8, 0],
                }),
                transform: [
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.93, 2.6],
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={styles.alertBeacon}>
            <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.alertLogo} />
          </View>
        </View>
        <Text style={styles.alertKicker}>LIVE ALERT STREAM</Text>

        <View style={styles.notificationTray}>
          <NotificationCard
            opacity={firstOpacity}
            translateY={firstY}
            title="Tip-off in 15 minutes"
            body="Spurs vs Thunder. Lineups are available."
            time="now"
          />
          <NotificationCard
            opacity={secondOpacity}
            translateY={secondY}
            title="Wemby run: 12 points in Q2"
            body="Tap through for shot chart and highlights."
            time="1m"
          />
          <NotificationCard
            opacity={thirdOpacity}
            translateY={thirdY}
            title="Final: Spurs 118, Thunder 111"
            body="Full box score, player grades, and postgame recap."
            time="3m"
          />
        </View>
      </Animated.View>
    </View>
  );
}

function NotificationCard({
  opacity,
  translateY,
  title,
  body,
  time,
}: {
  opacity: Animated.Value;
  translateY: Animated.Value;
  title: string;
  body: string;
  time: string;
}) {
  return (
    <Animated.View style={[styles.iosNotification, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.iosNotificationHeader}>
        <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.iosNotifLogo} />
        <Text style={styles.iosNotifApp}>SPURS</Text>
        <Text style={styles.iosNotifTime}>{time}</Text>
      </View>
      <Text style={styles.iosNotifTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.iosNotifBody} numberOfLines={2}>
        {body}
      </Text>
    </Animated.View>
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
  alertStream: {
    width: 322,
    alignItems: 'center',
    gap: 12,
  },
  alertBeaconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 76,
  },
  alertBeaconPulse: {
    position: 'absolute',
    top: 0,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  alertBeacon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(5,5,7,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
  },
  alertLogo: { width: 46, height: 46, resizeMode: 'contain' },
  alertKicker: {
    color: 'rgba(255,255,255,0.46)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  notificationTray: { width: '100%', gap: 9 },
  iosNotification: {
    borderRadius: 19,
    backgroundColor: 'rgba(246,247,250,0.94)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  iosNotificationHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 5 },
  iosNotifLogo: { width: 20, height: 20, resizeMode: 'contain' },
  iosNotifApp: {
    flex: 1,
    color: '#3f3f46',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  iosNotifTime: { color: '#71717a', fontSize: 10, fontWeight: '700' },
  iosNotifTitle: { color: '#111113', fontSize: 13, fontWeight: '900' },
  iosNotifBody: { color: '#52525b', fontSize: 11, lineHeight: 15, marginTop: 2 },
});
