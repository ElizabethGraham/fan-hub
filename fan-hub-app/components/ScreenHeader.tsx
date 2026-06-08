import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shared } from '../lib/theme';

export default function ScreenHeader({
  eyebrow,
  title,
  copy,
  onBack,
  backLabel = 'Back',
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <View style={styles.wrap}>
      {onBack && (
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>{backLabel}</Text>
        </Pressable>
      )}
      <View style={shared.panel}>
        <Text style={shared.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        {copy && <Text style={styles.copy}>{copy}</Text>}
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
  title: { color: colors.text, fontSize: 26, lineHeight: 31, fontWeight: '900', marginTop: 4 },
  copy: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 8 },
});
