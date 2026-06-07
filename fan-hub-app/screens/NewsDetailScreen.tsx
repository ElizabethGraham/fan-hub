import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getNewsItem } from '../lib/news';
import { colors, shared } from '../lib/theme';

export default function NewsDetailScreen({
  id,
  onBack,
  onOpenGame,
}: {
  id: string;
  onBack: () => void;
  onOpenGame: (gameId: string) => void;
}) {
  const item = getNewsItem(id);

  if (!item) {
    return (
      <View style={shared.panel}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>Back to news</Text>
        </Pressable>
        <Text style={[shared.title, styles.missingTitle]}>Article unavailable</Text>
        <Text style={shared.body}>This mock article was not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>Back to news</Text>
      </Pressable>

      <View style={styles.hero}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.dek}>{item.dek}</Text>
      </View>

      {item.bullets && (
        <View style={styles.statStrip}>
          {item.bullets.map((bullet) => (
            <View key={bullet} style={styles.bullet}>
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={shared.panel}>
        {item.body.map((paragraph) => (
          <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>
        ))}
        {item.relatedGameId && (
          <Pressable onPress={() => onOpenGame(item.relatedGameId!)} style={styles.cta}>
            <Text style={styles.ctaText}>Open game center</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  back: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.panel,
  },
  backText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  missingTitle: { marginTop: 14, marginBottom: 6 },
  hero: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(196,206,212,0.12)',
    backgroundColor: '#080c10',
    padding: 18,
    overflow: 'hidden',
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,178,169,0.12)',
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tagText: { color: colors.teal, fontSize: 9, fontWeight: '900', letterSpacing: 1.3 },
  time: { color: colors.faint, fontSize: 11, fontWeight: '800', marginTop: 12 },
  title: { color: colors.text, fontSize: 27, lineHeight: 32, fontWeight: '900', marginTop: 8 },
  dek: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 12 },
  statStrip: { gap: 8 },
  bullet: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,178,169,0.22)',
    backgroundColor: 'rgba(0,178,169,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bulletText: { color: colors.text, fontSize: 12, fontWeight: '900' },
  paragraph: { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 14 },
  cta: {
    marginTop: 4,
    borderRadius: 13,
    backgroundColor: colors.teal,
    alignItems: 'center',
    paddingVertical: 13,
  },
  ctaText: { color: '#061010', fontSize: 12, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
});
