'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Globe, CheckCircle } from 'lucide-react';

const footerLinks = {
  renters: {
    title: 'For Renters',
    links: [
      { label: 'Browse Listings', href: '/listings' },
      { label: 'Create Profile', href: '/profile' },
      { label: 'Communities', href: '/community' },
    ],
  },
  subletters: {
    title: 'For Subletters',
    links: [
      { label: 'Browse Profiles', href: '/renters' },
      { label: 'Create Listing', href: '/post' },
      { label: 'Unit Takeover', href: '/takeover' },
    ],
  },
  find: {
    title: 'Find',
    links: [
      { label: 'Jobs', href: '/jobs' },
      { label: 'Business', href: '/business' },
      { label: 'Market', href: '/market' },
      { label: 'Events', href: '/events' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Smart Tools', href: '/tools' },
      { label: 'Site Guide', href: '/site-guide' },
      { label: 'Safety Tips', href: '/safety-tips' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
};

const bottomLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/privacy#cookies' },
  { label: 'Terms of Service', href: '/terms' },
];

// ─── Theme ────────────────────────────────────────────────────────────────────

interface FooterTheme {
  logoBg: string;    // bg-* for icon square
  brandText: string; // text-* for "Find" wordmark
  iconColor: string; // text-* for badge icons
  linkHover: string; // hover:text-* for footer links
}

const DEFAULT: FooterTheme = {
  logoBg: 'bg-teal-500',
  brandText: 'text-teal-400',
  iconColor: 'text-teal-400',
  linkHover: 'hover:text-teal-400',
};

const FOOTER_THEMES: { prefix: string; theme: FooterTheme }[] = [
  { prefix: '/jobs',                     theme: { logoBg: 'bg-blue-600',    brandText: 'text-blue-400',    iconColor: 'text-blue-400',    linkHover: 'hover:text-blue-400'    } },
  { prefix: '/business',                 theme: { logoBg: 'bg-purple-600',  brandText: 'text-purple-400',  iconColor: 'text-purple-400',  linkHover: 'hover:text-purple-400'  } },
  { prefix: '/events',                   theme: { logoBg: 'bg-rose-600',    brandText: 'text-rose-400',    iconColor: 'text-rose-400',    linkHover: 'hover:text-rose-400'    } },
  { prefix: '/market',                   theme: { logoBg: 'bg-amber-500',   brandText: 'text-amber-400',   iconColor: 'text-amber-400',   linkHover: 'hover:text-amber-400'   } },
  { prefix: '/community',                theme: { logoBg: 'bg-blue-600',    brandText: 'text-blue-400',    iconColor: 'text-blue-400',    linkHover: 'hover:text-blue-400'    } },
  { prefix: '/takeover',                 theme: { logoBg: 'bg-orange-500',  brandText: 'text-orange-400',  iconColor: 'text-orange-400',  linkHover: 'hover:text-orange-400'  } },
  { prefix: '/tools/compatibility-quiz', theme: { logoBg: 'bg-violet-600',  brandText: 'text-violet-400',  iconColor: 'text-violet-400',  linkHover: 'hover:text-violet-400'  } },
  { prefix: '/tools/tax-calculator',     theme: { logoBg: 'bg-indigo-600',  brandText: 'text-indigo-400',  iconColor: 'text-indigo-400',  linkHover: 'hover:text-indigo-400'  } },
  { prefix: '/tools/whv-tracker',        theme: { logoBg: 'bg-emerald-600', brandText: 'text-emerald-400', iconColor: 'text-emerald-400', linkHover: 'hover:text-emerald-400' } },
  { prefix: '/tools/hours-tracker',      theme: { logoBg: 'bg-blue-600',    brandText: 'text-blue-400',    iconColor: 'text-blue-400',    linkHover: 'hover:text-blue-400'    } },
  { prefix: '/tools/abn-tfn',            theme: { logoBg: 'bg-slate-600',   brandText: 'text-slate-400',   iconColor: 'text-slate-400',   linkHover: 'hover:text-slate-300'   } },
  { prefix: '/tools/visa-pathways',      theme: { logoBg: 'bg-blue-700',    brandText: 'text-blue-400',    iconColor: 'text-blue-400',    linkHover: 'hover:text-blue-400'    } },
  { prefix: '/tools',                    theme: { logoBg: 'bg-violet-600',  brandText: 'text-violet-400',  iconColor: 'text-violet-400',  linkHover: 'hover:text-violet-400'  } },
];

function useFooterTheme(pathname: string): FooterTheme {
  const sorted = [...FOOTER_THEMES].sort((a, b) => b.prefix.length - a.prefix.length);
  const match = sorted.find((p) => pathname.startsWith(p.prefix));
  return match ? match.theme : DEFAULT;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const theme = useFooterTheme(pathname);

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:pr-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className={`${theme.logoBg} p-1.5 rounded-lg transition-colors duration-300`}>
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Flatmate<span className={`${theme.brandText} transition-colors duration-300`}>Find</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Find your room. Find your people. Free, always.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full">
                <Globe className={`w-3 h-3 ${theme.iconColor} transition-colors duration-300`} />
                Australia-wide
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full">
                <CheckCircle className={`w-3 h-3 ${theme.iconColor} transition-colors duration-300`} />
                Free to browse
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-sm text-slate-400 ${theme.linkHover} transition-colors`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {bottomLinks.map((l) => (
              <Link key={l.label} href={l.href} className={`text-[10px] text-slate-500 ${theme.linkHover} transition-colors whitespace-nowrap`}>
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 whitespace-nowrap">
            &copy; {year} FlatmateFind &middot; All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
