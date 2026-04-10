'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

const LS_KEY = 'flatmatefind_shortlist';

export function useShortlist() {
  const { user } = useAuth();
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      supabase
        .from('shortlist')
        .select('renter_profile_id')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (error) console.error('useShortlist fetch error:', error);
          setShortlisted((data ?? []).map((r) => r.renter_profile_id as string));
        });
    } else {
      try {
        const stored = localStorage.getItem(LS_KEY);
        if (stored) setShortlisted(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const toggle = useCallback(async (profileId: string) => {
    if (user) {
      const isShort = shortlisted.includes(profileId);
      if (isShort) {
        const { error } = await supabase
          .from('shortlist')
          .delete()
          .eq('user_id', user.id)
          .eq('renter_profile_id', profileId);
        if (error) { console.error('useShortlist toggle delete error:', error); return; }
        setShortlisted((prev) => prev.filter((f) => f !== profileId));
      } else {
        const { error } = await supabase
          .from('shortlist')
          .insert({ user_id: user.id, renter_profile_id: profileId });
        if (error) { console.error('useShortlist toggle insert error:', error); return; }
        setShortlisted((prev) => [...prev, profileId]);
      }
    } else {
      setShortlisted((prev) => {
        const next = prev.includes(profileId)
          ? prev.filter((f) => f !== profileId)
          : [...prev, profileId];
        try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, shortlisted]);

  return { shortlisted, toggle, isShortlisted: (id: string) => shortlisted.includes(id) };
}
