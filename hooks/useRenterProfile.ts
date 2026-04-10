'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { RenterProfile } from '@/lib/types';

// Convert DB row → RenterProfile
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

// Convert RenterProfile → DB upsert row
function toDB(data: Omit<RenterProfile, 'userId' | 'name' | 'createdAt' | 'updatedAt'>, userId: string, name: string) {
  return {
    user_id: userId,
    name,
    age: data.age,
    nationality: data.nationality,
    bio: data.aboutMe,
    budget_min: data.budgetMin ?? 0,
    budget_max: data.budgetMax ?? 0,
    preferred_state: data.preferredStates?.[0] ?? '',
    move_in_date: data.moveInDate || null,
    phone: data.phone ?? '',
    active: data.status !== 'inactive',
    profile_data: {
      photo: data.photo,
      preferredRoomTypes: data.preferredRoomTypes,
      preferredStates: data.preferredStates,
      preferredCities: data.preferredCities,
      minimumStay: data.minimumStay,
      preferredFacilities: data.preferredFacilities,
      preferredStayType: data.preferredStayType,
      furnishedPreference: data.furnishedPreference,
      houseGenderPreference: data.houseGenderPreference,
      petsOk: data.petsOk,
      smokingOk: data.smokingOk,
      showPhone: data.showPhone,
      showEmail: data.showEmail,
    },
    updated_at: new Date().toISOString(),
  };
}

export function useRenterProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<RenterProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoaded(true);
      return;
    }
    supabase
      .from('renter_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('useRenterProfile fetch error:', error);
        setProfile(data ? fromDB(data) : null);
        setLoaded(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const save = useCallback(
    async (data: Omit<RenterProfile, 'userId' | 'name' | 'createdAt' | 'updatedAt'>) => {
      if (!user) return;
      const row = toDB(data, user.id, user.name);
      const { data: saved, error } = await supabase
        .from('renter_profiles')
        .upsert(row, { onConflict: 'user_id' })
        .select()
        .single();
      if (error) { console.error('useRenterProfile save error:', error); return; }
      setProfile(fromDB(saved));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.id, user?.name]
  );

  const clear = useCallback(async () => {
    if (!user) return;
    const { error } = await supabase
      .from('renter_profiles')
      .delete()
      .eq('user_id', user.id);
    if (error) { console.error('useRenterProfile clear error:', error); return; }
    setProfile(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const deactivate = useCallback(async () => {
    if (!user || !profile) return;
    const newActive = profile.status === 'inactive';
    const { data: updated, error } = await supabase
      .from('renter_profiles')
      .update({ active: newActive, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) { console.error('useRenterProfile deactivate error:', error); return; }
    setProfile(fromDB(updated));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, profile]);

  return { profile, loaded, save, clear, deactivate };
}
