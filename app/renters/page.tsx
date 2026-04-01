'use client';
import { Suspense, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, Loader2 } from 'lucide-react';
import { useRenterProfiles } from '@/hooks/useRenterProfiles';
import { RenterProfileFilters } from '@/lib/types';
import RenterCard from '@/components/RenterCard';
import RenterFilterPanel from '@/components/RenterFilterPanel';

function RentersPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  const filters: RenterProfileFilters = useMemo(() => ({
    state:       params.get('state') || undefined,
    maxBudget:   params.get('maxBudget') ? Number(params.get('maxBudget')) : undefined,
    availableBy: params.get('availableBy') || undefined,
    roomType:    params.get('roomType') || undefined,
    nationality: params.get('nationality') || undefined,
  }), [params]);

  const { profiles, allProfiles, loaded } = useRenterProfiles(filters);

  const handleFilterChange = useCallback((newFilters: RenterProfileFilters) => {
    const next = new URLSearchParams();
    if (newFilters.state)       next.set('state', newFilters.state);
    if (newFilters.maxBudget)   next.set('maxBudget', String(newFilters.maxBudget));
    if (newFilters.availableBy) next.set('availableBy', newFilters.availableBy);
    if (newFilters.roomType)    next.set('roomType', newFilters.roomType);
    if (newFilters.nationality) next.set('nationality', newFilters.nationality);
    router.push(`/renters?${next.toString()}`);
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-amber-50 rounded-xl">
          <Users className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Find a Renter</h1>
          <p className="text-sm text-slate-500">Browse verified renters looking for a home — filter by state, budget and move-in date</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <RenterFilterPanel
          filters={filters}
          onChange={handleFilterChange}
          total={allProfiles.length}
          filtered={profiles.length}
        />

        <div className="flex-1 min-w-0">
          {!loaded ? (
            <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
              <span className="text-sm">Loading profiles…</span>
            </div>
          ) : profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 gap-4 text-slate-400">
              <Users className="w-12 h-12 text-slate-300" />
              <p className="text-base font-medium text-slate-600">No matching renters found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-5">
                <span className="font-semibold text-slate-800">{profiles.length}</span> renter{profiles.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {profiles.map((p) => (
                  <RenterCard key={p.userId} profile={p} />
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
