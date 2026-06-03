import Layout from '@/components/Layout';

function Bone({ className }: { className: string }) {
  return <div className={`bg-zinc-800 rounded animate-pulse ${className}`} />;
}

function SkeletonKeyMatchup() {
  return (
    <div className="surface-panel p-4 sm:p-6 animate-pulse">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="space-y-2 min-w-0">
          <Bone className="h-2.5 w-20" />
          <Bone className="h-5 w-48" />
        </div>
        <Bone className="h-6 w-16 rounded-full shrink-0" />
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-5">
        <div className="flex flex-col items-center gap-2">
          <Bone className="h-12 w-12 rounded-full" />
          <Bone className="h-3 w-16" />
          <Bone className="h-7 w-10" />
        </div>
        <Bone className="h-4 w-4" />
        <div className="flex flex-col items-center gap-2">
          <Bone className="h-12 w-12 rounded-full" />
          <Bone className="h-3 w-16" />
          <Bone className="h-7 w-10" />
        </div>
      </div>

      {/* Blurb lines */}
      <div className="space-y-2">
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-4/5" />
        <Bone className="h-3 w-3/5" />
      </div>
    </div>
  );
}

function SkeletonTeamComparison() {
  return (
    <div className="surface-panel p-4 sm:p-6 animate-pulse">
      <Bone className="h-2.5 w-28 mb-5" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Bone className="h-2 w-8" />
              <Bone className="h-2 w-12" />
              <Bone className="h-2 w-8" />
            </div>
            <Bone className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonStartingLineups() {
  return (
    <div className="surface-panel p-4 sm:p-6 animate-pulse">
      <Bone className="h-2.5 w-32 mb-5" />
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((side) => (
          <div key={side} className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Bone className="h-7 w-7 rounded-full shrink-0" />
                <Bone className="h-3 w-24" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonPlayersToWatch() {
  return (
    <div className="surface-panel p-4 sm:p-6 animate-pulse">
      <Bone className="h-2.5 w-36 mb-4" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3 flex items-center gap-3">
            <Bone className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-3 w-32" />
              <Bone className="h-2.5 w-20" />
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, j) => (
                <Bone key={j} className="h-8 w-10 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonCharts() {
  return (
    <div className="surface-panel p-4 sm:p-6 animate-pulse">
      <Bone className="h-2.5 w-24 mb-4" />
      {/* Stat pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[...Array(6)].map((_, i) => (
          <Bone key={i} className="h-7 w-12 rounded-full" />
        ))}
      </div>
      {/* Chart area */}
      <Bone className="h-32 w-full rounded-xl" />
    </div>
  );
}

function SkeletonFanZone() {
  return (
    <div className="surface-panel p-4 sm:p-6 animate-pulse">
      <Bone className="h-2.5 w-20 mb-2" />
      <Bone className="h-4 w-40 mb-5" />
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <Bone key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <Layout>
      <SkeletonKeyMatchup />
      <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4">
        <SkeletonTeamComparison />
        <SkeletonStartingLineups />
        <SkeletonPlayersToWatch />
        <SkeletonCharts />
        <SkeletonFanZone />
      </div>
    </Layout>
  );
}
