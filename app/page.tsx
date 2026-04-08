import Link from 'next/link';
import { ArrowRight, ShieldCheck, Users, MessageCircle, Globe, SlidersHorizontal, Briefcase, Heart, GitCompareArrows, ArrowUpDown, Star, Flag } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ListingCard from '@/components/ListingCard';
import AdSlot from '@/components/AdSlot';
import LiveStats from '@/components/LiveStats';
import HomePopularListings from '@/components/HomePopularListings';
import HomeNewListings from '@/components/HomeNewListings';
import { FEATURED_LISTINGS, listings } from '@/data/listings';
import { AUSTRALIAN_STATES } from '@/lib/types';

const STATE_META: Record<string, { highlight: string }> = {
  NSW: { highlight: 'Sydney & more' },
  VIC: { highlight: 'Melbourne & more' },
  QLD: { highlight: 'Brisbane & more' },
  WA:  { highlight: 'Perth & more' },
  SA:  { highlight: 'Adelaide & more' },
  TAS: { highlight: 'Hobart & more' },
  ACT: { highlight: 'Canberra & more' },
  NT:  { highlight: 'Darwin & more' },
};


const WHY_BENEFITS = [
  {
    icon: SlidersHorizontal,
    color: 'bg-blue-50 text-blue-600',
    title: 'Filter by Language & Nationality',
    description: 'Find a home where you actually feel welcome. Filter listings by the host\'s language and nationality preference — so you can connect with people who share your background or speak your language.',
  },
  {
    icon: ArrowUpDown,
    color: 'bg-indigo-50 text-indigo-600',
    title: 'Sort by Availability & Price',
    description: 'Moving on a specific date? Sort listings by availability so you only see rooms ready when you need them. Or sort by price to find the best value without endless scrolling.',
  },
  {
    icon: Heart,
    color: 'bg-pink-50 text-pink-600',
    title: 'Save Listings',
    description: 'Heart any room you like and come back to it later. Your saved listings are always one tap away — no account required to start building your shortlist.',
  },
  {
    icon: GitCompareArrows,
    color: 'bg-teal-50 text-teal-600',
    title: 'Compare Listings Side by Side',
    description: 'Can\'t decide between two rooms? Add them to the compare bar and view price, bedrooms, inclusions, and location side by side. Make confident decisions, not guesses.',
  },
  {
    icon: Users,
    color: 'bg-violet-50 text-violet-600',
    title: 'Shortlist Renters',
    description: 'Subletters can browse renter profiles and shortlist candidates who match their household. Find someone with the right lifestyle, budget, and move-in date before they\'re gone.',
  },
  {
    icon: Briefcase,
    color: 'bg-orange-50 text-orange-600',
    title: 'Jobs Nearby',
    description: 'Need work as well as a room? Our built-in jobs board lists casual, part-time, and full-time roles near you. Room and income — sorted in one place.',
  },
  {
    icon: MessageCircle,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Direct Contact, No Middleman',
    description: 'Message hosts directly — no portal delays, no gatekeeping. Get a real response from the person who actually lives there, fast.',
  },
  {
    icon: ShieldCheck,
    color: 'bg-rose-50 text-rose-600',
    title: 'Safer Listings',
    description: 'Verified hosts, built-in rate limiting, and a one-click report button keep scams off the board. Every listing is monitored so you can search with confidence.',
  },
  {
    icon: Globe,
    color: 'bg-sky-50 text-sky-600',
    title: 'One Community — Not Twenty',
    description: 'Stop juggling 20 different Facebook groups. FlatmateFind brings rooms, renters, jobs, and community all into one place — the only tab you need open.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight mb-4 whitespace-nowrap">
              Your Next Room is Here
            </h1>
            <p className="text-sm sm:text-xl text-teal-100 mb-10 max-w-2xl mx-auto whitespace-nowrap">
              Free to browse. No fees. Message hosts directly.
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

      {/* ── New listings ─────────────────────────────────────────────────── */}
      <HomeNewListings />

      {/* ── Ad banner ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdSlot size="leaderboard" slotId="home-leaderboard" />
      </div>

      {/* ── Popular listings ──────────────────────────────────────────────── */}
      <HomePopularListings />

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
              const meta = STATE_META[state.abbr] ?? { highlight: 'Australia' };
              return (
                <Link
                  key={state.abbr}
                  href={`/listings?state=${encodeURIComponent(state.abbr)}`}
                  className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-teal-600 to-teal-800 hover:from-teal-500 hover:to-teal-700"
                >
                  <div className="flex flex-col items-start gap-1 px-5 py-5 text-white">
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="font-extrabold text-2xl leading-tight tracking-tight">{state.abbr}</span>
                      <span className="text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5 whitespace-nowrap">
                        {count > 0 ? `${count} listing${count !== 1 ? 's' : ''}` : 'Coming soon'}
                      </span>
                    </div>
                    <span className="text-sm text-white/90 font-medium leading-tight">{state.name}</span>
                    <span className="text-xs text-white/60 mt-0.5">{meta.highlight}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why FlatmateFind ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest text-teal-600 uppercase mb-3">Why FlatmateFind</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Everything you need to find your perfect room</h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            Built around the features that actually matter — not just a list of rooms, but the tools to find the right one.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_BENEFITS.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${b.color}`}>
                <b.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{b.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            Start browsing for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
