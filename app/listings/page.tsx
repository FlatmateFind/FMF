'use client';
import { Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterPanel from '@/components/FilterPanel';
import ListingsGrid from '@/components/ListingsGrid';
import SearchBar from '@/components/SearchBar';
import { SearchFilters } from '@/lib/types';
import { Loader2 } from 'lucide-react';

function ListingsPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  const filters: SearchFilters = {
    state: params.get('state') || undefined,
    city: params.get('city') || undefined,
    type: params.get('type') || undefined,
    minRent: params.get('minRent') ? Number(params.get('minRent')) : undefined,
    maxRent: params.get('maxRent') ? Number(params.get('maxRent')) : undefined,
    bedrooms: params.get('bedrooms') ? Number(params.get('bedrooms')) : undefined,
    furnished: params.get('furnished') || undefined,
    nationality: params.get('nationality') || undefined,
    gender: params.get('gender') || undefined,
    petsAllowed: params.get('petsAllowed') === 'true' ? true : undefined,
    availableBy: params.get('availableBy') || undefined,
    query: params.get('query') || undefined,
  };

  const handleFilterChange = useCallback(
    (newFilters: SearchFilters) => {
      const next = new URLSearchParams();
      if (newFilters.state) next.set('state', newFilters.state);
      if (newFilters.city) next.set('city', newFilters.city);
      if (newFilters.type) next.set('type', newFilters.type);
      if (newFilters.minRent) next.set('minRent', String(newFilters.minRent));
      if (newFilters.maxRent) next.set('maxRent', String(newFilters.maxRent));
      if (newFilters.bedrooms) next.set('bedrooms', String(newFilters.bedrooms));
      if (newFilters.furnished) next.set('furnished', newFilters.furnished);
      if (newFilters.nationality) next.set('nationality', newFilters.nationality);
      if (newFilters.gender) next.set('gender', newFilters.gender);
      if (newFilters.petsAllowed) next.set('petsAllowed', 'true');
      if (newFilters.availableBy) next.set('availableBy', newFilters.availableBy);
      if (newFilters.query) next.set('query', newFilters.query);
      router.push(`/listings?${next.toString()}`);
    },
    [router]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Browse Listings</h1>
        <p className="text-slate-500 text-sm">Rooms, apartments and houses for rent across Australia</p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <SearchBar
          size="md"
          placeholder="Search by suburb, city, or keyword..."
          initialValue={filters.query || ''}
        />
      </div>

      {/* Main layout: sidebar + grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        <FilterPanel filters={filters} onChange={handleFilterChange} />
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center py-24 text-slate-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
              <span className="text-sm">Loading listings...</span>
            </div>
          }
        >
          <ListingsGrid />
        </Suspense>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32 text-slate-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
          <span className="text-sm">Loading...</span>
        </div>
      }
    >
      <ListingsPageInner />
    </Suspense>
  );
}
