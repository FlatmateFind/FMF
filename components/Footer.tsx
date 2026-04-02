import Link from 'next/link';
import { Home, Globe, CheckCircle } from 'lucide-react';

const footerLinks = {
  renters: {
    title: 'For Renters',
    links: [
      { label: 'Browse Listings', href: '/listings' },
      { label: 'Create Profile', href: '/profile' },
      { label: 'Renter Guide', href: '/guide' },
      { label: 'Safety Tips', href: '/guide#safety' },
    ],
  },
  subletters: {
    title: 'For Subletters',
    links: [
      { label: 'Post a Listing', href: '/post' },
      { label: 'Find Renters', href: '/renters' },
      { label: 'Listing Guide', href: '/guide#listing-guide' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About FlatmateFind', href: '/about' },
      { label: 'Contact Us', href: '/about#contact' },
      { label: 'Communities', href: '/community' },
    ],
  },
};

const bottomLinks = [
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="bg-teal-500 p-1.5 rounded-lg">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Flatmate<span className="text-teal-400">Find</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Australia&apos;s free flatmate and share-house board. Find your perfect room or list your place — no fees, no fuss.
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
          <div className="flex items-center gap-5">
            {bottomLinks.map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-slate-500 hover:text-teal-400 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
