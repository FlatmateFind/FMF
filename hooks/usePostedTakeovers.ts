'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TakeoverListing } from '@/data/takeovers';

// Map DB row to TakeoverListing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDB(row: any): TakeoverListing {
  return {
    id: row.id,
    suburb: row.suburb ?? '',
    city: row.city ?? '',
    state: row.state ?? '',
    postcode: row.postcode ?? '',
    propertyType: (row.property_type as TakeoverListing['propertyType']) ?? 'apartment',
    bedrooms: row.bedrooms ?? 1,
    bathrooms: row.bathrooms ?? 1,
    rent: Number(row.rent_amount ?? 0),
    bond: 0,
    availableFrom: row.available_from ?? '',
    leaseEndDate: row.lease_end ?? undefined,
    agencyName: undefined,
    agentOpenToNew: false,
    furnished: (row.furnished as TakeoverListing['furnished']) ?? 'unfurnished',
    inclusions: [],
    description: row.description ?? '',
    contactName: row.contact_name ?? '',
    contactEmail: row.contact_email ?? '',
    postedAt: row.posted_at,
    status: (row.status === 'taken' ? 'filled' : row.status === 'paused' ? 'closed' : 'active') as TakeoverListing['status'],
    postedByUserId: row.user_id,
    images: row.images ?? [],
  };
}

// Map TakeoverListing to DB insert shape
function toDB(listing: TakeoverListing, userId: string) {
  return {
    id: listing.id,
    user_id: userId,
    suburb: listing.suburb,
    city: listing.city,
    state: listing.state,
    postcode: listing.postcode,
    property_type: listing.propertyType,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    rent_amount: listing.rent,
    furnished: listing.furnished,
    available_from: listing.availableFrom || null,
    lease_end: listing.leaseEndDate || null,
    description: listing.description,
    images: listing.images ?? [],
    status: listing.status === 'filled' ? 'taken' : listing.status === 'closed' ? 'paused' : 'active',
    posted_at: listing.postedAt,
  };
}

export function usePostedTakeovers(userId?: string) {
  const [all, setAll] = useState<TakeoverListing[]>([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setAll([]);
      setLoaded(true);
      return;
    }
    supabase
      .from('takeovers')
      .select('*')
      .eq('user_id', userId)
      .order('posted_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('usePostedTakeovers fetch error:', error);
        setAll((data ?? []).map(fromDB));
        setLoaded(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const mine = userId ? all.filter((t) => t.postedByUserId === userId) : all;

  const add = useCallback(async (listing: TakeoverListing) => {
    if (!userId) return;
    const row = toDB(listing, userId);
    const { data, error } = await supabase
      .from('takeovers')
      .insert(row)
      .select()
      .single();
    if (error) { console.error('usePostedTakeovers add error:', error); return; }
    setAll((prev) => [fromDB(data), ...prev]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleStatus = useCallback(async (id: string) => {
    if (!userId) return;
    const current = all.find((t) => t.id === id);
    if (!current) return;
    const newStatus = current.status === 'active' ? 'closed' : 'active';
    const dbStatus = newStatus === 'closed' ? 'paused' : 'active';
    const { error } = await supabase
      .from('takeovers')
      .update({ status: dbStatus })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) { console.error('usePostedTakeovers toggleStatus error:', error); return; }
    setAll((prev) => prev.map((t) => t.id === id ? { ...t, status: newStatus as TakeoverListing['status'] } : t));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, all]);

  const markFilled = useCallback(async (id: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('takeovers')
      .update({ status: 'taken' })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) { console.error('usePostedTakeovers markFilled error:', error); return; }
    setAll((prev) => prev.map((t) => t.id === id ? { ...t, status: 'filled' as const } : t));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const remove = useCallback(async (id: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('takeovers')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) { console.error('usePostedTakeovers remove error:', error); return; }
    setAll((prev) => prev.filter((t) => t.id !== id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { all, mine, add, toggleStatus, markFilled, remove, loaded };
}
