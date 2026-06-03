import GameCard from '@/components/GameCard';
import type { GameDisplay } from '@/lib/types';

type Props = {
  title: string;
  description?: string;
  games: GameDisplay[];
};

export default function GameSection({ title, description, games }: Props) {
  if (games.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xs font-black text-ui-muted uppercase tracking-widest">{title}</h2>
          {description && <p className="mt-1 text-xs text-ui-muted">{description}</p>}
        </div>
      </div>
      <div className="grid gap-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
