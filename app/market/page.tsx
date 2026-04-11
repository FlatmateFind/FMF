'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import NavRow from '@/components/NavRow';

const FIND_MORE_TABS = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Events', href: '/events' },
  { label: 'Market', href: '/market' },
  { label: 'Business', href: '/business' },
  { label: 'Community', href: '/community' },
  { label: 'Renters', href: '/renters' },
  { label: 'Takeover', href: '/takeover' },
];
import {
  ShoppingBag, PlusCircle, MapPin, Tag, Wrench, ChevronDown,
  Star, Package,
} from 'lucide-react';
import {
  SEED_MARKET, MarketListing, ProductCategory, ServiceCategory,
  ProductCondition,
} from '@/data/market';
import { POST_LANGUAGES, AUSTRALIAN_STATES } from '@/lib/types';
import ShareButton from '@/components/ShareButton';
import AdSlot from '@/components/AdSlot';

const PRODUCT_CATS: ProductCategory[] = [
  'Electronics', 'Food & Snacks', 'Clothing', 'Furniture', 'Books & Study', 'Vehicles', 'Kitchen', 'Sports & Fitness', 'Other',
];
const SERVICE_CATS: ServiceCategory[] = [
  'Tax & Accounting', 'Visa Help', 'Removalist', 'Cleaning', 'Driving Lessons', 'Tutoring', 'Photography', 'IT & Tech', 'Beauty & Wellness', 'Other',
];
const CONDITIONS: ProductCondition[] = ['New', 'Like New', 'Good', 'Fair', 'For Parts'];

const CONDITION_COLOR: Record<ProductCondition, string> = {
  'New': 'bg-teal-50 text-teal-700 border-teal-200',
  'Like New': 'bg-blue-50 text-blue-700 border-blue-200',
  'Good': 'bg-slate-100 text-slate-600 border-slate-200',
  'Fair': 'bg-amber-50 text-amber-700 border-amber-200',
  'For Parts': 'bg-rose-50 text-rose-600 border-rose-200',
};

const PRICE_LABELS: Record<string, string> = {
  'Fixed': 'Fixed', 'Negotiable': 'Nego.', 'Free': 'FREE', 'Per Hour': '/hr', 'Contact': 'Contact',
};

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return `${d}d ago`;
}

