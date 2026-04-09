'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Search, UserCircle, Heart, GitCompare, PlusCircle, Users, ArrowLeftRight,
  Briefcase, Building2, ShoppingBag, CalendarDays, Globe,
  Calculator, CalendarCheck, Clock, Layers, BookOpen,
  ChevronRight, Home, Zap, LayoutDashboard, Star,
  CheckCircle2, Info, MessageCircle, MapPin, Sparkles,
} from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  desc: string;
  href: string;
  color: string;
}

interface Section {
  id: string;
  label: string;
  heading: string;
  tagline: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  activeBg: string;
  Icon: React.ElementType;
  features: Feature[];
  tips?: string[];
}

const SECTIONS: Section[] = [
  {
    id: 'renters',
    label: 'For Renters',
    heading: 'Finding a room or flatmate',
    tagline: 'Everything you need to find your next place — filter listings, build your profile, connect with communities.',
    accentBg: 'bg-teal-50', accentText: 'text-teal-700', accentBorder: 'border-teal-500', activeBg: 'bg-teal-600',
    Icon: Search,
    tips: [
      'Create a renter profile to get found by hosts even when you\'re not actively searching.',
      'Use the Compare tool on up to 3 listings to weigh them side-by-side before contacting.',
      'Save listings with the heart icon — they live in your Favourites dashboard.',
      'Filter by "Bills included" or "WiFi included" to accurately compare true monthly costs.',
    ],
    features: [
      { icon: Search,      title: 'Browse Listings',   desc: 'Search rooms and apartments across Australia. Filter by state, city, price, inclusions, furnished status, gender preference, pets, and availability date.', href: '/listings',  color: 'bg-teal-100 text-teal-600' },
      { icon: UserCircle,  title: 'Create Your Profile', desc: 'Build a renter profile with your budget, preferred locations, lifestyle, and stay type. Hosts and subletters can discover you directly.', href: '/profile',   color: 'bg-violet-100 text-violet-600' },
      { icon: Heart,       title: 'Saved Listings',    desc: 'Heart any listing to save it. View and manage all saved listings from your dashboard under "Saved Listings".', href: '/favorites', color: 'bg-rose-100 text-rose-600' },
      { icon: GitCompare,  title: 'Compare Listings',  desc: 'Select up to 3 listings and view them side-by-side — price, inclusions, location, and room details.', href: '/compare',   color: 'bg-indigo-100 text-indigo-600' },
      { icon: Globe,       title: 'Communities',       desc: 'Browse and join local renter communities. Connect with other renters in your area, share tips, and find flatmates organically.', href: '/community', color: 'bg-cyan-100 text-cyan-600' },
    ],
  },
  {
    id: 'subletters',
    label: 'For Subletters',
    heading: 'Listing a room or finding a tenant',
    tagline: 'Post your room, browse verified renter profiles, or hand your lease to someone new — all for free.',
    accentBg: 'bg-amber-50', accentText: 'text-amber-700', accentBorder: 'border-amber-500', activeBg: 'bg-amber-500',
    Icon: PlusCircle,
    tips: [
      'Add photos, a detailed description, and clear house rules to attract serious enquiries.',
      'Browse renter profiles before posting to see how much demand exists in your area.',
      'Unit Takeover is ideal if you\'re leaving mid-lease — find someone to take over your obligations.',
      'Specify availability date accurately — listings with a specific date get more interest.',
    ],
    features: [
      { icon: PlusCircle,     title: 'Create a Listing',      desc: 'Post your room or apartment in minutes. Add photos, weekly rent, inclusions, house rules, gender preference, pet and smoking policy.', href: '/post',     color: 'bg-amber-100 text-amber-600' },
      { icon: Users,          title: 'Browse Renter Profiles', desc: 'Search verified renter profiles by location, budget, and lifestyle. Reach out to potential tenants directly — no waiting for applications.', href: '/renters',  color: 'bg-blue-100 text-blue-600' },
      { icon: ArrowLeftRight, title: 'Unit Takeover',          desc: 'Leaving before your lease ends? List your unit for a full takeover. A new tenant steps in, takes over your obligations, and you move on cleanly.', href: '/takeover', color: 'bg-orange-100 text-orange-600' },
    ],
  },
  {
    id: 'find',
    label: 'Find More',
    heading: 'Jobs, businesses, market & events',
    tagline: 'A local board for everything beyond housing — find work, buy a business, browse products, and attend events.',
    accentBg: 'bg-indigo-50', accentText: 'text-indigo-700', accentBorder: 'border-indigo-500', activeBg: 'bg-indigo-600',
    Icon: Briefcase,
    tips: [
      'Jobs are filtered by type (full-time, part-time, casual) and state — great for new arrivals.',
      'Business listings show asking price, revenue, and reason for sale upfront.',
      'Market covers everything from furniture to food — perfect for furnishing a new room cheaply.',
      'Events lists local meetups, markets, and activities — a great way to meet people in a new city.',
    ],
    features: [
      { icon: Briefcase,    title: 'Jobs Board',         desc: 'Browse full-time, part-time, and casual job listings across Australia. Filter by state, role type, and industry. WHV-eligible jobs are clearly tagged.', href: '/jobs',     color: 'bg-teal-100 text-teal-600' },
      { icon: Building2,    title: 'Business for Sale',  desc: 'Browse cafés, shops, franchises, and other businesses for sale. Listings include asking price, annual revenue, and full business details.', href: '/business', color: 'bg-purple-100 text-purple-600' },
      { icon: ShoppingBag,  title: 'Market',             desc: 'A local classifieds board for products, food, and services. Buy secondhand furniture, find local food producers, or advertise your own goods.', href: '/market',   color: 'bg-amber-100 text-amber-600' },
      { icon: CalendarDays, title: 'Events',             desc: 'Discover local meetups, cultural events, markets, and activities. Great for meeting people and settling into a new city or neighbourhood.', href: '/events',   color: 'bg-rose-100 text-rose-600' },
    ],
  },
  {
    id: 'tools',
    label: 'Smart Tools',
    heading: 'Free calculators and trackers',
    tagline: 'Practical tools built for renters, workers, and visa holders in Australia — no sign-up required.',
    accentBg: 'bg-violet-50', accentText: 'text-violet-700', accentBorder: 'border-violet-500', activeBg: 'bg-violet-600',
    Icon: Calculator,
    tips: [
      'All tools are free and work entirely in your browser — nothing is saved to a server.',
      'Flatmate Match matches you with real listings after you complete the quiz.',
      '2nd & 3rd Year Tracker saves your entries locally so they persist between visits.',
      'Visa Pathways is personalised — select your current visa and goal for tailored recommendations.',
    ],
    features: [
      { icon: Sparkles,     title: 'Flatmate Match',          desc: 'Answer 12 questions about your lifestyle, budget, and preferences. Get your flatmate personality type and see real listings that match your profile.', href: '/tools/compatibility-quiz', color: 'bg-violet-100 text-violet-600' },
      { icon: Calculator,   title: 'Tax Refund Calculator',   desc: 'Estimate your Australian tax refund for any visa type — Working Holiday, Student, Skilled, and more. Covers Medicare levy and low income offsets.', href: '/tools/tax-calculator',     color: 'bg-indigo-100 text-indigo-600' },
      { icon: CalendarCheck,title: '2nd & 3rd Year Tracker',  desc: 'Log your regional work days toward your 88-day (2nd year) or 179-day (3rd year) Working Holiday Visa requirement.', href: '/tools/whv-tracker',        color: 'bg-emerald-100 text-emerald-600' },
      { icon: Clock,        title: 'Work Hours Tracker',      desc: 'Log weekly work hours and track fortnightly totals against your visa\'s work hour limit. Configurable for any visa condition.', href: '/tools/hours-tracker',      color: 'bg-blue-100 text-blue-600' },
      { icon: Briefcase,    title: 'ABN & TFN Guide',         desc: 'Compare your take-home pay as an ABN contractor versus a PAYG employee in Australia. Includes GST, super, and tax breakdowns.', href: '/tools/abn-tfn',            color: 'bg-slate-100 text-slate-600' },
      { icon: Layers,       title: 'Visa Pathways',           desc: 'Select your current visa and goal to get a personalised list of visa options, migration agents, education providers, and skills assessors.', href: '/tools/visa-pathways',      color: 'bg-indigo-100 text-indigo-600' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    heading: 'Your account',
    tagline: 'Sign up to unlock saving, posting, and profile features. Browsing is always free without an account.',
    accentBg: 'bg-slate-50', accentText: 'text-slate-700', accentBorder: 'border-slate-400', activeBg: 'bg-slate-700',
    Icon: UserCircle,
    features: [
      { icon: UserCircle,     title: 'Create an Account', desc: 'Sign up as a renter or subletter. Your account lets you save listings, post rooms, manage your profile, and access your dashboard.', href: '/auth/signup', color: 'bg-slate-100 text-slate-600' },
      { icon: LayoutDashboard,title: 'Dashboard',         desc: 'Your home base. Renters see saved listings and profile status. Subletters see their active listings and enquiries. Accessible from the top-right menu.', href: '/dashboard',  color: 'bg-slate-100 text-slate-600' },
      { icon: Star,           title: 'Saved Listings',    desc: 'Heart any listing to add it to your saved list. Manage and revisit them anytime from your dashboard — only available to signed-in renters.', href: '/favorites',  color: 'bg-slate-100 text-slate-600' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    heading: 'Getting around the site',
    tagline: 'The header is your main navigation point, with everything accessible in two taps on mobile.',
    accentBg: 'bg-rose-50', accentText: 'text-rose-700', accentBorder: 'border-rose-400', activeBg: 'bg-rose-500',
    Icon: MapPin,
    features: [
      { icon: Zap,         title: 'Get Started',        desc: 'Opens a dropdown with quick links for Renters (Browse, Profile, Communities) and Subletters (Profiles, Post, Takeover).', href: '/', color: 'bg-teal-100 text-teal-600' },
      { icon: Search,      title: 'Find More',          desc: 'Dedicated dropdown for Jobs, Business, Market, and Events — everything beyond housing.', href: '/', color: 'bg-indigo-100 text-indigo-600' },
      { icon: Calculator,  title: 'Smart Tools',        desc: 'Quick access to all 6 free tools: Flatmate Match, Tax Refund Calculator, 2nd & 3rd Year Tracker, Work Hours Tracker, ABN & TFN Guide, and Visa Pathways.', href: '/tools', color: 'bg-violet-100 text-violet-600' },
      { icon: Home,        title: 'FlatmateFind Logo',  desc: 'Clicking the logo in the top-left always takes you back to the homepage.', href: '/', color: 'bg-indigo-100 text-indigo-600' },
      { icon: UserCircle,  title: 'Account Menu',       desc: 'Once signed in, your name appears in the top-right. Click it to access your Dashboard, Saved Listings, Profile, and Sign Out.', href: '/dashboard', color: 'bg-slate-100 text-slate-600' },
      { icon: MessageCircle,title: 'Mobile Menu',       desc: 'On mobile, tap the hamburger icon to open the menu. Getting Started expands automatically. Each section is a collapsible accordion.', href: '/', color: 'bg-emerald-100 text-emerald-600' },
    ],
  },
];

export default function SiteGuidePage() {
  const [activeId, setActiveId] = useState('renters');
  const section = SECTIONS.find((s) => s.id === activeId)!;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">Resources</p>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">Site Guide</h1>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SECTIONS.map((s) => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? `${s.activeBg} text-white border-transparent shadow-sm`
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <s.Icon className="w-3 h-3" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Active section */}
        <div key={activeId}>
          {/* Section heading */}
          <div className={`rounded-2xl ${section.accentBg} border ${section.accentBorder.replace('border-', 'border-')} px-5 py-4 mb-6`}>
            <h2 className={`text-base font-bold ${section.accentText} mb-0.5`}>{section.heading}</h2>
            <p className="text-sm text-slate-500">{section.tagline}</p>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {section.features.map((f) => (
              <Link
                key={f.href + f.title}
                href={f.href}
                className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                  <f.icon className="w-[18px] h-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">{f.title}</p>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-500 shrink-0 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Tips */}
          {section.tips && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tips</p>
              </div>
              <ul className="space-y-2">
                {section.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
          <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-teal-900 mb-0.5">Still need help?</p>
            <p className="text-xs text-teal-700">Check out the FAQ for common questions, or reach out via the contact page.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/faq" className="text-xs font-semibold px-4 py-2 rounded-xl bg-white border border-teal-200 text-teal-700 hover:bg-teal-100 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-xs font-semibold px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors">
              Contact
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
