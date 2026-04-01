import Link from 'next/link';
import { ArrowRight, Home, Search, MessageCircle } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ListingCard from '@/components/ListingCard';
import LiveStats from '@/components/LiveStats';
import { FEATURED_LISTINGS, listings } from '@/data/listings';
import { AUSTRALIAN_STATES } from '@/lib/types';

const STATE_META: Record<string, { icon: string; color: string; highlight: string }> = {
  NSW: { icon: '🌉', color: 'from-blue-500 to-blue-700',      highlight: 'Sydney & more' },
  VIC: { icon: '🚊', color: 'from-purple-500 to-purple-700',  highlight: 'Melbourne & more' },
  QLD: { icon: '☀️', color: 'from-amber-400 to-orange-600',  highlight: 'Brisbane, Gold Coast & more' },
  WA:  { icon: '🦢', color: 'from-yellow-400 to-amber-600',  highlight: 'Perth & surrounds' },
  SA:  { icon: '🍷', color: 'from-rose-500 to-rose-700',      highlight: 'Adelaide & Barossa' },
  TAS: { icon: '⛵', color: 'from-sky-500 to-blue-700',       highlight: 'Hobart & Launceston' },
  ACT: { icon: '🏛️', color: 'from-slate-500 to-slate-700',  highlight: 'Canberra' },
  NT:  { icon: '🌴', color: 'from-green-500 to-emerald-700',  highlight: 'Darwin & Alice Springs' },
};


const steps = [
  {
    icon: Home,
    step: '1',
    title: 'Post your listing',
    description: 'Fill in your property details, preferred tenants and availability in minutes.',
  },
  {
    icon: Search,
    step: '2',
    title: 'Browse & filter',
    description: 'Search by city, budget, inclusions, nationality preference and more.',
  },
  {
    icon: MessageCircle,
    step: '3',
    title: 'Contact & move in',
    description: 'Message the owner or current tenant directly and arrange your move.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Find Your Perfect Flatmate &amp; Home
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
              Browse thousands of rooms, apartments and houses for rent. Filter by inclusions,
              nationality preferences and more.
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar size="lg" placeholder="Search by suburb, city, or keyword..." />
            </div>
          </div>
        </div>
      </section>

      {/* ── Live stats bar ───────────────────────────────────────────────── */}
      <LiveStats />

      {/* ── Featured listings ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Listings</h2>
            <p className="text-slate-500 mt-1 text-sm">Hand-picked rooms and apartments</p>
          </div>
          <Link
            href="/listings"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_LISTINGS.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            Browse All {listings.length} Listings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Browse by state ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Browse by State</h2>
            <p className="text-slate-500 text-sm">Find rooms and share houses across all states &amp; territories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {AUSTRALIAN_STATES.map((state) => {
              const count = listings.filter((l) => l.location.state === state.abbr).length;
              const meta = STATE_META[state.abbr] ?? { icon: '🏙️', color: 'from-slate-400 to-slate-600', highlight: 'Australia' };
              return (
                <Link
                  key={state.abbr}
                  href={`/listings?state=${encodeURIComponent(state.abbr)}`}
                  className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Gradient bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${meta.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  {/* Content */}
                  <div className="relative flex flex-col items-start gap-1 px-5 py-5 text-white">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-3xl leading-none drop-shadow-sm">{meta.icon}</span>
                      <span className="text-xs font-bold bg-white/25 rounded-full px-2 py-0.5">
                        {count > 0 ? `${count} listing${count !== 1 ? 's' : ''}` : 'Coming soon'}
                      </span>
                    </div>
                    <span className="font-extrabold text-xl leading-tight drop-shadow-sm">{state.abbr}</span>
                    <span className="text-xs text-white/80 leading-tight">{state.name}</span>
                    <span className="text-[11px] text-white/65 mt-0.5">{meta.highlight}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">How It Works</h2>
          <p className="text-slate-500 text-sm">Three simple steps to find your perfect home</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 relative">
                <s.icon className="w-5 h-5 text-teal-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
