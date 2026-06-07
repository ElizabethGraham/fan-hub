import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import GameSection from '../components/GameSection';
import { colors, shared } from '../lib/theme';
import type { HomePageData } from '../lib/homePageData';
import type { GameDisplay } from '../lib/types';

export default function ScheduleScreen({
  homeData,
  loading,
  onGamePress,
}: {
  homeData: HomePageData | null;
  loading: boolean;
  onGamePress: (game: GameDisplay) => void;
}) {
  if (loading || !homeData) {
    return (
      <View style={shared.panel}>
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }

  const { sections } = homeData;
  return (
    <View style={styles.sectionWrap}>
      <Text style={shared.eyebrow}>2024-25 Season</Text>
      <Text style={[shared.title, styles.title]}>Schedule</Text>
      <GameSection title="Upcoming" description="Next scheduled matchups." games={sections.confirmedUpcoming} onGamePress={onGamePress} />
      <GameSection title="Recent Results" description="Latest completed games." games={sections.recent} onGamePress={onGamePress} />
      <GameSection title="Possible Playoff Dates" description="Conditional postseason games." games={sections.possibleUpcoming} onGamePress={onGamePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: { gap: 0 },
  title: { marginTop: 4, marginBottom: 16 },
});
