'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RenterProfile } from '@/lib/types';

const STORAGE_KEY = 'flatmatefind_renter_profiles';

function readAll(): RenterProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as RenterProfile[];
  } catch {
    return [];
  }
}

function writeAll(profiles: RenterProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function useRenterProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<RenterProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) { setProfile(null); setLoaded(true); return; }
    const all = readAll();
    const found = all.find((p) => p.userId === user.id) ?? null;
    setProfile(found);
    setLoaded(true);
  }, [user]);

  const save = useCallback(
    (data: Omit<RenterProfile, 'userId' | 'name' | 'createdAt' | 'updatedAt'>) => {
      if (!user) return;
      const all = readAll();
      const idx = all.findIndex((p) => p.userId === user.id);
      const now = new Date().toISOString();
      const next: RenterProfile = {
        ...data,
        userId: user.id,
        name: user.name,
        createdAt: idx >= 0 ? all[idx].createdAt : now,
        updatedAt: now,
      };
      if (idx >= 0) {
        all[idx] = next;
      } else {
        all.push(next);
      }
      writeAll(all);
      setProfile(next);
    },
    [user]
  );

  const clear = useCallback(() => {
    if (!user) return;
    const all = readAll().filter((p) => p.userId !== user.id);
    writeAll(all);
    setProfile(null);
  }, [user]);

  return { profile, loaded, save, clear };
}
