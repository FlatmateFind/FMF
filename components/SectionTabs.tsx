'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  label: string;
  href: string;
}

interface SectionTabsProps {
  tabs: Tab[];
  className?: string;
}

export default function SectionTabs({ tabs, className }: SectionTabsProps) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-1">
          {tabs.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
