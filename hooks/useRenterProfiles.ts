'use client';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RenterProfile, RenterProfileFilters } from '@/lib/types';
import { SEED_RENTER_PROFILES } from '@/data/renterProfiles';
import { filterRenterProfiles } from '@/lib/filterRenterProfiles';

// Convert DB row → RenterProfile (same logic as useRenterProfile)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDB(row: any): RenterProfile {
  const d = row.profile_data ?? {};
  return {
    userId: row.user_id,
    name: row.name,
    photo: d.photo ?? null,
    age: row.age ?? null,
    nationality: row.nationality ?? '',
    aboutMe: row.bio ?? '',
    preferredRoomTypes: d.preferredRoomTypes ?? [],
    preferredStates: d.preferredStates ?? (row.preferred_state ? [row.preferred_state] : []),
    preferredCities: d.preferredCities ?? [],
    budgetMin: row.budget_min ?? null,
    budgetMax: row.budget_max ?? null,
    moveInDate: row.move_in_date ?? null,
    minimumStay: d.minimumStay ?? '',
    preferredFacilities: d.preferredFacilities ?? [],
    preferredStayType: d.preferredStayType,
    furnishedPreference: d.furnishedPreference ?? 'any',
    houseGenderPreference: d.houseGenderPreference ?? 'any',
    petsOk: d.petsOk ?? false,
    smokingOk: d.smokingOk ?? false,
    status: row.active ? 'active' : 'inactive',
    phone: row.phone ?? undefined,
    showPhone: d.showPhone,
    showEmail: d.showEmail,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useRenterProfiles(filters?: RenterProfileFilters) {
  const [dbProfiles, setDbProfiles] = useState<RenterProfile[]>([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('renter_profiles')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('useRenterProfiles fetch error:', error);
        setDbProfiles((data ?? []).map(fromDB));
        setLoaded(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allProfiles = useMemo(() => {
    // Merge seed profiles with DB profiles (DB profiles take precedence over seeds with same userId)
    const dbIds = new Set(dbProfiles.map((p) => p.userId));
    const seedOnly = SEED_RENTER_PROFILES.filter((p) => !dbIds.has(p.userId));
    return [...dbProfiles, ...seedOnly];
  }, [dbProfiles]);

  const profiles = useMemo(
    () => (filters ? filterRenterProfiles(allProfiles, filters) : allProfiles),
    [allProfiles, filters]
  );

  return { profiles, allProfiles, loaded };
}
