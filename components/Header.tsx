'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Heart, LayoutDashboard, LogOut, User, ChevronDown,
  Users, Sparkles, Briefcase, Search, LogIn, UserPlus,
  Menu, X, PlusCircle, Zap, ArrowLeftRight, Calculator,
  Building2, ShoppingBag, CalendarDays, Compass,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';

const QUICK_LINKS = {
  renters: [
    { label: 'Browse Listings',  href: '/listings', icon: Search,     color: 'bg-teal-100 text-teal-700',   desc: 'Rooms & apartments near you' },
    { label: 'Create Profile',    href: '/profile',  icon: Sparkles,   color: 'bg-violet-100 text-violet-700', desc: 'Get found by subletters' },
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
  const { user, signOut, loading } = useAuth();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) setQuickOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setQuickOpen(false); }, [pathname]);

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
            <div className="bg-teal-600 p-1.5 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">
              Flatmate<span className="text-teal-600">Find</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Find */}
            <Link
              href="/jobs"
              className={`relative flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                ['/jobs', '/business', '/market', '/events'].some((p) => pathname.startsWith(p))
                  ? 'text-teal-600 bg-teal-50'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Find
            </Link>

            {/* Tools */}
            <Link
              href="/tools"
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/tools') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Tools
            </Link>

            {/* Get Started dropdown */}
            <div className="relative" ref={quickRef}>
              <button
                onClick={() => setQuickOpen((v) => !v)}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  quickOpen ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                <Zap className="w-4 h-4" />
                Get Started
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${quickOpen ? 'rotate-180' : ''}`} />
              </button>

              {quickOpen && (
                <div className="absolute left-0 top-full mt-2 w-[580px] bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50">
                  <div className="grid grid-cols-3 gap-3">
                    {/* For Renters */}
                    <div>
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
                    <div className="border-l border-slate-100 pl-3">
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
                    <div className="border-l border-slate-100 pl-3">
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
                  <Link href="/auth/signin" title="Sign In" className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-50 transition-colors">
                    <LogIn className="w-5 h-5" />
                  </Link>
                  <Link href="/auth/signup" title="Sign Up" className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors">
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
                  <Link href="/auth/signin" title="Sign In" className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-50 transition-colors">
                    <LogIn className="w-4 h-4" />
                  </Link>
                  <Link href="/auth/signup" title="Sign Up" className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors">
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
        <div className="md:hidden border-t border-slate-100 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-4">

            {/* Quick links */}
            {/* Find section */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Find</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LINKS.find.map(({ label, href, icon: Icon, color, desc }) => (
                  <Link key={href} href={href}
                    className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white transition-colors">
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

            <Link
              href="/tools"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname.startsWith('/tools') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Tools
            </Link>

            {/* For Renters section */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">For Renters</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LINKS.renters.map(({ label, href, icon: Icon, color, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                  >
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

            {/* For Subletters section */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">For Subletters</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LINKS.subletters.map(({ label, href, icon: Icon, color, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                  >
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

          </nav>
        </div>
      )}
    </header>
  );
}
