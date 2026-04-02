'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { listings } from '@/data/listings';
import { Listing } from '@/lib/types';

interface NearbyListingsProps {
  suburb: string;
  state: string;
}

export default function NearbyListings({ suburb, state }: NearbyListingsProps) {
  const suburbLower = suburb.toLowerCase();

  const available = listings.filter(
    (l) => l.status !== 'taken' && l.status !== 'expired'
  );

  // Suburb match first, then same state
  const exact = available.filter((l) => l.location.suburb.toLowerCase() === suburbLower);
  const stateMatch = available.filter(
    (l) => l.location.state === state && l.location.suburb.toLowerCase() !== suburbLower
  );

  const nearby: Listing[] = [...exact, ...stateMatch].slice(0, 2);

  if (nearby.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <div className="flex items-center gap-1.5 mb-2">
        <Home className="w-3 h-3 text-teal-500" />
        <span className="text-xs font-semibold text-slate-600">Rooms nearby</span>
        <Link
          href={`/listings?state=${encodeURIComponent(state)}`}
          className="ml-auto flex items-center gap-0.5 text-[10px] text-teal-600 hover:text-teal-800 transition-colors"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {nearby.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="flex items-center gap-2.5 rounded-lg hover:bg-slate-50 transition-colors p-1 -mx-1 group"
          >
            {/* Thumbnail */}
            <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-slate-100">
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="48px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 line-clamp-1 group-hover:text-teal-700 transition-colors">
                {listing.title}
              </p>
              <p className="text-[10px] text-slate-500">
                {listing.location.suburb} · <span className="font-semibold text-teal-600">${listing.rent.amount}/{listing.rent.period === 'week' ? 'wk' : 'mo'}</span>
              </p>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-400 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