export default function MarketPage() {
  const [kindFilter, setKindFilter] = useState<'all' | 'product' | 'service'>('all');
  const [catFilter, setCatFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [condFilter, setCondFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');

  const listings = useMemo(() => {
    return SEED_MARKET.filter((m) => {
      if (kindFilter !== 'all' && m.kind !== kindFilter) return false;
      if (catFilter && m.category !== catFilter) return false;
      if (stateFilter && m.state !== stateFilter) return false;
      if (condFilter && m.condition !== condFilter) return false;
      if (langFilter && (m.postLanguage ?? 'English') !== langFilter) return false;
      return m.status === 'active';
    });
  }, [kindFilter, catFilter, stateFilter, condFilter, langFilter]);

  const hasFilters = catFilter || stateFilter || condFilter || langFilter || kindFilter !== 'all';

  const activeCats = kindFilter === 'service' ? SERVICE_CATS : kindFilter === 'product' ? PRODUCT_CATS : [...PRODUCT_CATS, ...SERVICE_CATS];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-100">Marketplace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Buy, Sell & Services</h1>
              <p className="text-amber-100 text-sm sm:text-base max-w-xl">
                Second-hand items, food, snacks — and local services like tax, visa help, removalists, tutoring and more.
              </p>
            </div>
            <Link
              href="/market/post"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors shrink-0 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Post Item / Service
            </Link>
          </div>
          <NavRow tabs={FIND_MORE_TABS} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Kind tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'product', 'service'] as const).map((k) => (
            <button key={k} onClick={() => { setKindFilter(k); setCatFilter(''); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all capitalize ${
                kindFilter === k ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
              }`}>
              {k === 'all' && <ShoppingBag className="w-3.5 h-3.5" />}
              {k === 'product' && <Package className="w-3.5 h-3.5" />}
              {k === 'service' && <Wrench className="w-3.5 h-3.5" />}
              {k === 'all' ? 'All' : k === 'product' ? 'Products' : 'Services'}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm sticky top-20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Filters</h3>
                {hasFilters && (
                  <button onClick={() => { setCatFilter(''); setStateFilter(''); setCondFilter(''); setLangFilter(''); setKindFilter('all'); }}
                    className="text-[11px] text-rose-500 hover:text-rose-700 font-medium">Clear</button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">State</label>
                <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white">
                  <option value="">All states</option>
                  {AUSTRALIAN_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {activeCats.map((c) => (
                    <button key={c} onClick={() => setCatFilter(catFilter === c ? '' : c)}
                      className={`px-2 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        catFilter === c ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {kindFilter !== 'service' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Condition</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CONDITIONS.map((c) => (
                      <button key={c} onClick={() => setCondFilter(condFilter === c ? '' : c)}
                        className={`px-2 py-1 rounded-full text-[11px] font-medium border transition-all ${
                          condFilter === c ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Language</label>
                <div className="flex flex-wrap gap-1.5">
                  {POST_LANGUAGES.filter((l) => SEED_MARKET.some((m) => (m.postLanguage ?? 'English') === l.label)).map(({ label, native }) => (
                    <button key={label} onClick={() => setLangFilter(langFilter === label ? '' : label)}
                      className={`px-2 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        langFilter === label ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
                      }`}>
                      {label === native ? label : `${label} · ${native}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Listings grid */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-500 mb-4">
              <span className="font-semibold text-slate-800">{listings.length}</span> {listings.length === 1 ? 'listing' : 'listings'}
            </p>

            {listings.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500">No listings match your filters</p>
                <button onClick={() => { setCatFilter(''); setStateFilter(''); setCondFilter(''); setLangFilter(''); setKindFilter('all'); }}
                  className="mt-3 text-xs text-amber-600 hover:text-amber-800 font-medium">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((item) => <MarketCard key={item.id} item={item} />)}
              </div>
            )}

            <div className="mt-6">
              <AdSlot size="leaderboard" slotId="market-bottom" className="rounded-2xl overflow-hidden" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MarketCard({ item }: { item: MarketListing }) {
  const isService = item.kind === 'service';
  const condColor = item.condition ? CONDITION_COLOR[item.condition] : '';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Accent bar — always amber to match page header */}
      <div className="h-1 bg-amber-500" />

      <div className="p-4 flex-1 flex flex-col">
        {/* Kind badge — amber for Product, indigo for Service */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
            isService ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {isService ? <Wrench className="w-2.5 h-2.5" /> : <Package className="w-2.5 h-2.5" />}
            {isService ? 'Service' : 'Product'}
          </span>
          {item.condition && (
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${condColor}`}>
              {item.condition}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 mb-1">{item.title}</h3>

        {/* Location + category */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.suburb}, {item.state}</span>
          <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{item.category}</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          {item.priceType === 'Free' ? (
            <span className="text-lg font-bold text-teal-600">FREE</span>
          ) : item.priceType === 'Contact' ? (
            <span className="text-sm font-semibold text-slate-500">Contact for price</span>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-800">${item.price.toLocaleString()}</span>
              {item.priceType === 'Per Hour' && <span className="text-xs text-slate-400">/hr</span>}
              {item.priceType === 'Negotiable' && <span className="text-xs text-slate-400">nego.</span>}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3 flex-1">{item.description}</p>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShareButton
              url="https://flatmatefind.vercel.app/market"
              title={`${item.title} — ${item.priceType === 'Free' ? 'FREE' : `$${item.price}`} in ${item.suburb}, ${item.state}`}
            />
            <span className="text-[10px] text-slate-400">{timeAgo(item.postedAt)}</span>
          </div>
          <a href={`mailto:${item.contactEmail}`}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-colors">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
