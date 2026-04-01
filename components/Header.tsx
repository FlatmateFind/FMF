'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Heart, LayoutDashboard, LogOut, User, ChevronDown, Users, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function handleSignOut() {
    signOut();
    setMenuOpen(false);
    router.push('/');
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-teal-600 p-1.5 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">
              Flatmate<span className="text-teal-600">Find</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-4">
            <Link
              href="/listings"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/listings') ? 'text-teal-600' : 'text-slate-600 hover:text-teal-600'
              }`}
            >
              Browse Listings
            </Link>

            {/* Show role-specific nav only when signed in */}
            {!loading && user && (
              <>
                {user.role === 'renter' && (
                  <>
                    <Link
                      href="/favorites"
                      className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        pathname === '/favorites' ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${pathname === '/favorites' ? 'fill-current' : ''}`} />
                      Saved
                      {favorites.length > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/profile"
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        pathname === '/profile' ? 'text-teal-600' : 'text-slate-600 hover:text-teal-600'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      My Profile
                    </Link>
                  </>
                )}

                {user.role === 'subletter' && (
                  <Link
                    href="/renters"
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      pathname === '/renters' ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Find Renters
                  </Link>
                )}

                <Link
                  href="/dashboard"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    pathname === '/dashboard' ? 'text-teal-600' : 'text-slate-600 hover:text-teal-600'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            )}

            {/* Post a Listing — subletter only */}
            {!loading && user?.role === 'subletter' && (
              <Link
                href="/post"
                className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                + Post a Listing
              </Link>
            )}

            {/* Auth buttons / user menu */}
            {!loading && (
              user ? (
                /* User avatar dropdown */
                <div className="relative" ref={menuRef}>
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
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>
                      {user.role === 'renter' && (
                        <>
                          <Link
                            href="/favorites"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-slate-400" />
                            Saved Listings
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Sparkles className="w-4 h-4 text-slate-400" />
                            My Profile
                          </Link>
                        </>
                      )}
                      {user.role === 'subletter' && (
                        <>
                          <Link
                            href="/renters"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Users className="w-4 h-4 text-slate-400" />
                            Find Renters
                          </Link>
                          <Link
                            href="/post"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            Post a Listing
                          </Link>
                        </>
                      )}
                      <div className="border-t border-slate-100 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Sign in / Sign up */
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/signin"
                    className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
