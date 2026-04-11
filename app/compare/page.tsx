'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NavRow from '@/components/NavRow';

const STARTED_TABS = [
  { label: 'Find a Room', href: '/listings' },
  { label: 'Post a Room', href: '/post' },
  { label: 'Compare', href: '/compare' },
  { label: 'Favourites', href: '/favorites' },
];
import Image from 'next/image';
import { ArrowLeft, Check, X, GitCompareArrows } from 'lucide-react';
import { listings } from '@/data/listings';
import { INCLUSIONS_LIST } from '@/lib/types';
import clsx from 'clsx';

function CheckVal({ val }: { val: boolean }) {
  return val
    ? <span className="flex items-center justify-center gap-1 text-green-700 font-medium"><Check className="w-4 h-4" /> Yes</span>
    : <span className="flex items-center justify-center gap-1 text-red-500"><X className="w-4 h-4" /> No</span>;
}

function Row({ label, a, b, highlight }: { label: string; a: React.ReactNode; b: React.ReactNode; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'bg-teal-50' : 'bg-white even:bg-slate-50'}>
      <td className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap w-36 border-r border-slate-100">
        {label}
      </td>
      <td className="px-4 py-3 text-sm text-slate-800 text-center border-r border-slate-100">{a}</td>
      <td className="px-4 py-3 text-sm text-slate-800 text-center">{b}</td>
    </tr>
  );
}

function Tags({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <span className="text-slate-400 text-xs">—</span>;
  return (
    <div className="flex flex-wrap justify-center gap-1">
      {items.map((i) => (
        <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full text-xs">{i}</span>
      ))}
    </div>
  );
}

function ComparePage() {
  const params = useSearchParams();
  const idParam = params.get('ids') ?? '';
  const ids = idParam.split(',').filter(Boolean).slice(0, 2);
  const found = ids.map((id) => listings.find((l) => l.id === id));
  const [a, b] = found;

  if (!a || !b) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <GitCompareArrows className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-700 mb-2">Nothing to compare</h1>
        <p className="text-slate-500 mb-6 text-sm">Select 2 listings from the browse page to compare them side by side.</p>
        <Link href="/listings" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Browse listings
        </Link>
      </div>
    );
  }

  const rentDiff = a.rent.amount - b.rent.amount;

  return (
    <div>
      <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-2 mb-1">
            <GitCompareArrows className="w-5 h-5 text-white/80" />
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-100">Compare</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Compare Listings</h1>
          <NavRow tabs={STARTED_TABS} />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24">
      <Link href="/listings" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </Link>

      {/* Header cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[a, b].map((l) => (
          <Link key={l.id} href={`/listings/${l.id}`} className="block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-40">
              <Image src={l.images[0]} alt={l.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-slate-900 text-sm line-clamp-2 mb-1 group-hover:text-teal-600 transition-colors">{l.title}</p>
              <p className="text-xs text-slate-500">{l.location.suburb}, {l.location.city}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-36 border-r border-slate-600"></th>
              <th className="px-4 py-3 text-center text-sm font-semibold border-r border-slate-600">Listing A</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Listing B</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Rent */}
            <Row
              label="Rent"
              highlight
              a={
                <span className={clsx('text-lg font-bold', rentDiff < 0 ? 'text-green-600' : 'text-slate-800')}>
                  ${a.rent.amount.toLocaleString()}/{a.rent.period === 'week' ? 'pw' : 'pm'}
                  {rentDiff < 0 && <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">Cheaper</span>}
                </span>
              }
              b={
                <span className={clsx('text-lg font-bold', rentDiff > 0 ? 'text-green-600' : 'text-slate-800')}>
                  ${b.rent.amount.toLocaleString()}/{b.rent.period === 'week' ? 'pw' : 'pm'}
                  {rentDiff > 0 && <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">Cheaper</span>}
                </span>
              }
            />
            <Row label="Type" a={<span className="capitalize">{a.type}</span>} b={<span className="capitalize">{b.type}</span>} />
            {(a.roomCategories?.length || b.roomCategories?.length) ? (
              <Row label="Category" a={<Tags items={a.roomCategories} />} b={<Tags items={b.roomCategories} />} />
            ) : null}
            <Row label="Location" a={`${a.location.suburb}, ${a.location.city}`} b={`${b.location.suburb}, ${b.location.city}`} />
            <Row label="Bedrooms" a={a.bedrooms} b={b.bedrooms} />
            <Row label="Bathrooms" a={a.bathrooms} b={b.bathrooms} />
            <Row
              label="Occupants"
              a={`${a.currentOccupants}/${a.totalCapacity}`}
              b={`${b.currentOccupants}/${b.totalCapacity}`}
            />
            <Row
              label="Furnished"
              a={<span className="capitalize">{a.furnished}</span>}
              b={<span className="capitalize">{b.furnished}</span>}
            />
            <Row
              label="Available"
              a={new Date(a.availableFrom).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
              b={new Date(b.availableFrom).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            />
            <Row label="Min. stay" a={a.minimumStay} b={b.minimumStay} />

            {/* Inclusions */}
            <tr className="bg-slate-100">
              <td colSpan={3} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">What&apos;s included</td>
            </tr>
            {INCLUSIONS_LIST.map((inc) => (
              <Row key={inc} label={inc} a={<CheckVal val={a.inclusions.includes(inc)} />} b={<CheckVal val={b.inclusions.includes(inc)} />} />
            ))}

            {/* Facilities */}
            {(a.facilities.length > 0 || b.facilities.length > 0) && (
              <>
                <tr className="bg-slate-100">
                  <td colSpan={3} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Facilities</td>
                </tr>
                <Row label="Facilities" a={<Tags items={a.facilities} />} b={<Tags items={b.facilities} />} />
              </>
            )}

            {/* Room features */}
            {(a.roomFeatures?.length || b.roomFeatures?.length) ? (
              <>
                <tr className="bg-slate-100">
                  <td colSpan={3} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Room features</td>
                </tr>
                <Row label="Features" a={<Tags items={a.roomFeatures} />} b={<Tags items={b.roomFeatures} />} />
              </>
            ) : null}

            {/* Tenant preferences */}
            <tr className="bg-slate-100">
              <td colSpan={3} className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant preferences</td>
            </tr>
            <Row label="Gender" a={<span className="capitalize">{a.preferredGender}</span>} b={<span className="capitalize">{b.preferredGender}</span>} />
            <Row label="Pets" a={<CheckVal val={a.petsAllowed} />} b={<CheckVal val={b.petsAllowed} />} />
            <Row label="Smoking" a={<CheckVal val={a.smokingAllowed} />} b={<CheckVal val={b.smokingAllowed} />} />
            <Row
              label="Nationality"
              a={a.preferredNationality.length === 0 ? 'Any' : a.preferredNationality.join(', ')}
              b={b.preferredNationality.length === 0 ? 'Any' : b.preferredNationality.join(', ')}
            />
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 mt-6">
        <Link href={`/listings/${a.id}`} className="flex-1 text-center py-2.5 border border-teal-600 text-teal-600 font-semibold text-sm rounded-lg hover:bg-teal-50 transition-colors">
          View Listing A
        </Link>
        <Link href={`/listings/${b.id}`} className="flex-1 text-center py-2.5 border border-teal-600 text-teal-600 font-semibold text-sm rounded-lg hover:bg-teal-50 transition-colors">
          View Listing B
        </Link>
      </div>
    </div>
    </div>
  );
}

export default function ComparePageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-32 text-slate-400 text-sm">Loading...</div>}>
      <ComparePage />
    </Suspense>
  );
}
