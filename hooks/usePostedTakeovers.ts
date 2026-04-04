'use client';
import { useState, useEffect } from 'react';
import { TakeoverListing } from '@/data/takeovers';

const KEY = 'flatmatefind_takeovers';

export function usePostedTakeovers(userId?: string) {
  const [all, setAll] = useState<TakeoverListing[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      setAll(stored ? JSON.parse(stored) : []);
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  const mine = userId ? all.filter((t) => t.postedByUserId === userId) : all;

  function add(listing: TakeoverListing) {
    setAll((prev) => {
      const next = [listing, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function toggleStatus(id: string) {
    setAll((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'active' ? 'closed' : 'active' } : t
      ) as TakeoverListing[];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function markFilled(id: string) {
    setAll((prev) => {
      const next = prev.map((t) => t.id === id ? { ...t, status: 'filled' as const } : t);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function remove(id: string) {
    setAll((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return { all, mine, add, toggleStatus, markFilled, remove, loaded };
}
