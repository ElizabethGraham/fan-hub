import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  imageUrl?: string;
  optionType: 'size' | 'quantity';
  lowStockSizes?: readonly Size[];
};

const SIZES = ['S', 'M', 'L', 'XL', '2XL'] as const;
type Size = (typeof SIZES)[number];
type OrderStatus = 'idle' | 'reserved' | 'preparing' | 'ready';

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
    optionType: 'size',
    lowStockSizes: ['XL', '2XL'],
  },
  {
    id: 'bexar-origins-hoodie',
    name: 'Bexar Goods Origins Hoodie',
    eyebrow: 'Premium Layer',
    price: '$94.99',
    copy: 'Heavyweight black fleece with minimalist Bexar Goods Co. and Spurs graphics.',
    detail:
      'A premium Spurs Fan Shop exclusive that blends San Antonio heritage with the Silver & Black. Built with heavyweight fleece, a front kangaroo pocket, and clean white sleeve and chest graphics.',
    image: 'hoodie',
    swatch: colors.pink,
    category: 'Outerwear',
    availability: 'Ships in 1-3 days',
    pickupWindow: 'Fan shop pickup',
    imageUrl: 'https://cdn11.bigcommerce.com/s-bjbio4l8pu/images/stencil/1280x1280/products/6484/12863/14723_SAS_NBA_Bexar_X_Spurs_Origins_SMU_URBAN_HOOD_BLK_Laydown_Front__04655.1758754349.png?c=2',
    optionType: 'size',
    lowStockSizes: ['2XL'],
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
    imageUrl: 'https://fanatics.frgimages.com/san-antonio-spurs/mens-new-era-black-san-antonio-spurs-official-team-color-59fifty-fitted-hat_pi2561000_altimages_ff_2561380alt1_full.jpg?_hv=2&w=1018',
    optionType: 'quantity',
  },
  {
    id: 'wemby-basketball',
    name: 'Wilson Wembanyama Basketball',
    eyebrow: 'Collector Pick',
    price: '$39.99',
    copy: 'Black and silver Wilson player-series ball built around the Spurs star.',
    detail:
      'A size 7 Wilson player-series basketball with Victor Wembanyama artwork and Spurs detailing. It works as a display piece, a shootaround ball, or a clean gift for a fan collection.',
    image: 'ball',
    swatch: '#c4ced4',
    category: 'Collectibles',
    availability: 'Ships in 1-3 days',
    pickupWindow: 'Fan shop pickup',
    imageUrl: 'https://cdn11.bigcommerce.com/s-bjbio4l8pu/images/stencil/1280x1280/products/4908/10916/ALU_127027_0045__07901.1734908354.png?c=2',
    optionType: 'quantity',
  },
  {
    id: 'wemby-all-star-tee',
    name: 'Wembanyama All-Star Tee',
    eyebrow: 'Player Pick',
    price: '$39.99',
    copy: 'Stone New Era tee with Victor Wembanyama All-Star graphics.',
    detail:
      'A New Era 2025 All-Star Game Victor Wembanyama tee in a neutral stone colorway. It keeps the player focus without going full jersey and fits easily into an everyday rotation.',
    image: 'tee',
    swatch: colors.teal,
    category: 'Player Gear',
    availability: 'Ships in 1-3 days',
    pickupWindow: 'Fan shop pickup',
    imageUrl: 'https://cdn11.bigcommerce.com/s-bjbio4l8pu/images/stencil/1280x1280/products/5601/11395/60626546_NE0104001_MNBA25ASGVG2195_SAASPUWEM_STN_3QL__71111.1739558549.jpg?c=2',
    optionType: 'size',
    lowStockSizes: ['S'],
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
    imageUrl: 'https://fanatics.frgimages.com/san-antonio-spurs/san-antonio-spurs-team-logo-18oz-personalized-roadie-tumbler_pi4987000_altimages_ff_4987246-f90c03c4ff1d6e60f0c5alt1_full.jpg?_hv=2&w=1018',
    optionType: 'quantity',
  },
];

