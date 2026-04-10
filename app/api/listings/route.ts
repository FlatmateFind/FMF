import { NextRequest, NextResponse } from 'next/server';
import { filterListings } from '@/lib/filterListings';
import { SearchFilters, SortOption, Listing } from '@/lib/types';
import { adminSupabase } from '@/lib/supabase/admin';

// Convert a DB listings row to the standard Listing shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbRowToListing(row: any): Listing {
  return {
    id: row.id,
    title: row.title,
    type: row.type as Listing['type'],
    location: {
      state: row.state ?? '',
      city: row.city ?? '',
      suburb: row.suburb ?? '',
      postcode: row.postcode ?? '',
      address: row.address ?? '',
      country: 'Australia',
    },
    rent: {
      amount: Number(row.rent_amount),
      currency: row.currency ?? 'AUD',
      period: (row.rent_period as 'week' | 'month') ?? 'week',
    },
    inclusions: row.inclusions ?? [],
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    currentOccupants: row.current_occupants ?? 0,
    totalCapacity: row.total_capacity ?? row.bedrooms,
    furnished: (row.furnished as 'furnished' | 'unfurnished') ?? 'unfurnished',
    facilities: row.facilities ?? [],
    roomFeatures: row.room_features ?? [],
    roomCategories: row.room_categories ?? [],
    postLanguage: row.post_language,
    languages: row.languages ?? [],
    preferredNationality: row.preferred_nationality ?? [],
    preferredGender: (row.preferred_gender as 'male' | 'female' | 'any') ?? 'any',
    petsAllowed: row.pets_allowed ?? false,
    smokingAllowed: row.smoking_allowed ?? false,
    availableFrom: row.available_from ?? '',
    minimumStay: row.minimum_stay ?? '',
    stayType: row.stay_type as Listing['stayType'],
    rules: row.rules ?? [],
    images: row.images ?? [],
    description: row.description ?? '',
    status: row.status,
    postedBy: {
      name: row.contact_name ?? '',
      type: 'owner',
      responseTime: 'Fast',
      verified: false,
    },
    postedAt: row.posted_at,
    featured: row.featured ?? false,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters: SearchFilters = {
    state: searchParams.get('state') || undefined,
    city: searchParams.get('city') || undefined,
    type: searchParams.get('type') || undefined,
    minRent: searchParams.get('minRent') ? Number(searchParams.get('minRent')) : undefined,
    maxRent: searchParams.get('maxRent') ? Number(searchParams.get('maxRent')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    furnished: searchParams.get('furnished') || undefined,
    nationality: searchParams.get('nationality') || undefined,
    gender: searchParams.get('gender') || undefined,
    petsAllowed: searchParams.get('petsAllowed') === 'true' ? true : undefined,
    availableBy: searchParams.get('availableBy') || undefined,
    language: searchParams.get('language') || undefined,
    query: searchParams.get('query') || undefined,
    sort: (searchParams.get('sort') as SortOption) || undefined,
  };

  // Fetch seed listings (filtered)
  const seedResults = filterListings(filters);

  // Fetch DB listings from Supabase
  let dbListings: Listing[] = [];
  try {
    const { data, error } = await adminSupabase
      .from('listings')
      .select('*')
      .eq('status', 'active');
    if (!error && data) {
      dbListings = data.map(dbRowToListing);
    }
  } catch (err) {
    console.error('Error fetching DB listings:', err);
  }

  // Deduplicate by id (DB listings take precedence)
  const seedIds = new Set(seedResults.map((l) => l.id));
  const dbOnly = dbListings.filter((l) => !seedIds.has(l.id));

  // Apply same basic filters to DB listings
  const filteredDb = dbOnly.filter((l) => {
    if (l.status === 'taken' || l.status === 'expired') return false;
    if (filters.state && l.location.state.toUpperCase() !== filters.state.toUpperCase()) return false;
    if (filters.city && l.location.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.type && l.type !== filters.type) return false;
    if (filters.maxRent && l.rent.amount > filters.maxRent) return false;
    if (filters.bedrooms && l.bedrooms < filters.bedrooms) return false;
    if (filters.furnished && l.furnished !== filters.furnished) return false;
    if (filters.nationality && filters.nationality !== 'any') {
      if (l.preferredNationality.length > 0 && !l.preferredNationality.includes(filters.nationality)) return false;
    }
    if (filters.gender && filters.gender !== 'any') {
      if (l.preferredGender !== 'any' && l.preferredGender !== filters.gender) return false;
    }
    if (filters.petsAllowed && !l.petsAllowed) return false;
    if (filters.availableBy) {
      if (l.availableFrom && new Date(l.availableFrom) > new Date(filters.availableBy)) return false;
    }
    if (filters.language && l.postLanguage && l.postLanguage !== filters.language) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${l.title} ${l.location.suburb} ${l.location.city} ${l.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const merged = [...filteredDb, ...seedResults];
  return NextResponse.json({ listings: merged, total: merged.length });
}
