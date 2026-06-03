import Layout from '@/components/Layout';

function SkeletonCard() {
  return (
    <div className="surface-panel p-4 sm:p-5 animate-pulse">
      {/* Teams row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-zinc-800 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="h-2 w-8 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="px-2 sm:px-3">
          <div className="h-3 w-5 bg-zinc-800 rounded" />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <div className="space-y-1.5 text-right">
            <div className="h-3 w-20 bg-zinc-800 rounded ml-auto" />
            <div className="h-2 w-8 bg-zinc-800 rounded ml-auto" />
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-zinc-800 shrink-0" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <div className="h-6 w-12 bg-zinc-800 rounded-lg" />
        <div className="h-3 w-16 bg-zinc-800 rounded mx-auto" />
        <div className="h-5 w-14 bg-zinc-800 rounded-full" />
      </div>

      {/* Blurb */}
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full bg-zinc-800 rounded" />
        <div className="h-3 w-3/4 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

function SkeletonPlayoffSnapshot() {
  return (
    <div className="surface-panel p-4 sm:p-6 animate-pulse">
      <div className="h-3 w-32 bg-zinc-800 rounded mb-5" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-zinc-800/60 rounded-xl p-3 space-y-2">
            <div className="h-2 w-10 bg-zinc-800 rounded" />
            <div className="h-5 w-12 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 bg-zinc-800/60 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function SkeletonSection({ cards = 2 }: { cards?: number }) {
  return (
    <section>
      <div className="mb-3">
        <div className="h-3 w-28 bg-zinc-800 rounded animate-pulse" />
        <div className="h-2.5 w-48 bg-zinc-800 rounded mt-1.5 animate-pulse" />
      </div>
      <div className="grid gap-3">
        {[...Array(cards)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <Layout>
      <div className="grid gap-6">
        {/* Featured / Next Up */}
        <section>
          <div className="mb-3">
            <div className="h-3 w-16 bg-fiesta-teal/30 rounded animate-pulse" />
            <div className="h-2.5 w-56 bg-zinc-800 rounded mt-1.5 animate-pulse" />
          </div>
          <SkeletonCard />
        </section>

        {/* Playoff snapshot */}
        <SkeletonPlayoffSnapshot />

        {/* Recent Results */}
        <SkeletonSection cards={2} />

        {/* Upcoming */}
        <SkeletonSection cards={2} />
      </div>
    </Layout>
  );
}
