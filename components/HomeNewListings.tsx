'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { listings } from '@/data/listings';
import ListingCard from '@/components/ListingCard';

// Sort by postedAt descending → most recently posted first
const NEW_LISTINGS = [...listings]
  .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
  .slice(0, 4);

export default function HomeNewListings() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-teal-500" />
            <h2 className="text-2xl font-bold text-slate-900">New Listings</h2>
          </div>
          <p className="text-slate-500 text-sm">Fresh rooms and homes just posted</p>
        </div>
        <Link
          href="/listings"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {NEW_LISTINGS.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
