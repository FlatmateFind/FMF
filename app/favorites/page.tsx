'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionTabs from '@/components/SectionTabs';

const SECTION_TABS = [
  { label: 'Find a Room', href: '/listings' },
  { label: 'Post a Room', href: '/post' },
  { label: 'Compare', href: '/compare' },
  { label: 'Favourites', href: '/favorites' },
];
import { Heart, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { listings } from '@/data/listings';
import { Listing } from '@/lib/types';
import ListingCard from '@/components/ListingCard';

export default function FavoritesPage() {
  const { favorites, loaded } = useFavorites();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (loaded) {
      setSavedListings(listings.filter((l) => favorites.includes(l.id)));
    }
  }, [favorites, loaded]);

  if (!loaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SectionTabs tabs={SECTION_TABS} className="mb-6 max-w-4xl" />
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-rose-100 rounded-xl">
          <Heart className="w-5 h-5 text-rose-500 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Listings</h1>
          <p className="text-sm text-slate-500">
            {savedListings.length === 0
              ? 'No saved listings yet'
              : `${savedListings.length} listing${savedListings.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
      </div>

      {savedListings.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-700 mb-2">No saved listings yet</h2>
          <p className="text-slate-500 mb-6">
            Tap the ♡ heart on any listing to save it here for later.
          </p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all listings
        </Link>
      </div>
    </div>
  );
}
