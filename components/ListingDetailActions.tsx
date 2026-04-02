'use client';
import { useState } from 'react';
import { Heart, MessageCircle, BadgeCheck, Star, Flag } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { useShortlist } from '@/hooks/useShortlist';
import { useAuth } from '@/context/AuthContext';
import ChatModal from '@/components/ChatModal';
import AuthPromptModal from '@/components/AuthPromptModal';
import ReportListingModal from '@/components/ReportListingModal';
import { Listing } from '@/lib/types';

interface ListingDetailActionsProps {
  listing: Listing;
  availableDate: string;
}

export default function ListingDetailActions({ listing, availableDate }: ListingDetailActionsProps) {
  const { user } = useAuth();
  const { isFavorited, toggle: toggleFavorite } = useFavorites();
  const { isShortlisted } = useShortlist();
  const [chatOpen, setChatOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  function handleSave() {
    if (!user) { setShowAuthPrompt(true); return; }
    toggleFavorite(listing.id);
  }

  const favorited = isFavorited(listing.id);
  const shortlisted = isShortlisted(listing.id);

  return (
    <>
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Listed by</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-teal-600">
                {listing.postedBy.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900">{listing.postedBy.name}</span>
                {listing.postedBy.verified && (
                  <BadgeCheck className="w-4 h-4 text-teal-500" />
                )}
              </div>
              <div className="text-xs text-slate-500 capitalize">{listing.postedBy.type}</div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600 mb-5 pb-4 border-b border-slate-100">
            <div className="flex justify-between">
              <span>Response time</span>
              <span className="font-medium text-slate-800">{listing.postedBy.responseTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Available from</span>
              <span className="font-medium text-slate-800">{availableDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Rent</span>
              <span className="font-medium text-slate-800">
                {listing.rent.currency} {listing.rent.amount.toLocaleString()}/{listing.rent.period}
              </span>
            </div>
          </div>

          {/* Shortlisted indicator */}
          {shortlisted && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span className="text-xs text-amber-700 font-medium">You shortlisted this renter</span>
            </div>
          )}

          <button
            onClick={() => setChatOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Message Host
          </button>

          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 mt-2 py-3 border font-semibold rounded-lg transition-all ${
              favorited
                ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100'
                : 'border-teal-200 text-teal-700 hover:bg-teal-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            {favorited ? 'Saved' : 'Save listing'}
          </button>
        </div>

        {/* Quick links */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-700 mb-2">Looking for something similar?</p>
          <Link
            href={`/listings?city=${encodeURIComponent(listing.location.city)}`}
            className="block text-center py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:border-teal-300 hover:text-teal-600 transition-colors"
          >
            More in {listing.location.city}
          </Link>
        </div>

        {/* Report listing */}
        <button
          onClick={() => setReportOpen(true)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors mx-auto"
        >
          <Flag className="w-3.5 h-3.5" />
          Report this listing
        </button>
      </div>

      {/* Chat Modal */}
      {chatOpen && <ChatModal listing={listing} onClose={() => setChatOpen(false)} />}
      {showAuthPrompt && <AuthPromptModal onClose={() => setShowAuthPrompt(false)} returnTo={`/listings/${listing.id}`} />}
      {reportOpen && <ReportListingModal listingId={listing.id} listingTitle={listing.title} onClose={() => setReportOpen(false)} />}
    </>
  );
}
