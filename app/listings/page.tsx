'use client';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Home, Loader2, Search, SlidersHorizontal, X,
  ArrowUpDown, PlusCircle, Calendar, SearchX,
} from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import AdSlot from '@/components/AdSlot';
import Link from 'next/link';
import {
  SearchFilters, SortOption, Listing,
  AUSTRALIAN_STATES, PROPERTY_TYPES, NATIONALITIES, LANGUAGES,
} from '@/lib/types';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest',          label: 'Newest first' },
  { value: 'oldest',          label: 'Oldest first' },
  { value: 'price-asc',       label: 'Price: low → high' },
  { value: 'price-desc',      label: 'Price: high → low' },
  { value: 'available-soon',  label: 'Available soonest' },
  { value: 'available-later', label: 'Available latest' },
];

const BEDROOMS_OPTS = [
  { label: 'Any', value: '' },
  { label: '1+',  value: '1' },
  { label: '2+',  value: '2' },
  { label: '3+',  value: '3' },
  { label: '4+',  value: '4' },
];

const GENDER_OPTS = [
  { label: 'Any',    value: 'any' },
  { label: 'Male',   value: 'male' },
  { label: 'Female', value: 'female' },
];

function ListingsPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const filters: SearchFilters = useMemo(() => ({
    state:       params.get('state')       || undefined,
    city:        params.get('city')        || undefined,
    type:        params.get('type')        || undefined,
    minRent:     params.get('minRent')     ? Number(params.get('minRent'))  : undefined,
    maxRent:     params.get('maxRent')     ? Number(params.get('maxRent'))  : undefined,
    bedrooms:    params.get('bedrooms')    ? Number(params.get('bedrooms')) : undefined,
    furnished:   params.get('furnished')   || undefined,
    nationality: params.get('nationality') || undefined,
    gender:      params.get('gender')      || undefined,
    petsAllowed: params.get('petsAllowed') === 'true' ? true : undefined,
    availableBy: params.get('availableBy') || undefined,
    language:    params.get('language')    || undefined,
    query:       params.get('query')       || undefined,
    sort:        (params.get('sort') as SortOption) || undefined,
  }), [params]);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    const next = new URLSearchParams();
    if (newFilters.state)       next.set('state',       newFilters.state);
    if (newFilters.city)        next.set('city',        newFilters.city);
    if (newFilters.type)        next.set('type',        newFilters.type);
    if (newFilters.minRent)     next.set('minRent',     String(newFilters.minRent));
    if (newFilters.maxRent)     next.set('maxRent',     String(newFilters.maxRent));
    if (newFilters.bedrooms)    next.set('bedrooms',    String(newFilters.bedrooms));
    if (newFilters.furnished)   next.set('furnished',   newFilters.furnished);
    if (newFilters.nationality) next.set('nationality', newFilters.nationality);
    if (newFilters.gender)      next.set('gender',      newFilters.gender);
    if (newFilters.petsAllowed) next.set('petsAllowed', 'true');
    if (newFilters.availableBy) next.set('availableBy', newFilters.availableBy);
    if (newFilters.language)    next.set('language',    newFilters.language);
    if (newFilters.query)       next.set('query',       newFilters.query);
    if (newFilters.sort)        next.set('sort',        newFilters.sort);
    router.push(`/listings?${next.toString()}`);
  }, [router]);

  function update<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    handleFilterChange({ ...filters, [key]: value || undefined });
  }

  const activeFilterCount = useMemo(() =>
    ['state','city','type','maxRent','bedrooms','furnished','nationality','gender','petsAllowed','availableBy','language']
      .filter((k) => {
        const v = filters[k as keyof SearchFilters];
        return v !== undefined && v !== '';
      }).length,
  [filters]);

  const hasFilters = activeFilterCount > 0 || !!filters.query;

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const apiParams = new URLSearchParams();
        const keys: (keyof SearchFilters)[] = [
          'state','city','type','minRent','maxRent','bedrooms','furnished',
          'nationality','gender','petsAllowed','availableBy','language','query','sort',
        ];
        for (const k of keys) {
          const v = filters[k];
          if (v !== undefined && v !== '') apiParams.set(k, String(v));
        }
        const res = await fetch(`/api/listings?${apiParams.toString()}`);
        const data = await res.json() as { listings: Listing[]; total: number };
        setListings(data.listings);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void fetchListings();
  }, [filters]);

  const FilterContent = () => (
    <div className="space-y-5">
      {/* State */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">State / Territory</label>
        <select
          value={filters.state || ''}
          onChange={(e) => {
            update('city', undefined);
            update('state', e.target.value || undefined);
          }}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        >
          <option value="">All states</option>
          {AUSTRALIAN_STATES.map((s) => (
            <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>
          ))}
        </select>
      </div>

      {/* City (conditional) */}
      {filters.state && (
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">City</label>
          <select
            value={filters.city || ''}
            onChange={(e) => update('city', e.target.value || undefined)}
            className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
          >
            <option value="">All cities in {filters.state}</option>
            {(AUSTRALIAN_STATES.find((s) => s.abbr === filters.state)?.cities ?? []).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Room type */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Room Type</label>
        <select
          value={filters.type || ''}
          onChange={(e) => update('type', e.target.value || undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        >
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>
      </div>

      {/* Max rent */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Max Rent (AUD/week)</label>
        <input
          type="number"
          placeholder="e.g. 400"
          value={filters.maxRent || ''}
          onChange={(e) => update('maxRent', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        />
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Min. Bedrooms</label>
        <div className="flex gap-1.5">
          {BEDROOMS_OPTS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => update('bedrooms', opt.value ? Number(opt.value) : undefined)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                (filters.bedrooms?.toString() || '') === opt.value
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Furnished */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Furnished</label>
        <select
          value={filters.furnished || ''}
          onChange={(e) => update('furnished', e.target.value || undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        >
          <option value="">Any</option>
          <option value="furnished">Furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* Gender preference */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Gender Preference</label>
        <div className="flex gap-1.5">
          {GENDER_OPTS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('gender', opt.value === 'any' ? undefined : opt.value)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                (filters.gender || 'any') === opt.value
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* My Nationality */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">My Nationality</label>
        <p className="text-[11px] text-slate-400 mb-2">Show listings that welcome you</p>
        <select
          value={filters.nationality || ''}
          onChange={(e) => update('nationality', e.target.value || undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        >
          <option value="">Any / not specified</option>
          {NATIONALITIES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Host Language */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Host Language</label>
        <p className="text-[11px] text-slate-400 mb-2">Host speaks your language</p>
        <select
          value={filters.language || ''}
          onChange={(e) => update('language', e.target.value || undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        >
          <option value="">Any language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Available by */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
          <Calendar className="w-3.5 h-3.5 inline mr-1" />
          Available By
        </label>
        <p className="text-[11px] text-slate-400 mb-2">Available on or before this date</p>
        <input
          type="date"
          value={filters.availableBy || ''}
          onChange={(e) => update('availableBy', e.target.value || undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        />
        {filters.availableBy && (
          <button
            onClick={() => update('availableBy', undefined)}
            className="text-[11px] text-red-400 hover:text-red-600 mt-1 transition-colors"
          >
            Clear date
          </button>
        )}
      </div>

      {/* Pets allowed */}
      <label className="flex items-center gap-3 cursor-pointer py-1">
        <input
          type="checkbox"
          checked={filters.petsAllowed === true}
          onChange={(e) => update('petsAllowed', e.target.checked ? true : undefined)}
          className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
        />
        <span className="text-sm text-slate-700 font-medium">Pets allowed</span>
      </label>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={() => handleFilterChange({})}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg py-2 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear all filters
        </button>
      )}

      {/* Ad slot */}
      <AdSlot size="rectangle" slotId="listings-sidebar" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900">Browse Listings</h1>
          </div>
          <p className="text-slate-500 text-sm">Rooms, apartments and houses for rent across Australia</p>
        </div>
        <Link
          href="/post"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors text-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Post a Listing
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={filters.query || ''}
          onChange={(e) => update('query', e.target.value || undefined)}
          placeholder="Search by suburb, city, or keyword..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
        />
        {filters.query && (
          <button
            onClick={() => update('query', undefined)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile filter toggle + count */}
      <div className="flex items-center gap-2 mb-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-teal-400 hover:text-teal-600 transition-colors bg-white"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-sm text-slate-500 ml-auto">
          {loading ? '…' : `${total} listing${total !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="lg:hidden bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-slate-800">Filters</span>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <FilterContent />
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                Filters
              </div>
              {hasFilters && (
                <button
                  onClick={() => handleFilterChange({})}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Listings */}
        <div className="flex-1 min-w-0">
          {/* Results bar + sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <p className="text-sm text-slate-500 hidden lg:block">
              <span className="font-semibold text-slate-800">{loading ? '…' : total}</span>{' '}
              listing{total !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => update('sort', e.target.value as SortOption)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
              <span className="text-sm">Loading listings…</span>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4">
              <SearchX className="w-12 h-12 text-slate-200" />
              <p className="text-base font-semibold text-slate-600">No listings found</p>
              <p className="text-sm text-slate-400">Try adjusting your filters or search</p>
              {hasFilters && (
                <button
                  onClick={() => handleFilterChange({})}
                  className="text-sm text-teal-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {listings.map((listing, i) => (
                <>
                  <ListingCard key={listing.id} listing={listing} />
                  {i === 5 && (
                    <div key="ad-inline" className="sm:col-span-2 xl:col-span-3">
                      <AdSlot size="leaderboard" slotId="listings-inline" />
                    </div>
                  )}
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32 gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
        <span className="text-sm">Loading…</span>
      </div>
    }>
      <ListingsPageInner />
    </Suspense>
  );
}
