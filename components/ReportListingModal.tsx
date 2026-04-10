'use client';
import { useState, useEffect, FormEvent } from 'react';
import { Flag, X, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const REASONS = [
  'Fake or fraudulent listing',
  'Incorrect price or details',
  'Property already rented / unavailable',
  'Suspicious payment request',
  'Inappropriate content',
  'Duplicate listing',
  'Other',
];

interface Props {
  listingId: string;
  listingTitle: string;
  onClose: () => void;
}

export default function ReportListingModal({ listingId, listingTitle, onClose }: Props) {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!reason) return;

    // Save report to Supabase
    try {
      const supabase = createClient();
      await supabase.from('reports').insert({
        listing_id: listingId,
        listing_title: listingTitle,
        reason,
        details: comment.trim(),
      });
    } catch { /* fail silently */ }

    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          /* Success state */
          <div className="text-center py-4">
            <div className="flex items-center justify-center w-14 h-14 bg-green-50 rounded-full mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Report submitted</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Thank you for helping keep FlatmateFind safe. We&apos;ll review this listing and take action if it violates our policies.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Report form */
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <Flag className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Report this listing</h2>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{listingTitle}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Why are you reporting this listing? <span className="text-red-500">*</span></p>
                <div className="space-y-2">
                  {REASONS.map((r) => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="w-4 h-4 text-red-500 border-slate-300 focus:ring-red-400"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Additional details <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Tell us more about the issue..."
                  className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none resize-none"
                />
                <p className="text-xs text-slate-400 text-right mt-0.5">{comment.length}/500</p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason}
                  className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit report
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
