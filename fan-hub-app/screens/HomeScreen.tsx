import { Text, View } from 'react-native';
import FeaturedGame from '../components/FeaturedGame';
import GameSection from '../components/GameSection';
import PlayoffSnapshot from '../components/PlayoffSnapshot';
import { shared } from '../lib/theme';
import type { HomePageData } from '../lib/homePageData';
import type { GameDisplay } from '../lib/types';

export default function HomeScreen({
  data,
  onGamePress,
}: {
  data: HomePageData;
  onGamePress: (game: GameDisplay) => void;
}) {
  const { sections } = data;
  if (!sections.featured) {
    return (
      <View style={shared.panel}>
        <Text style={shared.body}>No games found for this season.</Text>
      </View>
    );
  }

  const liveGames =
    sections.featured.status === 'live'
      ? [sections.featured, ...sections.live.filter((game) => game.id !== sections.featured?.id)]
      : sections.live;
  const nextUp = sections.confirmedUpcoming[0] ?? sections.featured;
  const upcoming = sections.confirmedUpcoming.filter((game) => game.id !== nextUp.id);
  const hasLiveGames = liveGames.length > 0;

  return (
    <>
      {hasLiveGames && (
        <>
          <GameSection title="Live Updates" description="Games in progress right now." games={liveGames} onGamePress={onGamePress} />
          {data.playoffSnapshot && <PlayoffSnapshot data={data.playoffSnapshot} />}
        </>
      )}
      <FeaturedGame game={nextUp} onPress={onGamePress} />
      {!hasLiveGames && data.playoffSnapshot && <PlayoffSnapshot data={data.playoffSnapshot} />}
      <GameSection title="Recent Results" description="Latest completed games." games={sections.recent} onGamePress={onGamePress} />
      <GameSection title="Upcoming" description="Next scheduled matchups." games={upcoming} onGamePress={onGamePress} />
      <GameSection title="Possible Games" description="Conditional playoff dates." games={sections.possibleUpcoming} onGamePress={onGamePress} />
    </>
  );
}
