'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export const REACTION_EMOJIS = ['👍', '❤️', '🏠', '🔥', '😍', '🤔'] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

interface ReactionRow {
  id: string;
  listing_id: string;
  user_id: string | null;
  emoji: string;
}

export function useReactions(listingId: string, userId: string | null) {
  const [counts, setCounts] = useState<Record<ReactionEmoji, number>>(
    () => Object.fromEntries(REACTION_EMOJIS.map((e) => [e, 0])) as Record<ReactionEmoji, number>
  );
  const [myReaction, setMyReaction] = useState<ReactionEmoji | null>(null);
  const supabase = createClient();

  function computeFromRows(rows: ReactionRow[]) {
    const c = Object.fromEntries(REACTION_EMOJIS.map((e) => [e, 0])) as Record<ReactionEmoji, number>;
    for (const r of rows) {
      if (REACTION_EMOJIS.includes(r.emoji as ReactionEmoji)) {
        c[r.emoji as ReactionEmoji] = (c[r.emoji as ReactionEmoji] ?? 0) + 1;
      }
    }
    setCounts(c);
    if (userId) {
      const mine = rows.find((r) => r.user_id === userId);
      setMyReaction(mine ? (mine.emoji as ReactionEmoji) : null);
    }
  }

  useEffect(() => {
    supabase
      .from('reactions')
      .select('*')
      .eq('listing_id', listingId)
      .then(({ data, error }) => {
        if (error) console.error('useReactions fetch error:', error);
        computeFromRows((data ?? []) as ReactionRow[]);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId, userId]);

  const react = useCallback(async (emoji: ReactionEmoji) => {
    if (!userId) return;

    // Fetch current state fresh
    const { data: existing } = await supabase
      .from('reactions')
      .select('*')
      .eq('listing_id', listingId)
      .eq('user_id', userId);

    const currentRow = existing?.[0] as ReactionRow | undefined;

    if (currentRow && currentRow.emoji === emoji) {
      // Toggle off
      await supabase.from('reactions').delete().eq('id', currentRow.id);
    } else if (currentRow) {
      // Switch reaction
      await supabase
        .from('reactions')
        .update({ emoji })
        .eq('id', currentRow.id);
    } else {
      // New reaction
      await supabase
        .from('reactions')
        .insert({ listing_id: listingId, user_id: userId, emoji });
    }

    // Reload counts
    const { data: updated } = await supabase
      .from('reactions')
      .select('*')
      .eq('listing_id', listingId);
    computeFromRows((updated ?? []) as ReactionRow[]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId, userId]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return { counts, myReaction, react, total };
}
