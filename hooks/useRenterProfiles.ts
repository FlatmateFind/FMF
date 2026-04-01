'use client';
import { useState, useEffect, useMemo } from 'react';
import { RenterProfile, RenterProfileFilters } from '@/lib/types';
import { SEED_RENTER_PROFILES } from '@/data/renterProfiles';
import { filterRenterProfiles } from '@/lib/filterRenterProfiles';

const STORAGE_KEY = 'flatmatefind_renter_profiles';

function readAll(): RenterProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as RenterProfile[];
  } catch {
    return [];
  }
}

export function useRenterProfiles(filters?: RenterProfileFilters) {
  const [allProfiles, setAllProfiles] = useState<RenterProfile[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let data = readAll();
    // Seed demo profiles if none exist yet
    if (data.length === 0) {
      data = SEED_RENTER_PROFILES;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      // Merge seed profiles that aren't already present (so real user profiles coexist)
      const existingIds = new Set(data.map((p) => p.userId));
      const missing = SEED_RENTER_PROFILES.filter((p) => !existingIds.has(p.userId));
      if (missing.length > 0) {
        data = [...data, ...missing];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    }
    setAllProfiles(data);
    setLoaded(true);
  }, []);

  const profiles = useMemo(
    () => (filters ? filterRenterProfiles(allProfiles, filters) : allProfiles),
    [allProfiles, filters]
  );

  return { profiles, allProfiles, loaded };
}
