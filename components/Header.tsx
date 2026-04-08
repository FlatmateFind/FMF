'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Heart, LayoutDashboard, LogOut, User, ChevronDown,
  Users, Sparkles, Briefcase, Search, LogIn, UserPlus,
  Menu, X, PlusCircle, Zap, ArrowLeftRight, Calculator,
  Building2, ShoppingBag, CalendarDays, CalendarCheck, Clock, Layers, Globe,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';

// ─── Per-page brand theme ────────────────────────────────────────────────────

interface PageTheme {
  logoBg: string;      // bg-* for the icon square
  brandText: string;   // text-* for "Find" in the wordmark
  activeNav: string;   // text-* + bg-* for active nav button
  signupBg: string;    // bg-* for the sign-up button
  signupHover: string; // hover:bg-* for the sign-up button
}

const DEFAULT_THEME: PageTheme = {
  logoBg: 'bg-teal-600',
  brandText: 'text-teal-600',
  activeNav: 'text-teal-600 bg-teal-50',
  signupBg: 'bg-teal-600',
  signupHover: 'hover:bg-teal-700',
};

// Only Find and Tools pages get a custom theme — all other pages use teal
const PAGE_THEMES: { prefix: string; theme: PageTheme }[] = [
  // ── Find section ──────────────────────────────────────────────────────────
  { prefix: '/jobs',      theme: { logoBg: 'bg-blue-600',   brandText: 'text-blue-600',   activeNav: 'text-blue-600 bg-blue-50',     signupBg: 'bg-blue-600',   signupHover: 'hover:bg-blue-700'   } },
  { prefix: '/business',  theme: { logoBg: 'bg-purple-600', brandText: 'text-purple-600', activeNav: 'text-purple-600 bg-purple-50', signupBg: 'bg-purple-600', signupHover: 'hover:bg-purple-700' } },
  { prefix: '/events',    theme: { logoBg: 'bg-rose-600',   brandText: 'text-rose-600',   activeNav: 'text-rose-600 bg-rose-50',     signupBg: 'bg-rose-600',   signupHover: 'hover:bg-rose-700'   } },
  { prefix: '/market',    theme: { logoBg: 'bg-amber-500',  brandText: 'text-amber-500',  activeNav: 'text-amber-600 bg-amber-50',   signupBg: 'bg-amber-500',  signupHover: 'hover:bg-amber-600'  } },
  { prefix: '/community', theme: { logoBg: 'bg-blue-600',   brandText: 'text-blue-600',   activeNav: 'text-blue-600 bg-blue-50',     signupBg: 'bg-blue-600',   signupHover: 'hover:bg-blue-700'   } },
  { prefix: '/takeover',  theme: { logoBg: 'bg-orange-500', brandText: 'text-orange-500', activeNav: 'text-orange-600 bg-orange-50', signupBg: 'bg-orange-500', signupHover: 'hover:bg-orange-600' } },
  // ── Tools — specific pages override the generic /tools entry ──────────────
  { prefix: '/tools/compatibility-quiz', theme: { logoBg: 'bg-violet-600', brandText: 'text-violet-600', activeNav: 'text-violet-600 bg-violet-50', signupBg: 'bg-violet-600', signupHover: 'hover:bg-violet-700' } },
  { prefix: '/tools/tax-calculator',     theme: { logoBg: 'bg-indigo-600', brandText: 'text-indigo-600', activeNav: 'text-indigo-600 bg-indigo-50', signupBg: 'bg-indigo-600', signupHover: 'hover:bg-indigo-700' } },
  { prefix: '/tools/whv-tracker',        theme: { logoBg: 'bg-emerald-600',brandText: 'text-emerald-600',activeNav: 'text-emerald-600 bg-emerald-50',signupBg: 'bg-emerald-600',signupHover: 'hover:bg-emerald-700'} },
  { prefix: '/tools/hours-tracker',      theme: { logoBg: 'bg-blue-600',   brandText: 'text-blue-600',   activeNav: 'text-blue-600 bg-blue-50',     signupBg: 'bg-blue-600',   signupHover: 'hover:bg-blue-700'   } },
  { prefix: '/tools/abn-tfn',            theme: { logoBg: 'bg-slate-700',  brandText: 'text-slate-700',  activeNav: 'text-slate-700 bg-slate-100',  signupBg: 'bg-slate-700',  signupHover: 'hover:bg-slate-800'  } },
  { prefix: '/tools/visa-pathways',      theme: { logoBg: 'bg-blue-700',   brandText: 'text-blue-700',   activeNav: 'text-blue-700 bg-blue-50',   signupBg: 'bg-blue-700',   signupHover: 'hover:bg-blue-800'   } },
  { prefix: '/tools',                    theme: { logoBg: 'bg-violet-600', brandText: 'text-violet-600', activeNav: 'text-violet-600 bg-violet-50', signupBg: 'bg-violet-600', signupHover: 'hover:bg-violet-700' } },
];

