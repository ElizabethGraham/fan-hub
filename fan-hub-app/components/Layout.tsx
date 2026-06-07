import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Line, Path, Pattern, Rect } from 'react-native-svg';
import { teamLogoUrl } from '../lib/nba';
import { colors } from '../lib/theme';
import type { ReactNode } from 'react';

export type TabName = 'home' | 'news' | 'schedule' | 'shop' | 'profile';

export default function Layout({
  children,
  routeKey,
  activeTab,
  onTabPress,
  onMockPress,
}: {
  children: ReactNode;
  routeKey: string;
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  onMockPress?: () => void;
}) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [routeKey]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <AppHeader onMockPress={onMockPress} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        {children}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Spurs Fan Hub</Text>
          <Text style={styles.footerText}>Mock mode is active. No Sportradar quota is used.</Text>
        </View>
      </ScrollView>
      <BottomNav activeTab={activeTab} onPress={onTabPress} />
    </SafeAreaView>
  );
}

function AppHeader({ onMockPress }: { onMockPress?: () => void }) {
  return (
    <View style={styles.appHeader}>
      {/* Subtle diagonal texture */}
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern
            id="hatch"
            patternUnits="userSpaceOnUse"
            width="18"
            height="18"
            patternTransform="rotate(45)"
          >
            <Line
              x1="0"
              y1="0"
              x2="0"
              y2="18"
              stroke="#fff"
              strokeWidth="0.7"
              strokeOpacity="0.035"
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#hatch)" />
      </Svg>

      <View style={styles.navRow}>
        {/* Left: Mock badge */}
        <View style={styles.navLeft}>
          {onMockPress && (
            <Pressable onPress={onMockPress} hitSlop={8} style={styles.mockPill}>
              <Text style={styles.mockText}>Mock</Text>
            </Pressable>
          )}
        </View>

        {/* Center: Spurs logo */}
        <View style={styles.navCenter}>
          <Image source={{ uri: teamLogoUrl('SAS') }} style={styles.headerLogo} />
        </View>

        {/* Right: intentionally empty for balance */}
        <View style={styles.navRight} />
      </View>

      {/* Fiesta stripe */}
      <View style={styles.fiestaStripe}>
        <View style={[styles.fiestaSegment, { backgroundColor: colors.teal }]} />
        <View style={[styles.fiestaSegment, { backgroundColor: colors.pink }]} />
        <View style={[styles.fiestaSegment, { backgroundColor: colors.orange }]} />
      </View>
    </View>
  );
}

const TAB_IDS: TabName[] = ['home', 'news', 'schedule', 'shop', 'profile'];

function BottomNav({
  activeTab,
  onPress,
}: {
  activeTab: TabName;
  onPress: (tab: TabName) => void;
}) {
  const { width } = useWindowDimensions();
  const tabWidth = width / TAB_IDS.length;
  const tabs: { id: TabName; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'news', label: 'News' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'shop', label: 'Shop' },
    { id: 'profile', label: 'Profile' },
  ];

  const indicatorX = useRef(new Animated.Value(TAB_IDS.indexOf(activeTab) * tabWidth)).current;

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: TAB_IDS.indexOf(activeTab) * tabWidth,
      friction: 9,
      tension: 50,
      useNativeDriver: true,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, tabWidth]);

  return (
    <View style={styles.bottomNav}>
      {/* Sliding teal pill that follows the active tab */}
      <Animated.View style={[styles.tabIndicator, { width: tabWidth, transform: [{ translateX: indicatorX }] }]} />
      {tabs.map(({ id, label }) => {
        const active = activeTab === id;
        const iconColor = active ? colors.teal : '#52525b';
        return (
          <Pressable key={id} style={styles.tabItem} onPress={() => onPress(id)}>
            <TabIcon tab={id} color={iconColor} />
            <Text style={[styles.tabLabel, active && { color: colors.teal }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function TabIcon({ tab, color }: { tab: TabName; color: string }) {
  const sw = 2;
  const s = 23;

  if (tab === 'home') {
    return (
      <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3,11 L12,3 L21,11 V21 H15 V15 H9 V21 H3 Z"
          stroke={color}
          strokeWidth={sw}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (tab === 'news') {
    return (
      <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth={sw} />
        <Line x1="7" y1="9" x2="17" y2="9" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        <Line
          x1="7"
          y1="13"
          x2="17"
          y2="13"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <Line
          x1="7"
          y1="17"
          x2="13"
          y2="17"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (tab === 'schedule') {
    return (
      <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={sw} />
        <Path
          d="M3,12 Q7.5,8.5 12,12 Q16.5,15.5 21,12"
          stroke={color}
          strokeWidth={sw}
          fill="none"
        />
        <Path
          d="M12,3 Q8.5,7.5 12,12 Q15.5,16.5 12,21"
          stroke={color}
          strokeWidth={sw}
          fill="none"
        />
      </Svg>
    );
  }

  if (tab === 'shop') {
    return (
      <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <Path
          d="M2,3 H5.5 L8,15 H19 L21,8 H7"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="9.5" cy="19.5" r="1.5" stroke={color} strokeWidth={sw} />
        <Circle cx="17.5" cy="19.5" r="1.5" stroke={color} strokeWidth={sw} />
      </Svg>
    );
  }

  // profile
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={sw} />
      <Path
        d="M4,21 Q4,15 12,15 Q20,15 20,21"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  // Header
  appHeader: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  navLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  navCenter: { flex: 1, alignItems: 'center' },
  navRight: { flex: 1 },
  headerLogo: { width: 38, height: 38, resizeMode: 'contain' },
  mockPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.22)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  mockText: {
    color: 'rgba(196,206,212,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  fiestaStripe: { flexDirection: 'row', marginHorizontal: -18, height: 3 },
  fiestaSegment: { flex: 1, opacity: 0.88 },

  // Content
  content: { padding: 16, paddingTop: 18, paddingBottom: 20, gap: 18 },
  footer: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16, marginTop: 4 },
  footerTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  footerText: { color: colors.faint, fontSize: 11, marginTop: 3 },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(196,206,212,0.1)',
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    gap: 3,
    minHeight: 52,
  },
  tabLabel: { color: '#52525b', fontSize: 10, fontWeight: '600', letterSpacing: 0.2 },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    height: 2,
    backgroundColor: colors.teal,
    borderRadius: 1,
  },
});
