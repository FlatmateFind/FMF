'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, SearchX } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import AdSlot from '@/components/AdSlot';
import { Listing } from '@/lib/types';

export default function ListingsGrid() {
  const params = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const apiParams = new URLSearchParams();
        const keys = ['state', 'city', 'type', 'minRent', 'maxRent', 'bedrooms', 'furnished', 'nationality', 'gender', 'petsAllowed', 'availableBy', 'query'];
        for (const k of keys) {
          const v = params.get(k);
          if (v) apiParams.set(k, v);
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
  }, [params]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        <p className="text-sm">Loading listings...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Results count */}
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          {total} room{total !== 1 ? 's' : ''} &amp; apartment{total !== 1 ? 's' : ''} found
        </h2>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 bg-white rounded-xl border border-slate-200">
          <SearchX className="w-12 h-12 text-slate-300" />
          <p className="text-base font-medium text-slate-600">No listings found</p>
          <p className="text-sm text-slate-400">Try adjusting your filters or clearing the search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {listings.map((listing, i) => (
            <>
              <ListingCard key={listing.id} listing={listing} />
              {/* Inject an inline ad after every 6th card */}
              {(i + 1) % 6 === 0 && i + 1 < listings.length && (
                <AdSlot key={`ad-${i}`} size="inline" className="my-1" />
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
}
