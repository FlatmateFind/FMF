'use client';
import { useReactions, REACTION_EMOJIS } from '@/hooks/useReactions';
import { useAuth } from '@/context/AuthContext';

interface Props {
  listingId: string;
}

export default function ListingReactions({ listingId }: Props) {
  const { user } = useAuth();
  const { counts, myReaction, react, total } = useReactions(listingId, user?.id ?? null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {REACTION_EMOJIS.map((emoji) => {
        const count = counts[emoji];
        const active = myReaction === emoji;
        return (
          <button
            key={emoji}
            onClick={() => react(emoji)}
            title={user ? undefined : 'Sign in to react'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all select-none
              ${active
                ? 'bg-teal-50 border-teal-400 text-teal-700 font-semibold shadow-sm scale-105'
                : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50'
              }
              ${!user ? 'cursor-default opacity-80' : 'cursor-pointer'}
            `}
          >
            <span className="text-base leading-none">{emoji}</span>
            {count > 0 && <span className="text-xs font-medium tabular-nums">{count}</span>}
          </button>
        );
      })}
      {total > 0 && (
        <span className="text-xs text-slate-400 ml-1">{total} reaction{total !== 1 ? 's' : ''}</span>
      )}
    </div>
  );
}