function ProductArt({ item, large = false }: { item: ShopItem; large?: boolean }) {
  if (item.imageUrl) {
    return (
      <View style={[styles.art, large && styles.artLarge]}>
        <Image
          source={{ uri: item.imageUrl }}
          style={large ? styles.productPhotoLarge : styles.productPhoto}
        />
      </View>
    );
  }

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
  const [quantity, setQuantity] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle');
  const fade = useRef(new Animated.Value(1)).current;
  const confirmation = useRef(new Animated.Value(0)).current;
  const item = SHOP_ITEMS[selectedIndex];
  const related = useMemo(() => SHOP_ITEMS.filter((entry) => entry.id !== item.id), [item.id]);
  const subtotal = Number(item.price.replace(/[^0-9.]/g, '')) * quantity;
  const pickupGlowOpacity = confirmation.interpolate({
    inputRange: [0, 0.42, 1],
    outputRange: [0, 0.42, 0.16],
  });
  const receiptStyle = {
    opacity: confirmation,
    transform: [
      {
        translateY: confirmation.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: confirmation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        }),
      },
    ],
  };

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
    setQuantity(1);
    setCheckoutOpen(false);
    setOrderStatus('idle');
    confirmation.setValue(0);
  }

  function handleBuy() {
    if (ordered || loading) return;
    setCheckoutOpen(true);
  }

  function confirmPickupOrder() {
    if (ordered || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCheckoutOpen(false);
      setOrdered(true);
      setOrderStatus('reserved');
      setOrderNumber(Math.floor(Math.random() * 90000) + 10000);
      confirmation.setValue(0);
      Animated.spring(confirmation, {
        toValue: 1,
        friction: 8,
        tension: 90,
        useNativeDriver: true,
      }).start();
      setTimeout(() => setOrderStatus('preparing'), 900);
      setTimeout(() => setOrderStatus('ready'), 1900);
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

        <View style={styles.fulfillmentSummary}>
          <View style={styles.fulfillmentRow}>
            <Text style={styles.fulfillmentLabel}>Fulfillment</Text>
            <Text style={styles.fulfillmentValue}>Arena pickup</Text>
          </View>
          <View style={styles.fulfillmentRow}>
            <Text style={styles.fulfillmentLabel}>Ready</Text>
            <Text style={styles.fulfillmentValue}>{item.pickupWindow}</Text>
          </View>
          <View style={styles.fulfillmentRow}>
            <Text style={styles.fulfillmentLabel}>Options</Text>
            <Text style={styles.fulfillmentValue}>
              {item.optionType === 'size' ? 'Choose size at checkout' : 'Choose quantity at checkout'}
            </Text>
          </View>
        </View>

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
            <View style={styles.buyContent}>
              {ordered && (
                <View style={styles.checkMark}>
                  <Text style={styles.checkMarkText}>✓</Text>
                </View>
              )}
              <Text style={[styles.buyText, ordered && styles.buyDoneText]}>
                {ordered ? 'Saved to Account' : loading ? 'Processing...' : 'Reserve for Pickup'}
              </Text>
            </View>
          </Pressable>
        </View>

        {ordered && orderNumber !== null && (
          <Animated.View style={[styles.receipt, receiptStyle]}>
            <View>
              <Text style={styles.receiptEyebrow}>Saved to account</Text>
              <Text style={styles.receiptTitle}>Order #{orderNumber}</Text>
            </View>
            <View style={styles.receiptMeta}>
              <Text style={styles.receiptMetaLabel}>Item</Text>
              <Text style={styles.receiptMetaValue}>{quantity} × {item.name}</Text>
            </View>
            <View style={styles.receiptMeta}>
              <Text style={styles.receiptMetaLabel}>Status</Text>
              <Text style={styles.receiptMetaValue}>{statusLabel(orderStatus)}</Text>
            </View>
            <View style={styles.passCode}>
              {Array.from({ length: 22 }).map((_, i) => (
                <View key={i} style={[styles.passBar, { height: i % 3 === 0 ? 34 : i % 2 === 0 ? 24 : 29 }]} />
              ))}
            </View>
          </Animated.View>
        )}

        <View style={[styles.pickup, ordered && styles.pickupReady]}>
          {ordered && <Animated.View pointerEvents="none" style={[styles.pickupGlow, { opacity: pickupGlowOpacity }]} />}
          <Text style={styles.pickupTitle}>Pick up at the Fan Shop</Text>
          <Text style={styles.pickupCopy}>Section 221 - Frost Bank Center - {item.pickupWindow}</Text>
          {ordered && orderNumber !== null && (
            <Text style={styles.ready}>Ready for pickup in 20 min - Order #{orderNumber}</Text>
          )}
        </View>
      </Animated.View>
      <View style={shared.panel}>
        <Text style={shared.eyebrow}>More Gear</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.related}
        >
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
              <Text style={styles.relatedMeta}>{entry.pickupWindow}</Text>
              <Text style={styles.relatedPrice}>{entry.price}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <CheckoutSheet
        visible={checkoutOpen}
        item={item}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        quantity={quantity}
        setQuantity={setQuantity}
        subtotal={subtotal}
        loading={loading}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={confirmPickupOrder}
      />
    </>
  );
}

