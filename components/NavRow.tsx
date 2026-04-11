'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavTab {
  label: string;
  href: string;
}

interface NavRowProps {
  tabs: NavTab[];
  variant?: 'onDark' | 'onLight';
}

export default function NavRow({ tabs, variant = 'onDark' }: NavRowProps) {
  const pathname = usePathname();

  if (variant === 'onLight') {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // onDark — embedded inside a gradient/colored header
  return (
    <div className="overflow-x-auto scrollbar-hide -mb-px mt-4">
      <div className="flex gap-0 min-w-max">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                active
                  ? 'border-white text-white'
                  : 'border-transparent text-white/60 hover:text-white/90 hover:border-white/30'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
