import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, shared } from '../lib/theme';

export type ShopItem = {
  id: string;
  name: string;
  eyebrow: string;
  price: string;
  copy: string;
  detail: string;
  image?: 'jersey' | 'hoodie' | 'cap' | 'ball' | 'tee' | 'tumbler';
  swatch: string;
  category: string;
  availability: string;
  pickupWindow: string;
};

const SIZES = ['S', 'M', 'L', 'XL', '2XL'] as const;
type Size = (typeof SIZES)[number];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'fiesta-jersey',
    name: 'Fiesta Edition Jersey',
    eyebrow: "Tonight's Fit",
    price: '$119',
    copy: 'Match the players in the Fiesta kit they are wearing under the lights tonight.',
    detail:
      'Built for the broadcast shot and the concourse walk: lightweight mesh feel, bold Fiesta color, and a game-night profile that looks like the locker room.',
    image: 'jersey',
    swatch: colors.teal,
    category: 'Jerseys',
    availability: 'Limited sizes',
    pickupWindow: 'Ready tonight',
  },
  {
    id: 'court-hoodie',
    name: 'Courtside Fleece Hoodie',
    eyebrow: 'Arena Layer',
    price: '$78',
    copy: 'Warm-up tunnel comfort with a clean Spurs wordmark and soft heavyweight fleece.',
    detail:
      'The layer fans grab for late tipoffs, cold walks back to the car, and every road-game watch party.',
    image: 'hoodie',
    swatch: colors.pink,
    category: 'Outerwear',
    availability: 'In stock',
    pickupWindow: '20 min pickup',
  },
  {
    id: 'draft-cap',
    name: 'Classic Logo Cap',
    eyebrow: 'Everyday Staple',
    price: '$34',
    copy: 'Structured black crown, silver mark, curved brim. Simple enough to wear every day.',
    detail:
      'A low-risk, high-rotation fan-shop piece for game day, gym bags, flights, and summer league.',
    image: 'cap',
    swatch: colors.orange,
    category: 'Headwear',
    availability: 'In stock',
    pickupWindow: '15 min pickup',
  },
  {
    id: 'mini-ball',
    name: 'Spurs Mini Ball',
    eyebrow: 'Kids & Collectors',
    price: '$24',
    copy: 'A shelf piece that can still handle hallway shots during halftime.',
    detail:
      "Small enough for autographs, durable enough for indoor hoops, and easy to toss in a kid's game-day backpack.",
    image: 'ball',
    swatch: '#c4ced4',
    category: 'Collectibles',
    availability: 'Arena exclusive',
    pickupWindow: 'Fan shop only',
  },
  {
    id: 'wemby-tee',
    name: 'Wemby Name & Number Tee',
    eyebrow: 'Player Pick',
    price: '$42',
    copy: 'Soft black cotton tee with a clean back print and silver chest mark.',
    detail:
      'A lighter everyday piece for fans who want player gear without going full jersey. Made for watch parties, travel days, and summer runs.',
    image: 'tee',
    swatch: colors.teal,
    category: 'Player Gear',
    availability: 'Best seller',
    pickupWindow: '20 min pickup',
  },
  {
    id: 'travel-tumbler',
    name: 'Spurs Travel Tumbler',
    eyebrow: 'Arena Essential',
    price: '$29',
    copy: 'Stainless-look game-day tumbler with the primary mark and Fiesta accent band.',
    detail:
      'A practical add-on built for commutes, morning-after recaps, and keeping the Spurs mark in rotation beyond game night.',
    image: 'tumbler',
    swatch: colors.orange,
    category: 'Accessories',
    availability: 'In stock',
    pickupWindow: '10 min pickup',
  },
];

function ProductArt({ item, large = false }: { item: ShopItem; large?: boolean }) {
  if (item.image === 'jersey') {
    return (
      <View style={[styles.art, large && styles.artLarge]}>
        <Image
          source={require('../assets/spurs-fiesta-jersey.png')}
          style={large ? styles.jerseyLarge : styles.jersey}
        />
      </View>
    );
  }

  return <ProductIllustration item={item} large={large} />;
}

