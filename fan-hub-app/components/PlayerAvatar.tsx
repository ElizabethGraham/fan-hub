import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/theme';

type Props = {
  firstName: string;
  lastName: string;
  reference?: string;
  size?: 'sm' | 'md';
  featured?: boolean;
};

export default function PlayerAvatar({
  firstName,
  lastName,
  reference,
  size = 'md',
  featured = false,
}: Props) {
  const [showImage, setShowImage] = useState(Boolean(reference));
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`;
  const px = size === 'sm' ? 40 : featured ? 52 : 44;

  return (
    <View style={[styles.avatar, { width: px, height: px, borderRadius: px / 2 }, featured && styles.featured]}>
      {showImage && reference ? (
        <Image
          source={{ uri: `https://cdn.nba.com/headshots/nba/latest/1040x760/${reference}.png` }}
          style={[styles.image, { width: px, height: px }]}
          onError={() => setShowImage(false)}
        />
      ) : (
        <Text style={[styles.initials, size === 'sm' && styles.initialsSmall]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#27272a',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featured: {
    borderColor: 'rgba(0,178,169,0.35)',
    backgroundColor: 'rgba(0,178,169,0.08)',
  },
  image: { resizeMode: 'cover' },
  initials: { color: colors.text, fontSize: 12, fontWeight: '900' },
  initialsSmall: { fontSize: 10 },
});
