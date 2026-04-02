'use client';
import { useState, useEffect, useCallback } from 'react';

export const REACTION_EMOJIS = ['👍', '❤️', '🏠', '🔥', '😍', '🤔'] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

interface ReactionEntry {
  listingId: string;
  userId: string;
  emoji: ReactionEmoji;
}

const KEY = 'flatmatefind_reactions';

function load(): ReactionEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function useReactions(listingId: string, userId: string | null) {
  const [counts, setCounts] = useState<Record<ReactionEmoji, number>>(
    () => Object.fromEntries(REACTION_EMOJIS.map((e) => [e, 0])) as Record<ReactionEmoji, number>
  );
  const [myReaction, setMyReaction] = useState<ReactionEmoji | null>(null);

  function compute(all: ReactionEntry[]) {
    const forListing = all.filter((r) => r.listingId === listingId);
    const c = Object.fromEntries(REACTION_EMOJIS.map((e) => [e, 0])) as Record<ReactionEmoji, number>;
    for (const r of forListing) c[r.emoji] = (c[r.emoji] ?? 0) + 1;
    setCounts(c);
    if (userId) {
      const mine = forListing.find((r) => r.userId === userId);
      setMyReaction(mine?.emoji ?? null);
    }
  }

  useEffect(() => {
    compute(load());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId, userId]);

  const react = useCallback((emoji: ReactionEmoji) => {
    if (!userId) return;
    const all = load();
    const existing = all.findIndex((r) => r.listingId === listingId && r.userId === userId);
    let updated: ReactionEntry[];
    if (existing !== -1 && all[existing].emoji === emoji) {
      // Toggle off
      updated = all.filter((_, i) => i !== existing);
    } else if (existing !== -1) {
      // Switch reaction
      updated = all.map((r, i) => i === existing ? { ...r, emoji } : r);
    } else {
      updated = [...all, { listingId, userId, emoji }];
    }
    localStorage.setItem(KEY, JSON.stringify(updated));
    compute(updated);
  }, [listingId, userId]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return { counts, myReaction, react, total };
}
