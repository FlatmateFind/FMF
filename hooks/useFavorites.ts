'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

const LS_KEY = 'flatmatefind_favorites';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      // Logged-in: load from Supabase
      supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (error) console.error('useFavorites fetch error:', error);
          setFavorites((data ?? []).map((r) => r.listing_id as string));
          setLoaded(true);
        });
    } else {
      // Not logged in: fall back to localStorage
      try {
        const stored = localStorage.getItem(LS_KEY);
        if (stored) setFavorites(JSON.parse(stored));
      } catch { /* ignore */ }
      setLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const toggle = useCallback(async (id: string) => {
    if (user) {
      const isFav = favorites.includes(id);
      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
        if (error) { console.error('useFavorites toggle delete error:', error); return; }
        setFavorites((prev) => prev.filter((f) => f !== id));
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: id });
        if (error) { console.error('useFavorites toggle insert error:', error); return; }
        setFavorites((prev) => [...prev, id]);
      }
    } else {
      // Not logged in: localStorage fallback
      setFavorites((prev) => {
        const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
        try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, favorites]);

  return { favorites, toggle, isFavorited: (id: string) => favorites.includes(id), loaded };
}
