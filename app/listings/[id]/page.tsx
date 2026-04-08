import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Bed, Bath, Users, MapPin, ArrowLeft, Check, X,
  Wifi, Car, Dumbbell, Waves, Wind, WashingMachine, UtensilsCrossed,
  Flower2, Lock, ChevronRight, Calendar, Clock,
  ShoppingCart, Train, Bus, GraduationCap, School, Hospital,
  Trees, ShoppingBag, Pill, Coffee, Plane, Umbrella, MapPinned,
  Zap, Home as HomeIcon, ArrowLeftRight, Sunset, Package,
} from 'lucide-react';
import clsx from 'clsx';
import { getListingById, getSimilarListings } from '@/lib/filterListings';
import { INCLUSIONS_LIST, ROOM_FEATURES_LIST } from '@/lib/types';
import ListingCard from '@/components/ListingCard';
import ListingDetailActions from '@/components/ListingDetailActions';
import ShareButton from '@/components/ShareButton';
import ViewCounter from '@/components/ViewCounter';
import NearbyJobs from '@/components/NearbyJobs';
import AdSlot from '@/components/AdSlot';
import ListingComments from '@/components/ListingComments';

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
  Balcony: Sunset,
  Storage: Package,
};

const NEARBY_ICONS: Record<string, React.ElementType> = {
  'Supermarket':        ShoppingCart,
  'Train station':      Train,
  'Bus stop':           Bus,
  'Tram stop':          Train,
  'University / TAFE':  GraduationCap,
  'School':             School,
  'Hospital / Clinic':  Hospital,
  'Gym':                Dumbbell,
  'Park':               Trees,
  'Shopping centre':    ShoppingBag,
  'Pharmacy':           Pill,
  'Café / Restaurant':  Coffee,
  'Airport':            Plane,
  'Beach':              Umbrella,
};

const TYPE_COLORS: Record<string, string> = {
  'private room':    'bg-teal-600 text-white',
  'whole apartment': 'bg-blue-600 text-white',
  'whole house':     'bg-emerald-600 text-white',
  'studio':          'bg-violet-600 text-white',
  'shared room':     'bg-orange-500 text-white',
  'master room':     'bg-indigo-600 text-white',
  'second room':     'bg-cyan-600 text-white',
  'study room':      'bg-amber-600 text-white',
  'sunny room':      'bg-yellow-500 text-white',
  'living room':     'bg-lime-600 text-white',
  'self-contained':  'bg-rose-600 text-white',
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
      {/* Unavailable banner */}
      {(listing.status === 'taken' || listing.status === 'expired') && (
        <div className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-xl mb-6 border',
          listing.status === 'taken'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-slate-100 border-slate-300 text-slate-700'
        )}>
          {listing.status === 'taken'
            ? <Lock className="w-5 h-5 shrink-0" />
            : <Clock className="w-5 h-5 shrink-0" />
          }
          <div>
            <p className="font-semibold">
              {listing.status === 'taken' ? 'This room has been taken' : 'This listing has expired'}
            </p>
            <p className="text-sm opacity-80">
              {listing.status === 'taken'
                ? 'The property is no longer available. Browse similar listings below.'
                : 'This listing is no longer active. Check out similar rooms nearby.'}
            </p>
          </div>
        </div>
      )}

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
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={clsx('px-2.5 py-1 text-xs font-semibold rounded-full capitalize', TYPE_COLORS[listing.type] ?? 'bg-slate-600 text-white')}>
                  {listing.type}
                </span>
                {listing.roomCategories?.map((cat) => (
                  <span key={cat} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                    {cat}
                  </span>
                ))}
                {listing.featured && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Featured</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{listing.title}</h1>
              <p className="flex items-center gap-1.5 mt-2 text-slate-500">
                <MapPin className="w-4 h-4 shrink-0" />
                {listing.location.address}, {listing.location.suburb} {listing.location.postcode}, {listing.location.city}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-slate-400">Posted {postedDate}</p>
                <ViewCounter listingId={listing.id} />
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <div>
                <div className="text-3xl font-bold text-teal-600">
                  AUD {listing.rent.amount.toLocaleString()}
                </div>
                <div className="text-sm text-slate-500">per {listing.rent.period}</div>
              </div>
              <ShareButton
                url={`https://flatmatefind.vercel.app/listings/${listing.id}`}
                title={`${listing.title} — $${listing.rent.amount}/${listing.rent.period} in ${listing.location.suburb}`}
              />
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

          {/* Room Features */}
          {listing.roomFeatures && listing.roomFeatures.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Room Features</h2>
              <div className="flex flex-wrap gap-2">
                {listing.roomFeatures.map((feat) => (
                  <span key={feat} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    ROOM_FEATURES_LIST.includes(feat)
                      ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Places */}
          {listing.nearbyPlaces && listing.nearbyPlaces.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">What&apos;s Nearby</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {listing.nearbyPlaces.map((place) => {
                  const Icon = NEARBY_ICONS[place.type] ?? MapPinned;
                  return (
                    <div key={place.type} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{place.type}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                        {place.distance}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* House Rules */}
          {listing.rules && listing.rules.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">House Rules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {listing.rules.map((rule) => (
                  <div key={rule} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-teal-500" />
                    </span>
                    {rule}
                  </div>
                ))}
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
              {listing.stayType && (
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Stay Type</div>
                  <span className={clsx('inline-block px-2.5 py-1 rounded-full text-xs font-semibold', {
                    'bg-blue-100 text-blue-800': listing.stayType === 'short term',
                    'bg-emerald-100 text-emerald-800': listing.stayType === 'long term',
                    'bg-violet-100 text-violet-800': listing.stayType === 'both',
                  })}>
                    {listing.stayType === 'short term'
                      ? <><Zap className="w-3 h-3 inline mr-1" />Short term</>
                      : listing.stayType === 'long term'
                      ? <><HomeIcon className="w-3 h-3 inline mr-1" />Long term</>
                      : <><ArrowLeftRight className="w-3 h-3 inline mr-1" />Both</>
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column — client component ─────────────────────────── */}
        <div className="mt-8 lg:mt-0 sticky top-24 self-start space-y-5">
          <ListingDetailActions listing={listing} availableDate={availableDate} />
          <AdSlot size="rectangle" slotId="listing-detail-bottom" />
        </div>
      </div>

      {/* Comments */}
      <ListingComments listingId={listing.id} />

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

      {/* Jobs in this area */}
      <NearbyJobs
        suburb={listing.location.suburb}
        city={listing.location.city}
        state={listing.location.state}
      />

      <div className="mt-10">
        <Link href="/listings" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to all listings
        </Link>
      </div>
    </div>
  );
}
