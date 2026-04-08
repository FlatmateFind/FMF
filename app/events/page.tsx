'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarDays, PlusCircle, MapPin, Clock, Ticket, Users2,
  ChevronDown, PartyPopper, UtensilsCrossed, Trophy, Palette,
  Music2, ShoppingBag, Users, GraduationCap, Gamepad2, Tag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SEED_EVENTS, EventListing, EventCategory } from '@/data/events';
import { POST_LANGUAGES, AUSTRALIAN_STATES } from '@/lib/types';
import ShareButton from '@/components/ShareButton';
import AdSlot from '@/components/AdSlot';

const CATEGORIES: EventCategory[] = [
  'Social', 'Food & Drink', 'Sports', 'Arts & Culture', 'Music', 'Markets', 'Community', 'Study & Career', 'Games & Fun', 'Other',
];

const CAT_ICON: Record<EventCategory, LucideIcon> = {
  'Social': PartyPopper,
  'Food & Drink': UtensilsCrossed,
  'Sports': Trophy,
  'Arts & Culture': Palette,
  'Music': Music2,
  'Markets': ShoppingBag,
  'Community': Users,
  'Study & Career': GraduationCap,
  'Games & Fun': Gamepad2,
  'Other': Tag,
};

const CAT_COLOR: Record<string, string> = {
  'Social': 'bg-pink-50 text-pink-700 border-pink-200',
  'Food & Drink': 'bg-orange-50 text-orange-700 border-orange-200',
  'Sports': 'bg-teal-50 text-teal-700 border-teal-200',
  'Arts & Culture': 'bg-violet-50 text-violet-700 border-violet-200',
  'Music': 'bg-purple-50 text-purple-700 border-purple-200',
  'Markets': 'bg-amber-50 text-amber-700 border-amber-200',
  'Community': 'bg-blue-50 text-blue-700 border-blue-200',
  'Study & Career': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Games & Fun': 'bg-rose-50 text-rose-700 border-rose-200',
  'Other': 'bg-slate-100 text-slate-600 border-slate-200',
};

function formatEventDate(iso: string, endIso?: string) {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  const start = d.toLocaleDateString('en-AU', opts);
  if (!endIso) return start;
  const end = new Date(endIso).toLocaleDateString('en-AU', opts);
  return `${start} – ${end}`;
}

function isUpcoming(iso: string) {
  return new Date(iso) > new Date();
}