function statusLabel(status: OrderStatus) {
  switch (status) {
    case 'reserved':
      return 'Reserved';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready for pickup';
    default:
      return 'Pending';
  }
}

function QuantityStepper({ quantity, onChange }: { quantity: number; onChange: (quantity: number) => void }) {
  return (
    <View style={styles.stepper}>
      <Pressable
        disabled={quantity <= 1}
        onPress={() => onChange(Math.max(1, quantity - 1))}
        style={[styles.stepperButton, quantity <= 1 && styles.stepperDisabled]}
      >
        <Text style={styles.stepperText}>−</Text>
      </Pressable>
      <Text style={styles.quantityValue}>{quantity}</Text>
      <Pressable
        disabled={quantity >= 4}
        onPress={() => onChange(Math.min(4, quantity + 1))}
        style={[styles.stepperButton, quantity >= 4 && styles.stepperDisabled]}
      >
        <Text style={styles.stepperText}>+</Text>
      </Pressable>
    </View>
  );
}

function CheckoutSheet({
  visible,
  item,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  subtotal,
  loading,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  item: ShopItem;
  selectedSize: Size;
  setSelectedSize: (size: Size) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  subtotal: number;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable style={styles.sheetScrim} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetEyebrow}>Pickup order</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.sheetClose}>×</Text>
            </Pressable>
          </View>
          <View style={styles.checkoutItem}>
            <ProductArt item={item} />
            <View style={styles.checkoutText}>
              <Text style={styles.checkoutName}>{item.name}</Text>
              <Text style={styles.checkoutDetail}>{item.pickupWindow} · Section 221</Text>
              <Text style={styles.checkoutPrice}>{item.price}</Text>
            </View>
          </View>

          {item.optionType === 'size' ? (
            <View style={styles.sheetSection}>
              <Text style={styles.sizeLabel}>Choose size</Text>
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
                    {item.lowStockSizes?.includes(size) && <Text style={styles.lowStock}>Low</Text>}
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.sheetSection}>
              <Text style={styles.sizeLabel}>Quantity</Text>
              <QuantityStepper quantity={quantity} onChange={setQuantity} />
            </View>
          )}

          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Payment</Text>
              <Text style={styles.totalValue}>Mock account</Text>
            </View>
          </View>

          <Pressable
            disabled={loading}
            onPress={onConfirm}
            style={[styles.confirmButton, loading && styles.buyLoading]}
          >
            <Text style={styles.confirmText}>{loading ? 'Confirming...' : 'Confirm Pickup Order'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
  productPhoto: { width: 88, height: 88, resizeMode: 'contain' },
  productPhotoLarge: { width: 132, height: 132, resizeMode: 'contain' },
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
  fulfillmentSummary: {
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    padding: 12,
    gap: 9,
  },
  fulfillmentRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 14 },
  fulfillmentLabel: { color: colors.faint, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  fulfillmentValue: { flex: 1, color: colors.muted, fontSize: 12, fontWeight: '800', textAlign: 'right' },
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
  lowStock: { color: colors.orange, fontSize: 7, fontWeight: '900', marginTop: 1, textTransform: 'uppercase' },
  stepper: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    overflow: 'hidden',
  },
  stepperButton: {
    width: 42,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  stepperDisabled: { opacity: 0.35 },
  stepperText: { color: colors.text, fontSize: 18, fontWeight: '900', lineHeight: 22 },
  quantityValue: { minWidth: 44, color: colors.text, textAlign: 'center', fontSize: 14, fontWeight: '900' },
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
  buyContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  checkMark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34d399',
  },
  checkMarkText: { color: '#062015', fontSize: 13, fontWeight: '900', lineHeight: 17 },
  buyText: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  buyDoneText: { color: '#34d399' },
  receipt: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    backgroundColor: 'rgba(16,185,129,0.08)',
    padding: 14,
    gap: 12,
  },
  receiptEyebrow: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  receiptTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 3 },
  receiptMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 10,
  },
  receiptMetaLabel: { color: colors.faint, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  receiptMetaValue: { flex: 1, color: colors.muted, fontSize: 12, fontWeight: '800', textAlign: 'right' },
  passCode: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f4f4f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 12,
    marginTop: 2,
  },
  passBar: { width: 3, borderRadius: 2, backgroundColor: '#111113' },
  pickupGlow: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: -34,
    height: 74,
    backgroundColor: '#34d399',
    borderRadius: 999,
  },
  pickup: {
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    padding: 12,
    overflow: 'hidden',
  },
  pickupReady: { borderColor: 'rgba(16,185,129,0.36)', backgroundColor: 'rgba(16,185,129,0.08)' },
  pickupTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  pickupCopy: { color: colors.muted, fontSize: 12, marginTop: 3 },
  ready: { color: '#34d399', fontSize: 11, fontWeight: '900', marginTop: 8 },
  related: { gap: 10, marginTop: 14, paddingRight: 4 },
  relatedCard: {
    width: 142,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    borderRadius: 14,
    padding: 10,
  },
  relatedName: { color: colors.text, fontSize: 12, fontWeight: '900', lineHeight: 16 },
  relatedMeta: { color: colors.faint, fontSize: 10, fontWeight: '800' },
  relatedPrice: { color: colors.orange, fontSize: 13, fontWeight: '900' },
  sheetOverlay: { flex: 1, justifyContent: 'flex-end' },
  sheetScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(196,206,212,0.14)',
    backgroundColor: '#0b0d10',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#3f3f46',
    marginBottom: 2,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetEyebrow: { color: colors.text, fontSize: 20, fontWeight: '900' },
  sheetClose: { color: colors.muted, fontSize: 28, lineHeight: 30, fontWeight: '300' },
  checkoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: 12,
  },
  checkoutText: { flex: 1 },
  checkoutName: { color: colors.text, fontSize: 15, fontWeight: '900', lineHeight: 19 },
  checkoutDetail: { color: colors.muted, fontSize: 12, marginTop: 4 },
  checkoutPrice: { color: colors.orange, fontSize: 14, fontWeight: '900', marginTop: 7 },
  sheetSection: { gap: 8 },
  totalCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelSoft,
    padding: 14,
    gap: 10,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  totalLabel: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  totalValue: { color: colors.text, fontSize: 12, fontWeight: '900' },
  confirmButton: {
    borderRadius: 16,
    backgroundColor: colors.text,
    alignItems: 'center',
    paddingVertical: 15,
  },
  confirmText: { color: colors.bg, fontSize: 13, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' },
});
