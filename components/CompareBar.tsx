'use client';
import { useRouter } from 'next/navigation';
import { X, GitCompareArrows } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import { listings } from '@/data/listings';

export default function CompareBar() {
  const { ids, remove, clear } = useCompare();
  const router = useRouter();

  if (ids.length === 0) return null;

  const selected = ids.map((id) => listings.find((l) => l.id === id)).filter(Boolean);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 shrink-0">
          <GitCompareArrows className="w-4 h-4 text-teal-600" />
          Compare
        </div>

        <div className="flex-1 flex items-center gap-3 min-w-0">
          {selected.map((l) => l && (
            <div key={l.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-0">
              <span className="text-sm text-slate-800 font-medium truncate max-w-[160px]">{l.title}</span>
              <span className="text-xs text-teal-600 font-semibold shrink-0">
                ${l.rent.amount}/{l.rent.period === 'week' ? 'pw' : 'pm'}
              </span>
              <button
                onClick={() => remove(l.id)}
                className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Remove from compare"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Empty slot */}
          {ids.length < 2 && (
            <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg px-4 py-1.5 text-xs text-slate-400">
              + Add one more listing
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            Clear
          </button>
          <button
            disabled={ids.length < 2}
            onClick={() => router.push(`/compare?ids=${ids.join(',')}`)}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Compare now
          </button>
        </div>
      </div>
    </div>
  );
}
