'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Users, Search, Share2, ChevronRight, ExternalLink, Home,
  Megaphone, MapPin, Lightbulb, Copy, CheckCheck, Facebook,
} from 'lucide-react';

interface FBGroup {
  name: string;
  members: string;
  category: 'General' | 'Students' | 'Expats' | 'Subletters' | 'Asian community';
  searchQuery: string;
  description: string;
}

const GROUP_CATEGORY_COLORS: Record<FBGroup['category'], string> = {
  'General':         'bg-blue-100 text-blue-700',
  'Students':        'bg-amber-100 text-amber-700',
  'Expats':          'bg-purple-100 text-purple-700',
  'Subletters':      'bg-teal-100 text-teal-700',
  'Asian community': 'bg-rose-100 text-rose-700',
};

const groups: Record<string, FBGroup[]> = {
  'New South Wales': [
    {
      name: 'Sydney Rooms for Rent & Share Houses',
      members: '95,000+',
      category: 'General',
      searchQuery: 'Sydney Rooms for Rent Share Houses',
      description: 'The largest Sydney housing group. Daily posts covering inner-city suburbs, transport hubs and student areas.',
    },
    {
      name: 'Sydney Share Accommodation',
      members: '60,000+',
      category: 'General',
      searchQuery: 'Sydney Share Accommodation',
      description: 'Rooms, studios and whole apartments across Greater Sydney. Active moderation keeps spam low.',
    },
    {
      name: 'International Students Sydney – Accommodation',
      members: '45,000+',
      category: 'Students',
      searchQuery: 'International Students Sydney Accommodation',
      description: 'Targeted at international students near UNSW, USyd, UTS and Macquarie. Short-term friendly.',
    },
    {
      name: 'Sydney Korean Accommodation / 시드니 숙소',
      members: '28,000+',
      category: 'Asian community',
      searchQuery: 'Sydney Korean Accommodation 시드니 숙소',
      description: 'Popular in the Korean expat community. Mix of Korean and English posts.',
    },
    {
      name: 'Sydney Chinese Accommodation 悉尼租房',
      members: '55,000+',
      category: 'Asian community',
      searchQuery: 'Sydney Chinese Accommodation 悉尼租房',
      description: 'High-volume group for the Chinese community — houses, rooms and homestays.',
    },
    {
      name: 'Sydney Subletting & Short Term Rentals',
      members: '22,000+',
      category: 'Subletters',
      searchQuery: 'Sydney Subletting Short Term Rentals',
      description: 'Strictly short-term and sublet posts. Great for travellers and people between leases.',
    },
  ],
  'Victoria': [
    {
      name: 'Melbourne Rooms for Rent & Share Houses',
      members: '80,000+',
      category: 'General',
      searchQuery: 'Melbourne Rooms for Rent Share Houses',
      description: 'Melbourne\'s biggest housing community. Covers CBD, inner north, south east and western suburbs.',
    },
    {
      name: 'Melbourne Share House & Flatmates Wanted',
      members: '50,000+',
      category: 'General',
      searchQuery: 'Melbourne Share House Flatmates Wanted',
      description: 'Subletters post rooms; renters post "looking for" ads. Very active daily.',
    },
    {
      name: 'International Students Melbourne – Rooms & Houses',
      members: '38,000+',
      category: 'Students',
      searchQuery: 'International Students Melbourne Rooms Houses',
      description: 'Focused on UniMelb, RMIT, Monash and Deakin students. Budget-friendly options common.',
    },
    {
      name: 'Melbourne Korean Community Housing 멜번 숙소',
      members: '18,000+',
      category: 'Asian community',
      searchQuery: 'Melbourne Korean Housing 멜번 숙소',
      description: 'Korean-language and bilingual accommodation posts for the Melbourne Korean expat community.',
    },
    {
      name: 'Melbourne Indian Community Rooms & Houses',
      members: '32,000+',
      category: 'Expats',
      searchQuery: 'Melbourne Indian Community Rooms Houses',
      description: 'Active Indian expat housing group. Includes vegetarian-household preferences and cultural fit notes.',
    },
    {
      name: 'Melbourne Short Stay & Subletting',
      members: '15,000+',
      category: 'Subletters',
      searchQuery: 'Melbourne Short Stay Subletting',
      description: 'Short-term rooms and sublets, holiday lets and furnished options around Melbourne.',
    },
  ],
  'Queensland': [
    {
      name: 'Brisbane Rooms & Share Houses for Rent',
      members: '45,000+',
      category: 'General',
      searchQuery: 'Brisbane Rooms Share Houses for Rent',
      description: 'Brisbane\'s go-to housing group. Inner suburbs, northside and southside all well represented.',
    },
    {
      name: 'Gold Coast Rooms & Accommodation',
      members: '30,000+',
      category: 'General',
      searchQuery: 'Gold Coast Rooms Accommodation',
      description: 'The Gold Coast\'s most active housing group. Popular with backpackers and seasonal workers.',
    },
    {
      name: 'Sunshine Coast Rooms for Rent',
      members: '18,000+',
      category: 'General',
      searchQuery: 'Sunshine Coast Rooms for Rent',
      description: 'Noosa to Caloundra, covering the whole Sunshine Coast corridor.',
    },
    {
      name: 'Brisbane International Students Housing',
      members: '25,000+',
      category: 'Students',
      searchQuery: 'Brisbane International Students Housing',
      description: 'UQ, QUT and Griffith students dominate this group. Homestays and share houses listed daily.',
    },
    {
      name: 'Backpackers Australia – Jobs & Accommodation',
      members: '110,000+',
      category: 'Expats',
      searchQuery: 'Backpackers Australia Jobs Accommodation',
      description: 'Australia-wide but huge QLD presence. Hostels, farm work accommodation and short-stays.',
    },
  ],
  'Western Australia': [
    {
      name: 'Perth Rooms for Rent & Share Houses',
      members: '40,000+',
      category: 'General',
      searchQuery: 'Perth Rooms for Rent Share Houses',
      description: 'WA\'s biggest housing group. North of river, south of river and Fremantle all well covered.',
    },
    {
      name: 'Perth Share Accommodation & Flatmates',
      members: '28,000+',
      category: 'General',
      searchQuery: 'Perth Share Accommodation Flatmates',
      description: 'Mix of rooms available and people seeking rooms. Good community moderation.',
    },
    {
      name: 'Perth Indian Community – Housing & Accommodation',
      members: '22,000+',
      category: 'Expats',
      searchQuery: 'Perth Indian Community Housing Accommodation',
      description: 'Strong Indian expat presence in Perth. Vegetarian and non-veg households both listed.',
    },
    {
      name: 'Perth Filipino Community – Rooms & Houses',
      members: '14,000+',
      category: 'Asian community',
      searchQuery: 'Perth Filipino Community Rooms Houses',
      description: 'Close-knit community housing posts — rooms, boarding arrangements and family homes.',
    },
  ],
  'South Australia': [
    {
      name: 'Adelaide Rooms for Rent & Share Houses',
      members: '25,000+',
      category: 'General',
      searchQuery: 'Adelaide Rooms for Rent Share Houses',
      description: 'Adelaide\'s main housing group. City, inner north, east and south all featured.',
    },
    {
      name: 'Adelaide International Students – Accommodation',
      members: '18,000+',
      category: 'Students',
      searchQuery: 'Adelaide International Students Accommodation',
      description: 'UniSA, Flinders and Adelaide Uni students. Home-stay and share house posts.',
    },
  ],
  'ACT & Northern Territory': [
    {
      name: 'Canberra Rooms & Share Houses',
      members: '15,000+',
      category: 'General',
      searchQuery: 'Canberra Rooms Share Houses',
      description: 'ANU and government-worker heavy. Inner north and south Canberra most active.',
    },
    {
      name: 'Darwin Accommodation & Rooms for Rent',
      members: '8,000+',
      category: 'General',
      searchQuery: 'Darwin Accommodation Rooms for Rent',
      description: 'Compact but active group for Darwin and Palmerston area housing.',
    },
  ],
};

