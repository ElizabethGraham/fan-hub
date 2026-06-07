How it works:

220 pixels pre-computed once via useMemo — stable positions for the splash lifetime, no per-frame recalculation
One Animated.Value per pixel in a useRef — all 220 opacity animations run entirely on the native thread via useNativeDriver: true, zero JS-thread jank
Diagonal wave timing — each pixel's delay is proportional to its normalised distance from the top-left corner ((col/COLS + row/ROWS) / 2) scaled to 1350ms, with a small ±120ms jitter so pixels don't fire in a hard grid line
Variable brightness — each pixel rises to a random peak (45–90% opacity) so it looks organic rather than uniform
Rise → hold → fall — each pixel has independent rise/hold/fall durations, giving the field a living, textured feel rather than a uniform blink
Palette — weighted toward Spurs silver/white (5 of 9 slots) with fiesta teal/pink/orange as accents; matches the official brand without being garish