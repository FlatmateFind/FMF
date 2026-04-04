'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  size?: 'lg' | 'md';
  initialValue?: string;
}

export default function SearchBar({
  placeholder = 'Search by suburb, city, or keyword...',
  size = 'lg',
  initialValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('query', query.trim());
    router.push(`/listings?${params.toString()}`);
  };

  const isLarge = size === 'lg';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative flex items-center bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden ${isLarge ? 'h-14' : 'h-11'}`}>
        <Search className={`shrink-0 ml-4 text-slate-400 ${isLarge ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 px-3 ${isLarge ? 'text-base' : 'text-sm'}`}
        />
        <button
          type="submit"
          className={`shrink-0 m-1.5 flex items-center gap-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors ${isLarge ? 'px-4 py-2.5 text-sm' : 'px-3 py-2 text-xs'}`}
        >
          <Search className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}
