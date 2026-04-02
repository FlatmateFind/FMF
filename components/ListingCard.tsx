'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Users, BadgeCheck, Heart, GitCompareArrows, Eye, Flame, Zap, Home as HomeIcon, ArrowLeftRight } from 'lucide-react';
import { Listing } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useCompare } from '@/hooks/useCompare';
import { useAuth } from '@/context/AuthContext';
import { getViews } from '@/lib/viewTracker';
import AuthPromptModal from '@/components/AuthPromptModal';
import clsx from 'clsx';

interface ListingCardProps {
  listing: Listing;
}

const TYPE_COLORS: Record<string, string> = {
  'private room': 'bg-teal-600 text-white',
  'whole apartment': 'bg-blue-600 text-white',
  'whole house': 'bg-emerald-600 text-white',
  'studio': 'bg-violet-600 text-white',
  'shared room': 'bg-orange-500 text-white',
};

export default function ListingCard({ listing }: ListingCardProps) {
  const { user } = useAuth();
  const { isFavorited, toggle: toggleFavorite } = useFavorites();
  const { isSelected: isCompared, isFull: compareFull, toggle: toggleCompare } = useCompare();
  const favorited = isFavorited(listing.id);
  const compared = isCompared(listing.id);
  const periodLabel = listing.rent.period === 'week' ? 'pw' : 'pm';
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [views, setViews] = useState(0);
  useEffect(() => { setViews(getViews(listing.id)); }, [listing.id]);

  function handleHeartClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowAuthPrompt(true);
    } else {
      toggleFavorite(listing.id);
    }
  }

  return (
    <>
    {showAuthPrompt && (
      <AuthPromptModal
        onClose={() => setShowAuthPrompt(false)}
        returnTo={`/listings/${listing.id}`}
      />
    )}
    <div className={clsx(
      "group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 transition-all duration-200",
      listing.status === 'taken' || listing.status === 'expired'
        ? "opacity-70"
        : "hover:shadow-md hover:-translate-y-0.5"
    )}>
      {/* Image */}
      <Link href={`/listings/${listing.id}`} className="block relative h-48 overflow-hidden">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Taken / Expired overlay */}
        {(listing.status === 'taken' || listing.status === 'expired') && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className={clsx(
              'px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide',
              listing.status === 'taken' ? 'bg-red-600 text-white' : 'bg-slate-600 text-white'
            )}>
              {listing.status === 'taken' ? 'Taken' : 'Expired'}
            </span>
          </div>
        )}
        {/* Type + Featured + Stay type badges — stacked vertically, top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold capitalize shadow-sm', TYPE_COLORS[listing.type] ?? 'bg-slate-600 text-white')}>
            {listing.type}
          </span>
          {listing.stayType && (
            <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm self-start', {
              'bg-blue-600 text-white': listing.stayType === 'short term',
              'bg-emerald-600 text-white': listing.stayType === 'long term',
              'bg-violet-600 text-white': listing.stayType === 'both',
            })}>
              {listing.stayType === 'short term'
                ? <><Zap className="w-3 h-3 inline mr-1" />Short term</>
                : listing.stayType === 'long term'
                ? <><HomeIcon className="w-3 h-3 inline mr-1" />Long term</>
                : <><ArrowLeftRight className="w-3 h-3 inline mr-1" />Both</>
              }
            </span>
          )}
          {listing.featured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-900 shadow-sm self-start">
              Featured
            </span>
          )}
        </div>
        {/* View count — bottom left */}
        {views > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <Eye className="w-3 h-3" />
            {views >= 80 ? <><Flame className="w-3 h-3 text-orange-300" /><span className="font-semibold text-orange-300">{views}</span></> : views}
          </div>
        )}
        {/* Heart / Save button — top right */}
        <button
          onClick={handleHeartClick}
          className={clsx(
            'absolute top-3 right-3 p-2 rounded-full shadow-md transition-all',
            favorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 backdrop-blur text-slate-400 hover:text-rose-500 hover:bg-white'
          )}
          aria-label={favorited ? 'Remove from saved' : 'Save listing'}
        >
          <Heart className={clsx('w-4 h-4', favorited && 'fill-current')} />
        </button>
      </Link>

      {/* Body */}
      <Link href={`/listings/${listing.id}`} className="block p-4">
        {/* Title + Price row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-teal-600 transition-colors flex-1">
            {listing.title}
          </h3>
          <div className="shrink-0 text-right leading-tight">
            <span className="text-base font-bold text-teal-600 whitespace-nowrap">
              ${listing.rent.amount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">/{periodLabel}</span>
          </div>
        </div>

        {/* Location */}
        <p className="text-sm text-slate-500 mb-3">
          {listing.location.suburb}, {listing.location.city}
        </p>

        {/* Key stats */}
        <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            {listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {listing.currentOccupants}/{listing.totalCapacity} people
          </span>
        </div>

        {/* Inclusions pills — in card body, no overlap issues */}
        {listing.inclusions.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.inclusions.slice(0, 3).map((inc) => (
              <span key={inc} className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full text-xs font-medium">
                {inc}
              </span>
            ))}
            {listing.inclusions.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">
                +{listing.inclusions.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-600">{listing.postedBy.name}</span>
            {listing.postedBy.verified && (
              <BadgeCheck className="w-3.5 h-3.5 text-teal-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(listing.id); }}
              disabled={!compared && compareFull}
              title={compared ? 'Remove from compare' : compareFull ? 'Compare is full (max 2)' : 'Add to compare'}
              className={clsx(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-all',
                compared
                  ? 'bg-teal-600 text-white border-teal-600'
                  : compareFull
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-teal-400 hover:text-teal-600'
              )}
            >
              <GitCompareArrows className="w-3 h-3" />
              {compared ? 'Added' : 'Compare'}
            </button>
            <span className={clsx(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              listing.furnished === 'furnished' ? 'bg-teal-50 text-teal-700' :
              listing.furnished === 'partially furnished' ? 'bg-amber-50 text-amber-700' :
              'bg-slate-100 text-slate-600'
            )}>
              {listing.furnished}
            </span>
          </div>
        </div>
      </Link>
    </div>
    </>
  );
}