function daysUntil(iso: string) {
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  if (diff < 0) return null;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

export default function EventsPage() {
  const [catFilter, setCatFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState<'' | 'Free' | 'Paid'>('');
  const [langFilter, setLangFilter] = useState('');

  const listings = useMemo(() => {
    return SEED_EVENTS.filter((ev) => {
      if (catFilter && ev.category !== catFilter) return false;
      if (stateFilter && ev.state !== stateFilter) return false;
      if (priceFilter && ev.priceType !== priceFilter) return false;
      if (langFilter && (ev.postLanguage ?? 'English') !== langFilter) return false;
      return ev.status === 'active';
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [catFilter, stateFilter, priceFilter, langFilter]);

  const hasFilters = catFilter || stateFilter || priceFilter || langFilter;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-rose-100">Local Events</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Events Near You</h1>
              <p className="text-rose-100 text-sm sm:text-base max-w-xl">
                Markets, social meetups, sports, food events, workshops — discover what&apos;s happening in your community.
              </p>
            </div>
            <Link
              href="/events/post"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition-colors shrink-0 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Post an Event
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm sticky top-20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Filters</h3>
                {hasFilters && (
                  <button onClick={() => { setCatFilter(''); setStateFilter(''); setPriceFilter(''); setLangFilter(''); }}
                    className="text-[11px] text-rose-500 hover:text-rose-700 font-medium">Clear</button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">State</label>
                <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                  <option value="">All states</option>
                  {AUSTRALIAN_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setCatFilter(catFilter === c ? '' : c)}
                      className={`px-2 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        catFilter === c ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                      }`}>
                      {(() => { const Icon = CAT_ICON[c]; return <Icon className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />; })()} {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Price</label>
                <div className="flex gap-2">
                  {(['Free', 'Paid'] as const).map((p) => (
                    <button key={p} onClick={() => setPriceFilter(priceFilter === p ? '' : p)}
                      className={`flex-1 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                        priceFilter === p ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Language</label>
                <div className="flex flex-wrap gap-1.5">
                  {POST_LANGUAGES.filter((l) => SEED_EVENTS.some((ev) => (ev.postLanguage ?? 'English') === l.label)).map(({ label, native }) => (
                    <button key={label} onClick={() => setLangFilter(langFilter === label ? '' : label)}
                      className={`px-2 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        langFilter === label ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                      }`}>
                      {label === native ? label : `${label} · ${native}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Events list */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-500 mb-4">
              <span className="font-semibold text-slate-800">{listings.length}</span> {listings.length === 1 ? 'event' : 'events'}
            </p>

            {listings.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500">No events match your filters</p>
                <button onClick={() => { setCatFilter(''); setStateFilter(''); setPriceFilter(''); setLangFilter(''); }}
                  className="mt-3 text-xs text-rose-500 hover:text-rose-700 font-medium">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((ev) => <EventCard key={ev.id} ev={ev} />)}
              </div>
            )}

            <div className="mt-6">
              <AdSlot size="leaderboard" slotId="events-bottom" className="rounded-2xl overflow-hidden" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function EventCard({ ev }: { ev: EventListing }) {
  const [expanded, setExpanded] = useState(false);
  const catStyle = CAT_COLOR[ev.category] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  const countdown = daysUntil(ev.date);
  const upcoming = isUpcoming(ev.date);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Accent */}
      <div className="h-1 bg-gradient-to-r from-rose-400 to-pink-600" />

      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{ev.title}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{ev.venue ? `${ev.venue}, ` : ''}{ev.suburb}, {ev.state}</span>
            </div>
          </div>
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 ${catStyle}`}>
            {(() => { const Icon = CAT_ICON[ev.category]; return <Icon className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />; })()} {ev.category}
          </span>
        </div>

        {/* Date / time */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-rose-50 px-2.5 py-1.5 rounded-xl">
            <CalendarDays className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="font-medium">{formatEventDate(ev.date, ev.endDate)}</span>
          </div>
          {ev.time && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Clock className="w-3 h-3" />{ev.time}
            </div>
          )}
        </div>

        {/* Price + countdown */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            ev.priceType === 'Free'
              ? 'bg-teal-50 text-teal-700 border-teal-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <Ticket className="w-3 h-3" />
            {ev.priceType === 'Free' ? 'Free' : `$${ev.price}`}
          </span>
          {upcoming && countdown && (
            <span className="text-[11px] font-semibold text-rose-500">{countdown}</span>
          )}
          {!upcoming && (
            <span className="text-[11px] text-slate-400 italic">Past event</span>
          )}
        </div>

        {/* Description */}
        <p className={`text-xs text-slate-600 leading-relaxed mb-3 flex-1 ${expanded ? '' : 'line-clamp-3'}`}>
          {ev.description}
        </p>
        {ev.description.length > 140 && (
          <button onClick={() => setExpanded((v) => !v)}
            className="text-[11px] text-rose-500 hover:text-rose-700 font-medium mb-2 text-left flex items-center gap-1">
            {expanded ? 'Show less' : 'Read more'}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Organiser */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
          <Users2 className="w-3 h-3 shrink-0" />
          <span>by <span className="font-medium text-slate-700">{ev.organizer}</span></span>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <ShareButton
            url={ev.link ?? 'https://flatmatefind.vercel.app/events'}
            title={`${ev.title} — ${formatEventDate(ev.date)} in ${ev.suburb}, ${ev.state}`}
          />
          <div className="flex items-center gap-2">
            {ev.link && (
              <a href={ev.link} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors">
                Details
              </a>
            )}
            <a href={`mailto:${ev.contactEmail}`}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-colors">
              {ev.priceType === 'Free' ? 'RSVP' : 'Book'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
