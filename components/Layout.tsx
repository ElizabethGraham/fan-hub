import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { teamLogoUrl } from '@/lib/nba';

const FIESTA_SASH = `linear-gradient(
  135deg,
  transparent 0%, transparent 46%,
  rgba(0, 178, 169, 0.72) 46%, rgba(0, 178, 169, 0.72) 49%,
  rgba(232, 51, 138, 0.72) 49%, rgba(232, 51, 138, 0.72) 52%,
  rgba(245, 130, 32, 0.72) 52%, rgba(245, 130, 32, 0.72) 55%,
  transparent 55%, transparent 100%
)`;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        className="fixed inset-0"
        style={{
          zIndex: -3,
          background:
            'radial-gradient(circle at 50% 0%, rgba(39,39,42,0.45), transparent 34%), #09090b',
        }}
      />
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 h-52 sm:h-64 opacity-70"
        style={{
          zIndex: -2,
          background: `${FIESTA_SASH}, linear-gradient(180deg, rgba(9,9,11,0.2), #09090b 78%)`,
          maskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none fixed left-0 top-0 hidden h-screen w-1 sm:block"
        style={{
          zIndex: -1,
          background: 'linear-gradient(180deg, #00b2a9 0%, #e8338a 48%, #f58220 100%)',
        }}
      />

      <div className="min-h-screen overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-black focus:text-zinc-950"
        >
          Skip to main content
        </a>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:max-w-5xl lg:px-8 2xl:max-w-6xl">
          <header className="mb-10">
            <Link
              href="/"
              aria-label="Go to Spurs Fan Hub home"
              className="inline-flex items-center gap-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fiesta-teal/70 focus:ring-offset-2 focus:ring-offset-background"
            >
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <Image
                  src={teamLogoUrl('SAS')}
                  alt="San Antonio Spurs"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                  Spurs Fan Hub
                </h1>
                <p className="text-xs font-semibold text-ui-muted uppercase tracking-widest mt-1">
                  Game Day Center
                </p>
              </div>
            </Link>
            <div className="mt-4 h-px bg-linear-to-r from-fiesta-teal/50 via-zinc-800 to-transparent" />
          </header>

          <main id="main-content">{children}</main>
        </div>
      </div>
    </>
  );
}