const shareText = `Looking for a room or flatmate in Australia?

Check out FlatmateFind — a free Australian share-house board with rooms, studios and share houses across every state.

- Filter by suburb, budget, inclusions and nationality preference
- Post your room for free
- Find renters with detailed profiles

flatmatefind.com

#AustraliaRooms #ShareHouse #Flatmates #Sydney #Melbourne #Brisbane`;

export default function CommunityPage() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://flatmatefind.com')}&quote=${encodeURIComponent(shareText)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white px-8 py-12 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white/20 rounded-xl p-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-200 uppercase tracking-widest">Community Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
            Australian Housing<br />Facebook Communities
          </h1>
          <p className="text-blue-100 text-lg mb-6 leading-relaxed">
            A hand-picked directory of the most active Facebook groups for rooms, share houses and flatmates across Australia — organised by state and community.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-semibold rounded-xl text-sm hover:bg-blue-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              Browse FlatmateFind
            </Link>
            <a
              href="#share"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share with groups
            </a>
          </div>
        </div>
      </div>

      {/* Tip banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-10 flex items-start gap-3">
        <div className="shrink-0 mt-0.5 p-1.5 bg-amber-100 rounded-lg">
          <Lightbulb className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="font-semibold text-amber-900 text-sm mb-1">How to use this page</p>
          <p className="text-amber-800 text-sm leading-relaxed">
            Click <strong>Find on Facebook</strong> to search for the group directly. Group membership numbers are approximate and may change.
            Once you&apos;re in, post your listing — and consider sharing FlatmateFind so other members can find even more options.
          </p>
        </div>
      </div>

      {/* Groups by state */}
      <div className="space-y-14 mb-16">
        {Object.entries(groups).map(([state, stateGroups]) => (
          <section key={state}>
            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
              {state}
              <span className="text-sm font-normal text-slate-400">{stateGroups.length} groups</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stateGroups.map((group) => (
                <div
                  key={group.name}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${GROUP_CATEGORY_COLORS[group.category]}`}>
                      {group.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                      <Users className="w-3 h-3" />
                      {group.members}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-2">{group.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">{group.description}</p>
                  <a
                    href={`https://www.facebook.com/search/groups/?q=${encodeURIComponent(group.searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Find on Facebook
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Share FlatmateFind CTA */}
      <section id="share" className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-8 text-white mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-6 h-6 text-blue-200" />
          <h2 className="text-2xl font-bold">Help your community find better housing</h2>
        </div>
        <p className="text-blue-100 mb-6 leading-relaxed max-w-2xl">
          If you found FlatmateFind useful, sharing it in these Facebook groups helps other renters and subletters discover a better way to find rooms — and it keeps our listings growing. Copy the text below and paste it into any group.
        </p>

        {/* Share text box */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-5">
          <pre className="text-sm text-blue-50 whitespace-pre-wrap font-sans leading-relaxed">{shareText}</pre>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-white text-blue-700 hover:bg-blue-50'
            }`}
          >
            {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>

          <a
            href={fbShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold rounded-xl text-sm transition-colors"
          >
            <Facebook className="w-4 h-4" />
            Share on Facebook
          </a>

          <Link
            href="/post"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Post your listing
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Bottom note */}
      <p className="text-center text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
        FlatmateFind is not affiliated with Facebook or Meta. Group names and member counts are for reference only and may change.
        Always follow each group&apos;s rules when posting.{' '}
        <Link href="/safety-tips" className="text-blue-600 hover:underline">Safety tips</Link>
      </p>
    </div>
  );
}