function usePageTheme(pathname: string): PageTheme {
  const sorted = [...PAGE_THEMES].sort((a, b) => b.prefix.length - a.prefix.length);
  const match = sorted.find((p) => pathname.startsWith(p.prefix));
  return match ? match.theme : DEFAULT_THEME;
}

// ─── Nav links ───────────────────────────────────────────────────────────────

const TOOLS_LINKS = [
  { label: 'Flatmate Match',          href: '/tools/compatibility-quiz', icon: Users,          color: 'bg-violet-100 text-violet-600',  desc: 'Discover your flatmate type' },
  { label: 'Tax Refund Calculator',  href: '/tools/tax-calculator',     icon: Calculator,     color: 'bg-indigo-100 text-indigo-600',  desc: 'Estimate your AU tax refund' },
  { label: '2nd & 3rd Year Tracker', href: '/tools/whv-tracker',        icon: CalendarCheck,  color: 'bg-emerald-100 text-emerald-600', desc: 'Track 88 / 179 regional days' },
  { label: 'Work Hours Tracker',     href: '/tools/hours-tracker',      icon: Clock,          color: 'bg-blue-100 text-blue-600',      desc: 'Log fortnightly work hours' },
  { label: 'ABN & TFN Guide',        href: '/tools/abn-tfn',            icon: Briefcase,      color: 'bg-slate-100 text-slate-600',    desc: 'Compare contractor vs employee' },
  { label: 'Visa Pathways',          href: '/tools/visa-pathways',      icon: Layers,         color: 'bg-indigo-100 text-indigo-600',  desc: 'Stay longer, sponsorship & PR' },
];

