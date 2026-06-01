import Layout from "@/components/Layout";

export default function Loading() {
  return (
    <Layout>
      <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900 animate-pulse mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-36 bg-zinc-800 rounded" />
          <div className="h-4 w-6 bg-zinc-800 rounded" />
          <div className="h-5 w-36 bg-zinc-800 rounded" />
        </div>
        <div className="border-t border-zinc-800 my-3" />
        <div className="h-3 w-24 bg-zinc-800 rounded" />
      </div>

      <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900 animate-pulse mb-4">
        <div className="h-3 w-20 bg-zinc-800 rounded mb-4" />
        <div className="h-5 w-64 bg-zinc-800 rounded mb-3" />
        <div className="h-4 w-full bg-zinc-800 rounded" />
      </div>

      <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900 animate-pulse">
        <div className="h-3 w-28 bg-zinc-800 rounded mb-4" />
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-zinc-800 rounded mb-3" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-zinc-800 rounded" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-zinc-800 rounded mb-3" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
