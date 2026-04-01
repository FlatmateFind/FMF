'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart, Star, Home, PlusCircle, MapPin, Bed, Bath,
  Calendar, Pause, Play, Trash2, MessageCircle, ChevronRight,
  Users, LayoutDashboard,
} from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useShortlist } from '@/hooks/useShortlist';
import { usePostedListings } from '@/hooks/usePostedListings';
import { listings } from '@/data/listings';
import { Listing } from '@/lib/types';
import ListingCard from '@/components/ListingCard';

type Tab = 'renter' | 'subletter';

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('renter');
  const { favorites, loaded: favLoaded } = useFavorites();
  const { shortlisted } = useShortlist();
  const { posted, toggleStatus, remove, loaded: postLoaded } = usePostedListings();

  const savedListings = listings.filter((l) => favorites.includes(l.id));
  const shortlistedListings = listings.filter((l) => shortlisted.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-teal-50 rounded-xl">
          <LayoutDashboard className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Manage your activity on FlatmateFind</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-8">
        <button
          onClick={() => setTab('renter')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'renter'
              ? 'bg-white text-teal-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          Renter
        </button>
        <button
          onClick={() => setTab('subletter')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'subletter'
              ? 'bg-white text-teal-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4" />
          Subletter
        </button>
      </div>

      {/* ── RENTER TAB ─────────────────────────────────────────────────── */}
      {tab === 'renter' && (
        <div className="space-y-10">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<Heart className="w-5 h-5 text-rose-500" />}
              label="Saved listings"
              value={favorites.length}
              bg="bg-rose-50"
            />
            <StatCard
              icon={<MessageCircle className="w-5 h-5 text-teal-500" />}
              label="Active chats"
              value={favorites.length > 0 ? favorites.length : 0}
              bg="bg-teal-50"
            />
            <StatCard
              icon={<Star className="w-5 h-5 text-amber-500" />}
              label="Shortlisted by hosts"
              value={0}
              bg="bg-amber-50"
              note="Feature coming soon"
            />
          </div>

          {/* Saved listings */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-current" />
                Saved Listings
              </h2>
              <Link href="/listings" className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1">
                Browse more <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {!favLoaded ? (
              <LoadingSpinner />
            ) : savedListings.length === 0 ? (
              <EmptyState
                icon={<Heart className="w-10 h-10 text-slate-300" />}
                title="No saved listings yet"
                description='Tap the ♡ heart on any listing to save it here.'
                action={{ label: 'Browse listings', href: '/listings' }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedListings.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── SUBLETTER TAB ──────────────────────────────────────────────── */}
      {tab === 'subletter' && (
        <div className="space-y-10">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<Home className="w-5 h-5 text-teal-500" />}
              label="My listings"
              value={posted.length}
              bg="bg-teal-50"
            />
            <StatCard
              icon={<Star className="w-5 h-5 text-amber-500" />}
              label="Shortlisted renters"
              value={shortlisted.length}
              bg="bg-amber-50"
            />
            <StatCard
              icon={<MessageCircle className="w-5 h-5 text-blue-500" />}
              label="Enquiries received"
              value={shortlisted.length}
              bg="bg-blue-50"
            />
          </div>

          {/* My Listings */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-teal-500" />
                My Listings
              </h2>
              <Link
                href="/post"
                className="flex items-center gap-1.5 text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Post a listing
              </Link>
            </div>

            {!postLoaded ? (
              <LoadingSpinner />
            ) : posted.length === 0 ? (
              <EmptyState
                icon={<Home className="w-10 h-10 text-slate-300" />}
                title="No listings posted yet"
                description="Post your first listing to start receiving enquiries from renters."
                action={{ label: '+ Post a listing', href: '/post' }}
              />
            ) : (
              <div className="space-y-3">
                {posted.map((listing) => (
                  <PostedListingRow
                    key={listing.id}
                    listing={listing}
                    onToggle={() => toggleStatus(listing.id)}
                    onRemove={() => remove(listing.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Shortlisted Renters */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
              <Star className="w-5 h-5 text-amber-500 fill-current" />
              Shortlisted Renters
            </h2>

            {shortlistedListings.length === 0 ? (
              <EmptyState
                icon={<Star className="w-10 h-10 text-slate-300" />}
                title="No renters shortlisted yet"
                description='Open a listing, click "Message Host", switch to Host view, then shortlist the renter.'
              />
            ) : (
              <div className="space-y-3">
                {shortlistedListings.map((listing) => (
                  <ShortlistedRenterRow key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function StatCard({
  icon, label, value, bg, note,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
  note?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-xl ${bg} shrink-0`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
        {note && <div className="text-xs text-slate-400 mt-0.5">{note}</div>}
      </div>
    </div>
  );
}

function EmptyState({
  icon, title, description, action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="text-center py-14 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="py-10 flex justify-center">
      <div className="w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PostedListingRow({
  listing,
  onToggle,
  onRemove,
}: {
  listing: import('@/hooks/usePostedListings').PostedListing;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-slate-900 truncate">{listing.title}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {listing.status === 'active' ? 'Active' : 'Paused'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {listing.address}, {listing.suburb} {listing.postcode}, {listing.city}
          </span>
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" />
            {listing.bedrooms} bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" />
            {listing.bathrooms} bath
          </span>
          <span className="font-semibold text-teal-600">
            {listing.currency} {listing.rentAmount}/{listing.period}
          </span>
        </div>
        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Posted {new Date(listing.postedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-teal-300 hover:text-teal-600 transition-colors"
          title={listing.status === 'active' ? 'Pause listing' : 'Activate listing'}
        >
          {listing.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={onRemove}
          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 transition-colors"
          title="Remove listing"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ShortlistedRenterRow({ listing }: { listing: Listing }) {
  return (
    <div className="bg-white border border-amber-200 rounded-xl p-4 flex items-center gap-4">
      <div className="p-2.5 bg-amber-50 rounded-xl shrink-0">
        <Star className="w-5 h-5 text-amber-500 fill-current" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 truncate">{listing.title}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {listing.location.suburb} {listing.location.postcode}, {listing.location.city}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Renter enquiry
          </span>
        </div>
      </div>
      <Link
        href={`/listings/${listing.id}`}
        className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
      >
        View chat <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
