import Link from 'next/link';
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
      { label: 'Business for Sale', href: '/business' },
      { label: 'Market', href: '/market' },
      { label: 'Events', href: '/events' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Safety Tips', href: '/safety-tips' },
      { label: 'Guide', href: '/how-it-works' },
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

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:pr-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="bg-teal-500 p-1.5 rounded-lg">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Flatmate<span className="text-teal-400">Find</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Find your room. Find your people. Free, always.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full"><Globe className="w-3 h-3 text-teal-400" /> Australia-wide</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full"><CheckCircle className="w-3 h-3 text-teal-400" /> Free to browse</span>
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
                      className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; {year} FlatmateFind &middot; All listings subject to availability &middot; For informational purposes only
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {bottomLinks.map((l) => (
              <Link key={l.label} href={l.href} className="text-[10px] sm:text-xs text-slate-500 hover:text-teal-400 transition-colors whitespace-nowrap">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
