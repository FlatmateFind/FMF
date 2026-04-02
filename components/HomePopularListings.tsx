'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { listings } from '@/data/listings';
import { getTopListingIds } from '@/lib/viewTracker';
import ListingCard from '@/components/ListingCard';

export default function HomePopularListings() {
  const [popular, setPopular] = useState(listings.slice(0, 6));

  useEffect(() => {
    const topIds = getTopListingIds(6);
    const sorted = topIds
      .map((id) => listings.find((l) => l.id === id))
      .filter((l): l is typeof listings[0] => !!l);
    if (sorted.length > 0) setPopular(sorted);
  }, []);

  return (
    <section className="bg-orange-50 border-t border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bold text-slate-900">Popular Listings</h2>
            </div>
            <p className="text-slate-500 text-sm">Most viewed rooms and homes right now</p>
          </div>
          <Link
            href="/listings"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popular.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