const QUICK_LINKS = {
  renters: [
    { label: 'Browse Listings',  href: '/listings',     icon: Search,    color: 'bg-teal-100 text-teal-700',    desc: 'Rooms & apartments near you' },
    { label: 'Create Profile',   href: '/profile',      icon: Sparkles,  color: 'bg-violet-100 text-violet-700', desc: 'Get found by subletters' },
    { label: 'Communities',      href: '/community',  icon: Globe,     color: 'bg-cyan-100 text-cyan-700',    desc: 'Connect with renters near you' },
  ],
  subletters: [
    { label: 'Browse Profiles',  href: '/renters',   icon: Users,          color: 'bg-blue-100 text-blue-700',   desc: 'Find your next tenant' },
    { label: 'Create Listing',   href: '/post',      icon: PlusCircle,     color: 'bg-amber-100 text-amber-700', desc: 'List your room for free' },
    { label: 'Unit Takeover',    href: '/takeover',  icon: ArrowLeftRight, color: 'bg-orange-100 text-orange-600', desc: 'Pass your lease to someone new' },
  ],
  find: [
    { label: 'Jobs',      href: '/jobs',     icon: Briefcase,    color: 'bg-teal-100 text-teal-700',    desc: 'Full-time, part-time & casual' },
    { label: 'Business',  href: '/business', icon: Building2,    color: 'bg-purple-100 text-purple-700', desc: 'Cafés, shops & businesses for sale' },
    { label: 'Market',    href: '/market',   icon: ShoppingBag,  color: 'bg-amber-100 text-amber-700',  desc: 'Products, food & local services' },
    { label: 'Events',    href: '/events',   icon: CalendarDays, color: 'bg-rose-100 text-rose-600',    desc: 'Meetups, markets & activities' },
  ],
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = usePageTheme(pathname);
  const { user, signOut, loading } = useAuth();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileQuickOpen, setMobileQuickOpen] = useState(false);
  const [mobileFindOpen, setMobileFindOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) setQuickOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false); setQuickOpen(false); setToolsOpen(false);
    setMobileQuickOpen(false); setMobileFindOpen(false); setMobileToolsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleSignOut() {
    signOut();
    setMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className={`${theme.logoBg} p-1.5 rounded-lg transition-colors duration-300`}>
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">
              Flatmate<span className={`${theme.brandText} transition-colors duration-300`}>Find</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Get Started dropdown */}
            <div className="relative" ref={quickRef}>
              <button
                onClick={() => setQuickOpen((v) => !v)}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  quickOpen ? theme.activeNav : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Zap className="w-4 h-4" />
                Get Started
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${quickOpen ? 'rotate-180' : ''}`} />
              </button>

              {quickOpen && (
                <div className="absolute right-0 top-full mt-2 w-[600px] bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50">
                  <div className="grid grid-cols-3 divide-x divide-slate-100">
                    {/* For Renters */}
                    <div className="pr-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">For Renters</p>
                      <div className="space-y-1.5">
                        {QUICK_LINKS.renters.map(({ label, href, icon: Icon, color, desc }) => (
                          <Link key={href} href={href} onClick={() => setQuickOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 group-hover:text-teal-700">{label}</p>
                              <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* For Subletters */}
                    <div className="px-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">For Subletters</p>
                      <div className="space-y-1.5">
                        {QUICK_LINKS.subletters.map(({ label, href, icon: Icon, color, desc }) => (
                          <Link key={href} href={href} onClick={() => setQuickOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 group-hover:text-teal-700">{label}</p>
                              <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Find */}
                    <div className="pl-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Find</p>
                      <div className="space-y-1.5">
                        {QUICK_LINKS.find.map(({ label, href, icon: Icon, color, desc }) => (
                          <Link key={href} href={href} onClick={() => setQuickOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 group-hover:text-teal-700">{label}</p>
                              <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tools dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => { setToolsOpen((v) => !v); setQuickOpen(false); }}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  toolsOpen || pathname.startsWith('/tools') ? theme.activeNav : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calculator className="w-4 h-4" />
                Smart Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Smart Tools</p>
                  <div className="space-y-1">
                    {TOOLS_LINKS.map(({ label, href, icon: Icon, color, desc }) => (
                      <Link key={href} href={href} onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700">{label}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth / user menu */}
            {!loading && (
              user ? (
                <div className="relative ml-1" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-teal-600">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[80px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>
                      {user.role === 'renter' && (
                        <>
                          <Link href="/favorites" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <Heart className="w-4 h-4 text-slate-400" />
                            Saved Listings
                            {favorites.length > 0 && (
                              <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {favorites.length}
                              </span>
                            )}
                          </Link>
                          <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <Sparkles className="w-4 h-4 text-slate-400" />
                            My Profile
                          </Link>
                        </>
                      )}
                      {user.role === 'subletter' && (
                        <>
                          <Link href="/renters" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <Users className="w-4 h-4 text-slate-400" />
                            Find Renters
                          </Link>
                          <Link href="/post" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <User className="w-4 h-4 text-slate-400" />
                            Post a Listing
                          </Link>
                        </>
                      )}
                      <div className="border-t border-slate-100 mt-1">
                        <button onClick={handleSignOut} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 ml-1">
                  <Link href="/auth/signin" title="Sign In" className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                    <LogIn className="w-5 h-5" />
                  </Link>
                  <Link href="/auth/signup" title="Sign Up" className={`flex items-center justify-center w-9 h-9 rounded-lg ${theme.signupBg} ${theme.signupHover} text-white transition-colors duration-300`}>
                    <UserPlus className="w-5 h-5" />
                  </Link>
                </div>
              )
            )}
          </nav>

          {/* Mobile right side: auth + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {!loading && (
              user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full border border-slate-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-teal-600">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>
                      {user.role === 'renter' && (
                        <>
                          <Link href="/favorites" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <Heart className="w-4 h-4 text-slate-400" />
                            Saved Listings
                            {favorites.length > 0 && (
                              <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {favorites.length}
                              </span>
                            )}
                          </Link>
                          <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <Sparkles className="w-4 h-4 text-slate-400" />
                            My Profile
                          </Link>
                        </>
                      )}
                      {user.role === 'subletter' && (
                        <>
                          <Link href="/renters" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <Users className="w-4 h-4 text-slate-400" />
                            Find Renters
                          </Link>
                          <Link href="/post" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <User className="w-4 h-4 text-slate-400" />
                            Post a Listing
                          </Link>
                        </>
                      )}
                      <div className="border-t border-slate-100 mt-1">
                        <button onClick={handleSignOut} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link href="/auth/signin" title="Sign In" className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                    <LogIn className="w-4 h-4" />
                  </Link>
                  <Link href="/auth/signup" title="Sign Up" className={`flex items-center justify-center w-8 h-8 rounded-lg ${theme.signupBg} ${theme.signupHover} text-white transition-colors duration-300`}>
                    <UserPlus className="w-4 h-4" />
                  </Link>
                </div>
              )
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white fixed inset-x-0 top-16 bottom-0 overflow-y-auto z-40">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">

            {/* ── Getting Started accordion ── */}
            <div>
              <button
                onClick={() => setMobileQuickOpen((v) => !v)}
                className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-teal-500" />
                  Getting Started
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileQuickOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileQuickOpen && (
                <div className="mt-1 mb-2 space-y-3 pl-2">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1.5">For Renters</p>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_LINKS.renters.map(({ label, href, icon: Icon, color, desc }) => (
                        <Link key={href} href={href}
                          className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{label}</p>
                            <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1.5">For Subletters</p>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_LINKS.subletters.map(({ label, href, icon: Icon, color, desc }) => (
                        <Link key={href} href={href}
                          className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{label}</p>
                            <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Find accordion ── */}
            <div>
              <button
                onClick={() => setMobileFindOpen((v) => !v)}
                className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-indigo-500" />
                  Find More
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileFindOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileFindOpen && (
                <div className="mt-1 mb-2 pl-2">
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_LINKS.find.map(({ label, href, icon: Icon, color, desc }) => (
                      <Link key={href} href={href}
                        className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{label}</p>
                          <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Tools accordion ── */}
            <div>
              <button
                onClick={() => setMobileToolsOpen((v) => !v)}
                className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-violet-500" />
                  Smart Tools
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileToolsOpen && (
                <div className="mt-1 mb-2 pl-2 space-y-1">
                  {TOOLS_LINKS.map(({ label, href, icon: Icon, color, desc }) => (
                    <Link key={href} href={href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700">{label}</p>
                        <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </nav>
        </div>
      )}
    </header>
  );
}
