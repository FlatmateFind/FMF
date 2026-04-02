'use client';
import { useState, useEffect } from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import { incrementViews } from '@/lib/viewTracker';

interface Props {
  listingId: string;
}

export default function ViewCounter({ listingId }: Props) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    setViews(incrementViews(listingId));
  }, [listingId]);

  if (views === null) return null;

  const isHot = views >= 80;

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5 text-sm text-slate-500">
        <Eye className="w-4 h-4 text-slate-400" />
        <span><strong className="text-slate-700">{views.toLocaleString()}</strong> views</span>
      </span>
      {isHot && (
        <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full border border-orange-200">
          <TrendingUp className="w-3 h-3" /> Popular
        </span>
      )}
    </div>
  );
}
