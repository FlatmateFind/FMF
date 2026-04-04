'use client';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, Loader2, Search, SlidersHorizontal, X, UserPlus } from 'lucide-react';
import { useRenterProfiles } from '@/hooks/useRenterProfiles';
import { RenterProfileFilters, AUSTRALIAN_STATES, PROPERTY_TYPES, NATIONALITIES } from '@/lib/types';
import RenterCard from '@/components/RenterCard';
import AdSlot from '@/components/AdSlot';
import Link from 'next/link';

function RentersPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filters: RenterProfileFilters = useMemo(() => ({
    state:       params.get('state') || undefined,
    maxBudget:   params.get('maxBudget') ? Number(params.get('maxBudget')) : undefined,
    availableBy: params.get('availableBy') || undefined,
    roomType:    params.get('roomType') || undefined,
    nationality: params.get('nationality') || undefined,
  }), [params]);

  const { profiles: rawProfiles, allProfiles, loaded } = useRenterProfiles(filters);

  const profiles = useMemo(() => {
    if (!query.trim()) return rawProfiles;
    const q = query.toLowerCase();
    return rawProfiles.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.nationality ?? '').toLowerCase().includes(q) ||
      (p.aboutMe ?? '').toLowerCase().includes(q)
    );
  }, [rawProfiles, query]);

  const handleFilterChange = useCallback((newFilters: RenterProfileFilters) => {
    const next = new URLSearchParams();
    if (newFilters.state)       next.set('state', newFilters.state);
    if (newFilters.maxBudget)   next.set('maxBudget', String(newFilters.maxBudget));
    if (newFilters.availableBy) next.set('availableBy', newFilters.availableBy);
    if (newFilters.roomType)    next.set('roomType', newFilters.roomType);
    if (newFilters.nationality) next.set('nationality', newFilters.nationality);
    router.push(`/renters?${next.toString()}`);
  }, [router]);

  function update<K extends keyof RenterProfileFilters>(key: K, value: RenterProfileFilters[K]) {
    handleFilterChange({ ...filters, [key]: value || undefined });
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '');
  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== '').length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* State */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Looking in State</label>
        <select
          value={filters.state || ''}
          onChange={(e) => update('state', e.target.value || undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        >
          <option value="">Any state</option>
          {AUSTRALIAN_STATES.map((s) => (
            <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>
          ))}
        </select>
      </div>

      {/* Max budget */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Max Budget (AUD/week)</label>
        <input
          type="number"
          placeholder="e.g. 400"
          value={filters.maxBudget || ''}
          onChange={(e) => update('maxBudget', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        />
        <p className="text-[11px] text-slate-400 mt-1">Show renters whose max budget is up to this amount</p>
      </div>

      {/* Available by */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Available By</label>
        <input
          type="date"
          value={filters.availableBy || ''}
          onChange={(e) => update('availableBy', e.target.value || undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        />
      </div>

      {/* Room type */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Looking For</label>
        <select
          value={filters.roomType || ''}
          onChange={(e) => update('roomType', e.target.value || undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        >
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>
      </div>

      {/* Nationality */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Nationality</label>
        <select
          value={filters.nationality || ''}
          onChange={(e) => update('nationality', e.target.value || undefined)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        >
          <option value="">Any nationality</option>
          {NATIONALITIES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
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
            <Users className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900">Browse Profiles</h1>
          </div>
          <p className="text-slate-500 text-sm">Verified renters looking for a home across Australia</p>
        </div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors text-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Create My Profile
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, nationality or bio..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile filter toggle */}
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
          {loaded ? `${profiles.length} renter${profiles.length !== 1 ? 's' : ''}` : '...'}
        </p>
      </div>

      {/* Mobile sidebar drawer */}
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
              <span className="font-semibold text-slate-800 text-sm">Filters</span>
              {hasFilters && (
                <button onClick={() => handleFilterChange({})} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                  Clear all
                </button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Profiles grid */}
        <div className="flex-1 min-w-0">
          {!loaded ? (
            <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
              <span className="text-sm">Loading profiles…</span>
            </div>
          ) : profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4">
              <Users className="w-12 h-12 text-slate-200" />
              <p className="text-base font-semibold text-slate-600">No matching renters found</p>
              <p className="text-sm text-slate-400">Try adjusting your filters or search</p>
              {hasFilters && (
                <button onClick={() => handleFilterChange({})} className="text-sm text-teal-600 hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden lg:flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-800">{profiles.length}</span> renter{profiles.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {profiles.map((p, i) => (
                  <>
                    <RenterCard key={p.userId} profile={p} />
                    {i === 5 && (
                      <div key="ad" className="sm:col-span-2 xl:col-span-3">
                        <AdSlot size="leaderboard" slotId="listings-inline" />
                      </div>
                    )}
                  </>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RentersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32 gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
        <span className="text-sm">Loading…</span>
      </div>
    }>
      <RentersPageInner />
    </Suspense>
  );
}
