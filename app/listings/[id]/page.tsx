import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Bed, Bath, Users, MapPin, ArrowLeft, Check, X,
  Wifi, Car, Dumbbell, Waves, Wind, WashingMachine, UtensilsCrossed,
  Flower2, Lock, ChevronRight, Calendar, Clock,
} from 'lucide-react';
import clsx from 'clsx';
import { getListingById, getSimilarListings } from '@/lib/filterListings';
import { INCLUSIONS_LIST } from '@/lib/types';
import ListingCard from '@/components/ListingCard';
import ListingDetailActions from '@/components/ListingDetailActions';

const FACILITY_ICONS: Record<string, React.ElementType> = {
  Parking: Car,
  Gym: Dumbbell,
  Pool: Waves,
  'Air conditioning': Wind,
  'Washing machine': WashingMachine,
  Dishwasher: UtensilsCrossed,
  Garden: Flower2,
  Security: Lock,
  Internet: Wifi,
};

const TYPE_COLORS: Record<string, string> = {
  'private room': 'bg-teal-600 text-white',
  'whole apartment': 'bg-blue-600 text-white',
  'whole house': 'bg-emerald-600 text-white',
  'studio': 'bg-violet-600 text-white',
  'shared room': 'bg-orange-500 text-white',
};

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = getListingById(params.id);
  if (!listing) notFound();

  const similar = getSimilarListings(listing, 3);

  const availableDate = new Date(listing.availableFrom).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const postedDate = new Date(listing.postedAt).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/listings" className="hover:text-teal-600 transition-colors">Listings</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium truncate">{listing.title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-3 lg:gap-10">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden mb-8">
            <div className="col-span-2 sm:col-span-1 relative h-72 sm:h-96">
              <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" priority />
            </div>
            {listing.images[1] && (
              <div className="hidden sm:block relative h-96">
                <Image src={listing.images[1]} alt={listing.title} fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Title + badges */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={clsx('px-2.5 py-1 text-xs font-semibold rounded-full capitalize', TYPE_COLORS[listing.type] ?? 'bg-slate-600 text-white')}>
                  {listing.type}
                </span>
                {listing.featured && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Featured</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{listing.title}</h1>
              <p className="flex items-center gap-1.5 mt-2 text-slate-500">
                <MapPin className="w-4 h-4 shrink-0" />
                {listing.location.address}, {listing.location.suburb} {listing.location.postcode}, {listing.location.city}
              </p>
              <p className="text-xs text-slate-400 mt-1">Posted {postedDate}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-teal-600">
                AUD {listing.rent.amount.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500">per {listing.rent.period}</div>
            </div>
          </div>

          {/* Details grid — two rows */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
            {/* Row 1: beds / baths / occupants */}
            <div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50">
              <div className="flex items-center gap-3 px-5 py-4">
                <Bed className="w-5 h-5 text-teal-500 shrink-0" />
                <div>
                  <div className="text-xl font-bold text-slate-900">{listing.bedrooms}</div>
                  <div className="text-xs text-slate-500">Bedroom{listing.bedrooms !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <Bath className="w-5 h-5 text-teal-500 shrink-0" />
                <div>
                  <div className="text-xl font-bold text-slate-900">{listing.bathrooms}</div>
                  <div className="text-xs text-slate-500">Bathroom{listing.bathrooms !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <Users className="w-5 h-5 text-teal-500 shrink-0" />
                <div>
                  <div className="text-xl font-bold text-slate-900">{listing.currentOccupants}/{listing.totalCapacity}</div>
                  <div className="text-xs text-slate-500">Occupants</div>
                </div>
              </div>
            </div>
            {/* Row 2: dates */}
            <div className="grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-3 px-5 py-4">
                <Calendar className="w-5 h-5 text-teal-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">{availableDate}</div>
                  <div className="text-xs text-slate-500">Available from</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <Clock className="w-5 h-5 text-teal-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">{listing.minimumStay}</div>
                  <div className="text-xs text-slate-500">Minimum stay</div>
                </div>
              </div>
            </div>
          </div>

          {/* Furnished */}
          <div className="flex items-center gap-2 mb-8">
            <span className={clsx('px-3 py-1.5 rounded-full text-sm font-semibold',
              listing.furnished === 'furnished' ? 'bg-teal-100 text-teal-800' :
              listing.furnished === 'partially furnished' ? 'bg-amber-100 text-amber-800' :
              'bg-slate-100 text-slate-700'
            )}>
              {listing.furnished.charAt(0).toUpperCase() + listing.furnished.slice(1)}
            </span>
          </div>

          {/* Inclusions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">What&apos;s Included in Rent</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INCLUSIONS_LIST.map((inc) => {
                const included = listing.inclusions.includes(inc);
                return (
                  <div key={inc} className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg border text-sm',
                    included ? 'bg-green-50 border-green-200 text-green-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                  )}>
                    {included ? <Check className="w-4 h-4 text-green-600 shrink-0" /> : <X className="w-4 h-4 text-slate-300 shrink-0" />}
                    {inc}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Facilities */}
          {listing.facilities.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.facilities.map((f) => {
                  const Icon = FACILITY_ICONS[f];
                  return (
                    <span key={f} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                      {Icon && <Icon className="w-4 h-4 text-teal-500" />}
                      {f}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">About this listing</h2>
            <p className="text-slate-600 leading-relaxed">{listing.description}</p>
          </div>

          {/* Tenant preferences */}
          <div className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Tenant Preferences</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Nationality</div>
                <div className="text-slate-800 font-medium">
                  {listing.preferredNationality.length === 0 ? 'Any welcome' : listing.preferredNationality.join(', ')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Gender</div>
                <div className="text-slate-800 font-medium capitalize">{listing.preferredGender}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Pets</div>
                <div className={clsx('font-medium', listing.petsAllowed ? 'text-green-700' : 'text-red-600')}>
                  {listing.petsAllowed ? 'Allowed' : 'Not allowed'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Smoking</div>
                <div className={clsx('font-medium', listing.smokingAllowed ? 'text-green-700' : 'text-red-600')}>
                  {listing.smokingAllowed ? 'Allowed' : 'Not allowed'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Min. Stay</div>
                <div className="text-slate-800 font-medium">{listing.minimumStay}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Available</div>
                <div className="text-slate-800 font-medium">{availableDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column — client component ─────────────────────────── */}
        <div className="mt-8 lg:mt-0">
          <ListingDetailActions listing={listing} availableDate={availableDate} />
        </div>
      </div>

      {/* Similar listings */}
      {similar.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Similar Listings</h2>
            <Link href="/listings" className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link href="/listings" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to all listings
        </Link>
      </div>
    </div>
  );
}