function ProductIllustration({ item, large = false }: { item: ShopItem; large?: boolean }) {
  const scaleStyle = large && styles.artLarge;
  return (
    <View style={[styles.art, scaleStyle]}>
      {item.image === 'hoodie' && (
        <View style={[styles.hoodie, large && styles.hoodieLarge]}>
          <View style={styles.hoodieHood} />
          <Text style={styles.productWordmark}>SPURS</Text>
          <View style={styles.hoodiePocket} />
        </View>
      )}
      {item.image === 'cap' && (
        <View style={[styles.capWrap, large && styles.capWrapLarge]}>
          <View style={[styles.capCrown, { backgroundColor: item.swatch }]} />
          <View style={styles.capBrim} />
          <Text style={styles.capLogo}>SA</Text>
        </View>
      )}
      {item.image === 'ball' && (
        <View style={[styles.ball, large && styles.ballLarge]}>
          <View style={styles.ballLineVertical} />
          <View style={styles.ballLineHorizontal} />
          <View style={styles.ballArcLeft} />
          <View style={styles.ballArcRight} />
        </View>
      )}
      {item.image === 'tee' && (
        <View style={[styles.tee, large && styles.teeLarge]}>
          <Text style={styles.teeNumber}>1</Text>
          <Text style={styles.teeName}>WEMBY</Text>
        </View>
      )}
      {item.image === 'tumbler' && (
        <View style={[styles.tumbler, large && styles.tumblerLarge]}>
          <View style={[styles.tumblerBand, { backgroundColor: item.swatch }]} />
          <Text style={styles.tumblerLogo}>SA</Text>
        </View>
      )}
      <View style={styles.productShine} />
    </View>
  );
}

