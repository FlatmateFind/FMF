'use client';
import { SlidersHorizontal, X } from 'lucide-react';
import { RenterProfileFilters, AUSTRALIAN_STATES, PROPERTY_TYPES, NATIONALITIES } from '@/lib/types';

interface Props {
  filters: RenterProfileFilters;
  onChange: (f: RenterProfileFilters) => void;
  total: number;
  filtered: number;
}

export default function RenterFilterPanel({ filters, onChange, total, filtered }: Props) {
  function update<K extends keyof RenterProfileFilters>(key: K, value: RenterProfileFilters[K]) {
    onChange({ ...filters, [key]: value || undefined });
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '');

  return (
    <aside className="w-72 shrink-0">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-24">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <SlidersHorizontal className="w-4 h-4 text-teal-600" />
            Filter Renters
          </div>
          {hasFilters && (
            <button
              onClick={() => onChange({})}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-5">
          {filtered} of {total} profile{total !== 1 ? 's' : ''}
        </p>

        {/* State */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Looking in State
          </label>
          <select
            value={filters.state || ''}
            onChange={(e) => update('state', e.target.value || undefined)}
            className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          >
            <option value="">Any state</option>
            {AUSTRALIAN_STATES.map((s) => (
              <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>
            ))}
          </select>
        </div>

        {/* Max budget */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Max Budget (AUD/week)
          </label>
          <input
            type="number"
            placeholder="e.g. 400"
            value={filters.maxBudget || ''}
            onChange={(e) => update('maxBudget', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">Show renters whose max budget ≤ this</p>
        </div>

        {/* Available by */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Available By
          </label>
          <input
            type="date"
            value={filters.availableBy || ''}
            onChange={(e) => update('availableBy', e.target.value || undefined)}
            className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">Show renters ready to move in by this date</p>
        </div>

        {/* Room type */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Looking For
          </label>
          <select
            value={filters.roomType || ''}
            onChange={(e) => update('roomType', e.target.value || undefined)}
            className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          >
            <option value="">Any type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
        </div>

        {/* Nationality */}
        <div className="mb-1">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Renter Nationality
          </label>
          <select
            value={filters.nationality || ''}
            onChange={(e) => update('nationality', e.target.value || undefined)}
            className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          >
            <option value="">Any nationality</option>
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
