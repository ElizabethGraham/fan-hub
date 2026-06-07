'use client';

import Image from 'next/image';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { FIESTA_TEAL, FIESTA_PINK, FIESTA_ORANGE, SPURS_SILVER } from '@/lib/constants';

const SIZES = ['S', 'M', 'L', 'XL', '2XL'] as const;
type Size = (typeof SIZES)[number];

function fireConfetti() {
  const colors = [FIESTA_TEAL, FIESTA_PINK, FIESTA_ORANGE, '#ffffff', SPURS_SILVER];
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.55 }, colors });
  setTimeout(
    () => confetti({ particleCount: 60, spread: 90, origin: { y: 0.45, x: 0.35 }, colors }),
    180,
  );
  setTimeout(
    () => confetti({ particleCount: 60, spread: 90, origin: { y: 0.45, x: 0.65 }, colors }),
    320,
  );
}

export default function JerseyShop() {
  const [selectedSize, setSelectedSize] = useState<Size>('L');
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const handleOrder = () => {
    if (ordered) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrdered(true);
      setOrderNumber(Math.floor(Math.random() * 90000) + 10000);
      fireConfetti();
    }, 800);
  };

  return (
    <div className="surface-panel p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="text-xs font-black text-ui-muted uppercase tracking-widest">Fan Shop</div>
        <span className="text-[9px] font-black text-fiesta-teal uppercase tracking-widest bg-fiesta-teal/10 border border-fiesta-teal/20 px-2 py-0.5 rounded-full">
          New 25-26
        </span>
      </div>

      {/* Mobile: stacked. sm+: side by side */}
      <div className="flex flex-col sm:grid sm:grid-cols-[170px_1fr] gap-4 sm:gap-6 sm:items-start">
        <div className="mx-auto flex w-40 justify-center rounded-xl border border-zinc-800 bg-zinc-950/45 p-3 sm:mx-0 sm:w-full">
          <Image
            src="/spurs-fiesta-jersey.png"
            alt="San Antonio Spurs 2025-26 City Edition Fiesta jersey"
            width={260}
            height={320}
            className="h-auto w-full object-contain drop-shadow-2xl"
            priority={false}
          />
        </div>

        {/* Product details */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[10px] font-black text-ui-muted uppercase tracking-widest">
              2025-26 City Edition
            </div>
            <div className="text-xl font-black text-white leading-tight mt-0.5">Fiesta Jersey</div>
            <div className="text-sm text-ui-muted mt-0.5">#1 · Victor Wembanyama</div>
            <div className="text-2xl font-black text-white mt-3">$189.99</div>
          </div>

          {/* Size selector */}
          <div>
            <div className="text-[9px] font-black text-ui-muted uppercase tracking-widest mb-2">
              Size
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                  className={`w-9 h-9 rounded-lg text-xs font-black border transition-all ${
                    selectedSize === size
                      ? 'border-fiesta-teal bg-fiesta-teal/10 text-fiesta-teal'
                      : 'border-zinc-700 text-ui-muted hover:border-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleOrder}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
              ordered
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                : loading
                  ? 'bg-zinc-800 text-ui-muted cursor-wait'
                  : 'bg-fiesta-teal text-zinc-950 hover:bg-fiesta-teal/90 active:scale-95'
            }`}
          >
            {ordered ? '✓ Order Confirmed!' : loading ? 'Processing...' : 'Order Now'}
          </button>

          {/* Pickup info */}
          <div
            className={`text-xs leading-relaxed transition-all duration-500 ${ordered ? 'text-zinc-300' : 'text-ui-muted'}`}
          >
            <span className="font-bold">📍 Pick up at the Fan Shop</span>
            <br />
            Section 221 · Frost Bank Center · San Antonio
            {ordered && orderNumber !== null && (
              <div className="mt-2 text-[10px] text-emerald-400 font-bold">
                Ready for pickup in 20 min · Order #{orderNumber}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