export function FanShopCarousel({ onOpen }: { onOpen: (itemId: string) => void }) {
  const [index, setIndex] = useState(0);
  const item = SHOP_ITEMS[index];
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const advanceRef = useRef<(() => void) | undefined>(undefined);

  advanceRef.current = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -14, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setIndex((i) => (i + 1) % SHOP_ITEMS.length);
      slideAnim.setValue(14);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 120, useNativeDriver: true }),
      ]).start();
    });
  };

  useEffect(() => {
    const timer = setInterval(() => advanceRef.current?.(), 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <Pressable
      onPress={() => onOpen(item.id)}
      style={({ pressed }) => [shared.panel, pressed && styles.pressed]}
    >
      <View style={styles.carouselHeader}>
        <Text style={shared.eyebrow}>Fan Shop</Text>
        <View style={styles.dots}>
          {SHOP_ITEMS.map((entry, dotIndex) => (
            <View
              key={entry.id}
              style={[
                styles.dot,
                dotIndex === index && { backgroundColor: item.swatch, width: 18 },
              ]}
            />
          ))}
        </View>
      </View>
      <Animated.View style={[styles.carouselRow, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
        <ProductArt item={item} />
        <View style={styles.carouselText}>
          <Text style={[styles.itemEyebrow, { color: item.swatch }]} numberOfLines={1}>{item.eyebrow}</Text>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={shared.body} numberOfLines={2}>{item.copy}</Text>
          <Text style={styles.meta} numberOfLines={1}>{item.category} · {item.availability}</Text>
          <Text style={styles.tap} numberOfLines={1}>Tap to open Fan Shop</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function FanShop({
  initialItemId,
  onBack,
}: {
  initialItemId?: string;
  onBack: () => void;
}) {
  const initialIndex = Math.max(
    0,
    SHOP_ITEMS.findIndex((item) => item.id === initialItemId),
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [selectedSize, setSelectedSize] = useState<Size>('L');
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const fade = useRef(new Animated.Value(1)).current;
  const burst = useRef(new Animated.Value(0)).current;
  const item = SHOP_ITEMS[selectedIndex];
  const related = useMemo(() => SHOP_ITEMS.filter((entry) => entry.id !== item.id), [item.id]);

  useEffect(() => {
    fade.setValue(0.78);
    Animated.spring(fade, {
      toValue: 1,
      friction: 7,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [fade, selectedIndex]);

  function selectItem(index: number) {
    setSelectedIndex(index);
    setOrdered(false);
    setLoading(false);
    setOrderNumber(null);
  }

  function handleBuy() {
    if (ordered || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrdered(true);
      setOrderNumber(Math.floor(Math.random() * 90000) + 10000);
      burst.setValue(0);
      Animated.timing(burst, { toValue: 1, duration: 1100, useNativeDriver: true }).start();
    }, 800);
  }

  return (
    <>
      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>Back to game</Text>
      </Pressable>
      <Animated.View
        style={[
          shared.panel,
          {
            opacity: fade,
            transform: [
              { scale: fade.interpolate({ inputRange: [0.78, 1], outputRange: [0.98, 1] }) },
            ],
          },
        ]}
      >
        <Text style={shared.eyebrow}>Spurs Fan Shop</Text>
        <View style={styles.detailHero}>
          <ProductArt item={item} large />
          <View style={{ flex: 1 }}>
            <Text style={[styles.itemEyebrow, { color: item.swatch }]}>{item.eyebrow}</Text>
            <Text style={styles.detailName}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.category}</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.availability}</Text></View>
            </View>
          </View>
        </View>
        <Text style={[shared.body, styles.detailCopy]}>{item.detail}</Text>

        {item.image === 'jersey' && (
          <View style={styles.sizeBlock}>
            <Text style={styles.sizeLabel}>Size</Text>
            <View style={styles.sizes}>
              {SIZES.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[
                    styles.size,
                    selectedSize === size && {
                      borderColor: item.swatch,
                      backgroundColor: 'rgba(0,178,169,0.1)',
                    },
                  ]}
                >
                  <Text style={[styles.sizeText, selectedSize === size && { color: item.swatch }]}>
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View>
          <Pressable
            onPress={handleBuy}
            disabled={loading || ordered}
            style={[
              styles.buy,
              { shadowColor: item.swatch },
              ordered && styles.buyDone,
              loading && styles.buyLoading,
            ]}
          >
            <Text style={[styles.buyText, ordered && styles.buyDoneText]}>
              {ordered ? 'Order Confirmed' : loading ? 'Processing...' : 'Buy Now'}
            </Text>
          </Pressable>
          <Celebration value={burst} />
        </View>

        <View style={[styles.pickup, ordered && styles.pickupReady]}>
          <Text style={styles.pickupTitle}>Pick up at the Fan Shop</Text>
          <Text style={styles.pickupCopy}>Section 221 - Frost Bank Center - {item.pickupWindow}</Text>
          {ordered && orderNumber !== null && (
            <Text style={styles.ready}>Ready for pickup in 20 min - Order #{orderNumber}</Text>
          )}
        </View>
      </Animated.View>
      <View style={shared.panel}>
        <Text style={shared.eyebrow}>More Gear</Text>
        <View style={styles.related}>
          {related.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() =>
                selectItem(SHOP_ITEMS.findIndex((candidate) => candidate.id === entry.id))
              }
              style={styles.relatedCard}
            >
              <ProductArt item={entry} />
              <Text style={styles.relatedName}>{entry.name}</Text>
              <Text style={styles.relatedPrice}>{entry.price}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
}

function Celebration({ value }: { value: Animated.Value }) {
  const pieces = [
    { x: -130, y: -52,  rot: -80,  bg: colors.teal,   w: 10, h: 6  },
    { x: -105, y: -85,  rot:  50,  bg: colors.orange,  w: 6,  h: 11 },
    { x: -78,  y: -58,  rot: -120, bg: '#fff',          w: 11, h: 5  },
    { x: -52,  y: -95,  rot:  100, bg: colors.pink,     w: 5,  h: 10 },
    { x: -28,  y: -70,  rot: -40,  bg: colors.orange,   w: 9,  h: 7  },
    { x:  -6,  y: -105, rot:  70,  bg: '#fff',           w: 7,  h: 9  },
    { x:  20,  y: -72,  rot: -90,  bg: colors.teal,     w: 11, h: 5  },
    { x:  45,  y: -98,  rot:  120, bg: colors.orange,   w: 5,  h: 10 },
    { x:  70,  y: -60,  rot: -30,  bg: '#fff',           w: 9,  h: 6  },
    { x:  96,  y: -88,  rot:  80,  bg: colors.pink,     w: 6,  h: 11 },
    { x: 118,  y: -50,  rot: -110, bg: colors.orange,   w: 10, h: 5  },
    { x: -148, y: -30,  rot:  40,  bg: '#fff',           w: 7,  h: 8  },
    { x:  142, y: -35,  rot: -60,  bg: colors.teal,     w: 7,  h: 8  },
    { x: -65,  y:  28,  rot:  130, bg: colors.orange,   w: 7,  h: 7  },
    { x:   0,  y:  36,  rot: -100, bg: colors.pink,     w: 6,  h: 8  },
    { x:  60,  y:  30,  rot:  60,  bg: '#fff',           w: 8,  h: 6  },
    { x: -110, y: -110, rot:  20,  bg: colors.teal,     w: 5,  h: 7  },
    { x:  105, y: -108, rot: -30,  bg: colors.orange,   w: 5,  h: 7  },
  ];

  return (
    <View pointerEvents="none" style={styles.burst}>
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            width: p.w,
            height: p.h,
            borderRadius: 2,
            backgroundColor: p.bg,
            opacity: value.interpolate({
              inputRange:  [0, 0.04, 0.5, 1],
              outputRange: [0, 1,    0.9, 0],
            }),
            transform: [
              { translateX: value.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, p.x, p.x * 1.25] }) },
              { translateY: value.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, p.y, p.y + 60] }) },
              { rotate: value.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.rot}deg`] }) },
              { scale: value.interpolate({ inputRange: [0, 0.18, 0.55, 1], outputRange: [0, 1.3, 1, 0.55] }) },
            ],
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.86 },
  carouselHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#3f3f46' },
  carouselRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  carouselText: { flex: 1, gap: 4 },
  itemEyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 1.3, textTransform: 'uppercase' },
  itemName: { color: colors.text, fontSize: 17, fontWeight: '900', lineHeight: 20 },
  meta: { color: colors.faint, fontSize: 10, fontWeight: '800', marginTop: 2 },
  tap: {
    color: colors.faint,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  art: {
    width: 88,
    height: 88,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  artLarge: { width: 132, height: 132, borderRadius: 18 },
  jersey: { width: 78, height: 78, resizeMode: 'contain' },
  jerseyLarge: { width: 120, height: 120, resizeMode: 'contain' },
  productShape: {
    width: 58,
    height: 48,
    borderRadius: 16,
    transform: [{ rotate: '-8deg' }],
    opacity: 0.88,
  },
  productShapeLarge: { width: 90, height: 74, borderRadius: 24 },
  productShine: {
    position: 'absolute',
    width: 120,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    transform: [{ rotate: '-28deg' }],
  },
  hoodie: {
    width: 62,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#20232a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(232,51,138,0.44)',
  },
  hoodieLarge: { width: 96, height: 90, borderRadius: 26 },
  hoodieHood: {
    position: 'absolute',
    top: -11,
    width: 36,
    height: 30,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: 'rgba(232,51,138,0.44)',
  },
  productWordmark: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  hoodiePocket: {
    position: 'absolute',
    bottom: 10,
    width: 28,
    height: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  capWrap: { width: 66, height: 40, alignItems: 'center', justifyContent: 'flex-end' },
  capWrapLarge: { transform: [{ scale: 1.45 }] },
  capCrown: {
    width: 50,
    height: 30,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  capBrim: {
    width: 64,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#111',
    marginTop: -5,
    transform: [{ rotate: '-4deg' }],
  },
  capLogo: { position: 'absolute', top: 12, color: '#111', fontSize: 10, fontWeight: '900' },
  ball: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#c4ced4',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  ballLarge: { width: 92, height: 92, borderRadius: 46 },
  ballLineVertical: { position: 'absolute', left: '47%', top: -8, bottom: -8, width: 2, backgroundColor: '#101014' },
  ballLineHorizontal: { position: 'absolute', left: -8, right: -8, top: '48%', height: 2, backgroundColor: '#101014' },
  ballArcLeft: {
    position: 'absolute',
    left: -18,
    top: 4,
    width: 34,
    height: 50,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#101014',
  },
  ballArcRight: {
    position: 'absolute',
    right: -18,
    top: 4,
    width: 34,
    height: 50,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#101014',
  },
  tee: {
    width: 62,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#0b0b0d',
    borderWidth: 2,
    borderColor: 'rgba(0,178,169,0.46)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teeLarge: { width: 96, height: 90, borderRadius: 18 },
  teeNumber: { color: '#fff', fontSize: 24, fontWeight: '900', lineHeight: 26 },
  teeName: { color: colors.teal, fontSize: 8, fontWeight: '900', letterSpacing: 1.1 },
  tumbler: {
    width: 42,
    height: 68,
    borderRadius: 13,
    backgroundColor: '#d4d4d8',
    borderWidth: 2,
    borderColor: '#f4f4f5',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tumblerLarge: { width: 64, height: 104, borderRadius: 18 },
  tumblerBand: { position: 'absolute', left: 0, right: 0, bottom: 18, height: 12 },
  tumblerLogo: { color: '#111', fontSize: 12, fontWeight: '900' },
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
  detailHero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  detailName: { color: colors.text, fontSize: 24, fontWeight: '900', lineHeight: 28, marginTop: 4 },
  price: { color: colors.orange, fontSize: 18, fontWeight: '900', marginTop: 8 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: colors.panelSoft,
  },
  badgeText: { color: colors.muted, fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 },
  detailCopy: { marginTop: 16 },
  sizeBlock: { marginTop: 18 },
  sizeLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  size: {
    width: 42,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3f3f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: { color: colors.muted, fontSize: 12, fontWeight: '900' },
  buy: {
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.teal,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  buyLoading: { backgroundColor: '#27272a', shadowOpacity: 0 },
  buyDone: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.36)',
    shadowOpacity: 0,
  },
  buyText: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  buyDoneText: { color: '#34d399' },
  burst: { position: 'absolute', left: 0, right: 0, top: 10, alignItems: 'center' },
  pickup: {
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    padding: 12,
  },
  pickupReady: { borderColor: 'rgba(16,185,129,0.36)', backgroundColor: 'rgba(16,185,129,0.08)' },
  pickupTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  pickupCopy: { color: colors.muted, fontSize: 12, marginTop: 3 },
  ready: { color: '#34d399', fontSize: 11, fontWeight: '900', marginTop: 8 },
  related: { gap: 10, marginTop: 14 },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    borderRadius: 14,
    padding: 10,
  },
  relatedName: { flex: 1, color: colors.text, fontSize: 13, fontWeight: '900' },
  relatedPrice: { color: colors.orange, fontSize: 13, fontWeight: '900' },
});
