'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home, PlusCircle, Search, SlidersHorizontal, X, MapPin,
  DollarSign, Bed, Bath, Calendar, Building2, CheckCircle2,
  XCircle, ArrowRight, ChevronDown, Sofa,
} from 'lucide-react';
import { SEED_TAKEOVERS, TakeoverListing, TakeoverPropertyType } from '@/data/takeovers';
import { AUSTRALIAN_STATES } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { usePostedTakeovers } from '@/hooks/usePostedTakeovers';
import AdSlot from '@/components/AdSlot';
import ShareButton from '@/components/ShareButton';

const PROPERTY_TYPES: { value: TakeoverPropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'unit',      label: 'Unit' },
  { value: 'house',     label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studio',    label: 'Studio' },
  { value: 'villa',     label: 'Villa' },
];

const FURNISHED_LABELS: Record<string, string> = {
  furnished: 'Furnished', unfurnished: 'Unfurnished', partial: 'Semi-furnished',
};

const FURNISHED_COLORS: Record<string, string> = {
  furnished: 'bg-teal-50 text-teal-700',
  unfurnished: 'bg-slate-100 text-slate-600',
  partial: 'bg-amber-50 text-amber-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function TakeoverPage() {
  const { user } = useAuth();
  const { all: userTakeovers } = usePostedTakeovers();
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<TakeoverPropertyType | ''>('');
  const [maxRent, setMaxRent] = useState('');
  const [bedsFilter, setBedsFilter] = useState('');
  const [agentOpenFilter, setAgentOpenFilter] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allListings = useMemo(() => {
    const active = userTakeovers.filter((t) => t.status === 'active');
    const combined = [...active, ...SEED_TAKEOVERS];
    const seen = new Set<string>();
    return combined.filter((t) => { if (seen.has(t.id)) return false; seen.add(t.id); return true; });
  }, [userTakeovers]);

  const filtered = useMemo(() => allListings
    .filter((t) => t.status === 'active')
    .filter((t) => !stateFilter || t.state === stateFilter)
    .filter((t) => !typeFilter || t.propertyType === typeFilter)
    .filter((t) => !maxRent || t.rent <= Number(maxRent))
    .filter((t) => !bedsFilter || t.bedrooms >= Number(bedsFilter))
    .filter((t) => !agentOpenFilter || t.agentOpenToNew)
    .filter((t) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return `${t.suburb} ${t.city} ${t.state} ${t.description} ${t.propertyType}`.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()),
  [allListings, stateFilter, typeFilter, maxRent, bedsFilter, agentOpenFilter, query]);

  const hasFilters = stateFilter || typeFilter || maxRent || bedsFilter || agentOpenFilter;
  const clearAll = () => { setStateFilter(''); setTypeFilter(''); setMaxRent(''); setBedsFilter(''); setAgentOpenFilter(false); };

  const FilterContent = () => (
    <div className="space-y-5">
      {/* State */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">State</p>
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-slate-700">
          <option value="">All states</option>
          {AUSTRALIAN_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>)}
        </select>
      </div>

      {/* Property type */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Property Type</p>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map(({ value, label }) => (
            <button key={value} onClick={() => setTypeFilter(typeFilter === value ? '' : value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                typeFilter === value
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Max rent */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Max Rent ($/wk)</p>
        <div className="flex flex-wrap gap-1.5">
          {['400','600','800','1000','1500'].map((v) => (
            <button key={v} onClick={() => setMaxRent(maxRent === v ? '' : v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                maxRent === v
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'
              }`}>
              ≤${v}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Min Bedrooms</p>
        <div className="flex gap-1.5">
          {['0','1','2','3'].map((v) => (
            <button key={v} onClick={() => setBedsFilter(bedsFilter === v ? '' : v)}
              className={`w-10 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                bedsFilter === v
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'
              }`}>
              {v === '0' ? 'S' : `${v}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Agent confirmed */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input type="checkbox" checked={agentOpenFilter} onChange={(e) => setAgentOpenFilter(e.target.checked)}
            className="w-4 h-4 rounded text-orange-500 border-slate-300 focus:ring-orange-400" />
          <div>
            <p className="text-xs font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">Agent confirmed open</p>
            <p className="text-[11px] text-slate-400">Agent has agreed to accept new applicants</p>
          </div>
        </label>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button onClick={clearAll}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg py-2 transition-colors">
          <X className="w-3.5 h-3.5" /> Clear all filters
        </button>
      )}

      <AdSlot size="rectangle" slotId="takeover-sidebar" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white mb-8 px-6 py-8 sm:px-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-3">
            <Home className="w-3.5 h-3.5" /> Unit Takeover
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">Take Over a Lease</h1>
          <p className="text-orange-100 text-sm sm:text-base leading-relaxed mb-5">
            Find subletters who are leaving and want to pass their lease to you. Skip the queue — move in directly as the new head tenant and deal with the agent yourself.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/takeover/post"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-sm">
              <PlusCircle className="w-4 h-4" /> Post a Takeover
            </Link>
            <a href="#listings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-colors text-sm">
              Browse listings <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* How it works strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', title: 'Find a listing', desc: 'Browse subletters leaving their unit and passing on the lease.' },
          { step: '2', title: 'Contact the subletter', desc: 'Get details about the property, agent, and remaining lease term.' },
          { step: '3', title: 'Apply through the agent', desc: 'Submit your application directly to the real estate agent for approval.' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3.5">
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {step}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5" id="listings">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search suburb, city, property type..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm" />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile filter toggle */}
      <div className="flex items-center gap-2 mb-4 lg:hidden">
        <button onClick={() => setSidebarOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-orange-400 hover:text-orange-600 transition-colors bg-white">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && (
            <span className="w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {[stateFilter,typeFilter,maxRent,bedsFilter,agentOpenFilter].filter(Boolean).length}
            </span>
          )}
        </button>
        <p className="text-sm text-slate-500 ml-auto">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-slate-800">Filters</span>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <FilterContent />
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-slate-800 text-sm">Filters</span>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 transition-colors">Clear all</button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Cards */}
        <div className="flex-1 min-w-0">
          <div className="hidden lg:flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} available</p>
            <Link href="/takeover/post" className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-800 transition-colors">
              <PlusCircle className="w-3.5 h-3.5" /> Post your takeover
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No takeover listings match your filters.</p>
              {hasFilters && <button onClick={clearAll} className="mt-3 text-xs text-orange-500 hover:underline">Clear filters</button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filtered.map((listing, i) => (
                <>
                  <TakeoverCard key={listing.id} listing={listing} user={user} />
                  {i === 5 && (
                    <div key="ad" className="xl:col-span-2">
                      <AdSlot size="leaderboard" slotId="takeover-inline" />
                    </div>
                  )}
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TakeoverCard({ listing, user }: { listing: TakeoverListing; user: unknown }) {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-orange-200 transition-all duration-150 group">
      {/* Image */}
      {listing.images[0] && (
        <div className="relative h-44 overflow-hidden">
          <Image src={listing.images[0]} alt={`${listing.suburb} ${listing.propertyType}`}
            fill className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1280px) 100vw, 50vw" />
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-full capitalize shadow-sm">
              {listing.propertyType}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm ${FURNISHED_COLORS[listing.furnished]}`}>
              {FURNISHED_LABELS[listing.furnished]}
            </span>
          </div>
          {/* Agent confirmed badge */}
          <div className="absolute top-3 right-3">
            {listing.agentOpenToNew ? (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                <CheckCircle2 className="w-3 h-3" /> Agent confirmed
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 bg-slate-600 text-white text-[10px] font-semibold rounded-full shadow-sm">
                <XCircle className="w-3 h-3" /> Apply via agent
              </span>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-4">
        {/* Location + price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-slate-900 text-[15px] leading-snug">
              {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms}-Bed`} {listing.propertyType.charAt(0).toUpperCase() + listing.propertyType.slice(1)}
            </h3>
            <p className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              {listing.suburb}, {listing.city} {listing.state}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-orange-600">${listing.rent.toLocaleString()}<span className="text-xs font-normal text-slate-400">/wk</span></p>
            <p className="text-xs text-slate-400">Bond ${listing.bond.toLocaleString()}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          {listing.bedrooms > 0 ? (
            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{listing.bedrooms} bed</span>
          ) : (
            <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" />Studio</span>
          )}
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{listing.bathrooms} bath</span>
          {listing.inclusions && listing.inclusions.length > 0 && (
            <span className="flex items-center gap-1"><Sofa className="w-3.5 h-3.5" />{listing.inclusions.length} inclusions</span>
          )}
          <span className="flex items-center gap-1 ml-auto text-slate-400">{timeAgo(listing.postedAt)}</span>
        </div>

        {/* Available from */}
        <div className="flex items-center gap-1.5 text-xs mb-3">
          <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="text-slate-600">Available from <strong className="text-slate-800">{formatDate(listing.availableFrom)}</strong></span>
          {listing.leaseEndDate && (
            <span className="text-slate-400 ml-1">· Lease to {formatDate(listing.leaseEndDate)}</span>
          )}
        </div>

        {/* Agency */}
        {listing.agencyName && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            {listing.agencyName}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">{listing.description}</p>

        {/* Inclusions chips */}
        {listing.inclusions && listing.inclusions.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.inclusions.slice(0, 3).map((inc) => (
              <span key={inc} className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-[10px] font-medium">
                {inc}
              </span>
            ))}
            {listing.inclusions.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px]">+{listing.inclusions.length - 3}</span>
            )}
          </div>
        )}

        {/* Share row */}
        <div className="flex items-center gap-2 mb-2">
          <ShareButton url="https://flatmatefind.vercel.app/takeover" title={`Unit Takeover — ${listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms}-Bed`} ${listing.propertyType} in ${listing.suburb}, ${listing.state} $${listing.rent}/wk`} />
          <span className="text-[10px] text-slate-400">Share on Facebook</span>
        </div>

        {/* Contact button */}
        {showEmail ? (
          <a href={`mailto:${listing.contactEmail}`}
            className="flex items-center justify-center gap-1.5 w-full text-xs font-medium py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors">
            {listing.contactEmail}
          </a>
        ) : (
          <button
            onClick={() => {
              if (!user) { window.location.href = '/auth/signin?from=/takeover'; return; }
              setShowEmail(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
            {user ? 'Contact subletter' : 'Sign in to contact'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <p className="text-[10px] text-slate-400 text-center mt-2">
          Posted by {listing.contactName}
        </p>
      </div>
    </div>
  );
}
