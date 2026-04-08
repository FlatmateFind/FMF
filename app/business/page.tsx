'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2, PlusCircle, MapPin, DollarSign, Users, TrendingUp,
  SlidersHorizontal, X, ChevronDown, Calendar, Clock,
} from 'lucide-react';
import { SEED_BUSINESSES, BusinessListing, BusinessCategory } from '@/data/businesses';
import { POST_LANGUAGES } from '@/lib/types';
import { AUSTRALIAN_STATES } from '@/lib/types';
import ShareButton from '@/components/ShareButton';
import AdSlot from '@/components/AdSlot';

const CATEGORIES: BusinessCategory[] = [
  'Café', 'Restaurant', 'Food & Bev', 'Retail', 'Service', 'Online', 'Franchise', 'Other',
];

const PRICE_RANGES = [
  { label: 'Under $50k', max: 50000 },
  { label: '$50k – $100k', min: 50000, max: 100000 },
  { label: '$100k – $200k', min: 100000, max: 200000 },
  { label: '$200k+', min: 200000 },
];

const CAT_COLOR: Record<string, string> = {
  'Café': 'bg-amber-50 text-amber-700 border-amber-200',
  'Restaurant': 'bg-rose-50 text-rose-700 border-rose-200',
  'Food & Bev': 'bg-orange-50 text-orange-700 border-orange-200',
  'Retail': 'bg-blue-50 text-blue-700 border-blue-200',
  'Service': 'bg-teal-50 text-teal-700 border-teal-200',
  'Online': 'bg-violet-50 text-violet-700 border-violet-200',
  'Franchise': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Other': 'bg-slate-100 text-slate-600 border-slate-200',
};

function fmtPrice(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return `${d}d ago`;
}

export default function BusinessPage() {
  const [stateFilter, setStateFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const listings = useMemo(() => {
    return SEED_BUSINESSES.filter((b) => {
      if (stateFilter && b.state !== stateFilter) return false;
      if (catFilter && b.category !== catFilter) return false;
      if (langFilter && (b.postLanguage ?? 'English') !== langFilter) return false;
      if (priceFilter) {
        const range = PRICE_RANGES.find((r) => r.label === priceFilter);
        if (range) {
          if (range.min !== undefined && b.askingPrice < range.min) return false;
          if (range.max !== undefined && b.askingPrice >= range.max) return false;
        }
      }
      return b.status === 'active';
    });
  }, [stateFilter, catFilter, priceFilter, langFilter]);

  const hasFilters = stateFilter || catFilter || priceFilter || langFilter;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-700 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-purple-200">Business for Sale</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Buy a Business</h1>
              <p className="text-purple-200 text-sm sm:text-base max-w-xl">
                Cafés, restaurants, service businesses and more — find your next venture in Australia.
              </p>
            </div>
            <Link
              href="/business/post"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-colors shrink-0 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              List Your Business
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Filters</h3>
                {hasFilters && (
                  <button onClick={() => { setStateFilter(''); setCatFilter(''); setPriceFilter(''); setLangFilter(''); }}
                    className="text-[11px] text-rose-500 hover:text-rose-700 font-medium">Clear</button>
                )}
              </div>

              {/* State */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">State</label>
                <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white">
                  <option value="">All states</option>
                  {AUSTRALIAN_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>)}
                </select>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setCatFilter(catFilter === c ? '' : c)}
                      className={`px-2 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        catFilter === c ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Asking Price</label>
                <div className="flex flex-col gap-1.5">
                  {PRICE_RANGES.map((r) => (
                    <button key={r.label} onClick={() => setPriceFilter(priceFilter === r.label ? '' : r.label)}
                      className={`px-2 py-1.5 rounded-xl text-[11px] font-medium border text-left transition-all ${
                        priceFilter === r.label ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'
                      }`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Language</label>
                <div className="flex flex-wrap gap-1.5">
                  {POST_LANGUAGES.filter((l) => SEED_BUSINESSES.some((b) => (b.postLanguage ?? 'English') === l.label)).map(({ label, native }) => (
                    <button key={label} onClick={() => setLangFilter(langFilter === label ? '' : label)}
                      className={`px-2 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        langFilter === label ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'
                      }`}>
                      {label === native ? label : `${label} · ${native}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Listings */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">{listings.length}</span> {listings.length === 1 ? 'business' : 'businesses'} listed
              </p>
            </div>

            {listings.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500">No businesses match your filters</p>
                <button onClick={() => { setStateFilter(''); setCatFilter(''); setPriceFilter(''); setLangFilter(''); }}
                  className="mt-3 text-xs text-purple-600 hover:text-purple-800 font-medium">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((biz) => <BusinessCard key={biz.id} biz={biz} />)}
              </div>
            )}

            <div className="mt-6">
              <AdSlot id="business-bottom" className="rounded-2xl overflow-hidden" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function BusinessCard({ biz }: { biz: BusinessListing }) {
  const [expanded, setExpanded] = useState(false);
  const catStyle = CAT_COLOR[biz.category] ?? 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Purple accent bar */}
      <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-700" />

      <div className="p-4 flex-1 flex flex-col">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{biz.name}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{biz.suburb}, {biz.state}</span>
            </div>
          </div>
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 ${catStyle}`}>
            {biz.category}
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-3 mb-3 py-2.5 px-3 bg-purple-50 rounded-xl">
          <div>
            <p className="text-[10px] text-purple-500 font-medium uppercase tracking-wide">Asking Price</p>
            <p className="text-lg font-bold text-purple-700">{fmtPrice(biz.askingPrice)}</p>
          </div>
          {biz.weeklyRevenue && (
            <div className="border-l border-purple-100 pl-3">
              <p className="text-[10px] text-purple-500 font-medium uppercase tracking-wide">Weekly Rev.</p>
              <p className="text-sm font-bold text-purple-600">{fmtPrice(biz.weeklyRevenue)}/wk</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-2 mb-3">
          {biz.leaseMonthsRemaining && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 rounded-full px-2 py-0.5">
              <Clock className="w-3 h-3" /> {biz.leaseMonthsRemaining}mo lease
            </span>
          )}
          {biz.employees && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 rounded-full px-2 py-0.5">
              <Users className="w-3 h-3" /> {biz.employees} staff
            </span>
          )}
          {biz.established && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 rounded-full px-2 py-0.5">
              <Calendar className="w-3 h-3" /> Est. {biz.established}
            </span>
          )}
        </div>

        {/* Description */}
        <p className={`text-xs text-slate-600 leading-relaxed mb-3 ${expanded ? '' : 'line-clamp-3'}`}>
          {biz.description}
        </p>
        {biz.description.length > 140 && (
          <button onClick={() => setExpanded((v) => !v)}
            className="text-[11px] text-purple-600 hover:text-purple-800 font-medium mb-3 text-left flex items-center gap-1">
            {expanded ? 'Show less' : 'Read more'}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}

        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShareButton
              url={`https://flatmatefind.vercel.app/business`}
              title={`${biz.name} — ${biz.category} for sale in ${biz.suburb}, ${biz.state} | ${fmtPrice(biz.askingPrice)}`}
            />
            <span className="text-[10px] text-slate-400">{timeAgo(biz.postedAt)}</span>
          </div>
          <a
            href={`mailto:${biz.contactEmail}`}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Enquire
          </a>
        </div>
      </div>
    </div>
  );
}
