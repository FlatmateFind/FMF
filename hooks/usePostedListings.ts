'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface PostedListing {
  id: string;
  title: string;
  type: string;
  state: string;
  city: string;
  suburb: string;
  postcode: string;
  address: string;
  rentAmount: number;
  currency: string;
  period: string;
  bedrooms: number;
  bathrooms: number;
  furnished?: string;
  currentOccupants?: number;
  totalCapacity?: number;
  preferredNationalities?: string[];
  preferredGender?: string;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  description?: string;
  availableFrom: string;
  minimumStay?: string;
  postedAt: string;
  status: 'active' | 'paused' | 'taken';
  contactName: string;
  inclusions?: string[];
  facilities?: string[];
  stayType?: string;
  rules?: string[];
  nearbyPlaces?: import('@/lib/types').NearbyPlace[];
  roomFeatures?: string[];
  roomCategories?: string[];
  postLanguage?: string;
  languages?: string[];
}

// Map DB snake_case row to PostedListing camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDB(row: any): PostedListing {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    state: row.state,
    city: row.city,
    suburb: row.suburb,
    postcode: row.postcode ?? '',
    address: row.address ?? '',
    rentAmount: Number(row.rent_amount),
    currency: row.currency ?? 'AUD',
    period: row.rent_period ?? 'week',
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    furnished: row.furnished,
    currentOccupants: row.current_occupants,
    totalCapacity: row.total_capacity,
    preferredNationalities: row.preferred_nationality ?? [],
    preferredGender: row.preferred_gender ?? 'any',
    petsAllowed: row.pets_allowed ?? false,
    smokingAllowed: row.smoking_allowed ?? false,
    description: row.description ?? '',
    availableFrom: row.available_from ?? '',
    minimumStay: row.minimum_stay ?? '',
    postedAt: row.posted_at,
    status: row.status as PostedListing['status'],
    contactName: row.contact_name ?? '',
    inclusions: row.inclusions ?? [],
    facilities: row.facilities ?? [],
    stayType: row.stay_type,
    rules: row.rules ?? [],
    roomFeatures: row.room_features ?? [],
    roomCategories: row.room_categories ?? [],
    postLanguage: row.post_language,
    languages: row.languages ?? [],
  };
}

// Map PostedListing camelCase to DB snake_case insert shape
function toDB(listing: PostedListing, userId: string) {
  return {
    id: listing.id,
    user_id: userId,
    title: listing.title,
    type: listing.type,
    state: listing.state,
    city: listing.city,
    suburb: listing.suburb,
    postcode: listing.postcode,
    address: listing.address,
    rent_amount: listing.rentAmount,
    currency: listing.currency,
    rent_period: listing.period,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    furnished: listing.furnished,
    current_occupants: listing.currentOccupants,
    total_capacity: listing.totalCapacity,
    preferred_nationality: listing.preferredNationalities ?? [],
    preferred_gender: listing.preferredGender ?? 'any',
    pets_allowed: listing.petsAllowed ?? false,
    smoking_allowed: listing.smokingAllowed ?? false,
    description: listing.description ?? '',
    available_from: listing.availableFrom || null,
    minimum_stay: listing.minimumStay ?? '',
    status: listing.status,
    inclusions: listing.inclusions ?? [],
    facilities: listing.facilities ?? [],
    stay_type: listing.stayType,
    rules: listing.rules ?? [],
    room_features: listing.roomFeatures ?? [],
    room_categories: listing.roomCategories ?? [],
    post_language: listing.postLanguage,
    languages: listing.languages ?? [],
    posted_at: listing.postedAt,
  };
}

export function usePostedListings() {
  const { user } = useAuth();
  const [posted, setPosted] = useState<PostedListing[]>([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setPosted([]);
      setLoaded(true);
      return;
    }
    supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .order('posted_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('usePostedListings fetch error:', error);
        setPosted((data ?? []).map(fromDB));
        setLoaded(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const add = useCallback(async (listing: PostedListing) => {
    if (!user) return;
    const row = toDB(listing, user.id);
    const { data, error } = await supabase
      .from('listings')
      .insert(row)
      .select()
      .single();
    if (error) { console.error('usePostedListings add error:', error); return; }
    setPosted((prev) => [fromDB(data), ...prev]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const toggleStatus = useCallback(async (id: string) => {
    if (!user) return;
    const current = posted.find((l) => l.id === id);
    if (!current) return;
    const newStatus = current.status === 'active' ? 'paused' : 'active';
    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) { console.error('usePostedListings toggleStatus error:', error); return; }
    setPosted((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l) as PostedListing[]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, posted]);

  const markTaken = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('listings')
      .update({ status: 'taken', updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) { console.error('usePostedListings markTaken error:', error); return; }
    setPosted((prev) => prev.map((l) => l.id === id ? { ...l, status: 'taken' as const } : l));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const remove = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) { console.error('usePostedListings remove error:', error); return; }
    setPosted((prev) => prev.filter((l) => l.id !== id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return { posted, add, toggleStatus, markTaken, remove, loaded };
}
