'use client';
import { useState } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Props {
  listingId: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ListingComments({ listingId }: Props) {
  const { user } = useAuth();
  const { comments, addComment, deleteComment } = useComments(listingId);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim() || submitting) return;
    setSubmitting(true);
    addComment(user.id, user.name, text);
    setText('');
    setSubmitting(false);
  }

  return (
    <div className="mt-10 border-t border-slate-200 pt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-teal-600" />
        <h2 className="text-xl font-bold text-slate-900">
          Comments {comments.length > 0 && <span className="text-slate-400 font-normal text-base">({comments.length})</span>}
        </h2>
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-sm font-bold text-teal-600">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Leave a comment or ask a question..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm resize-none bg-white"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-400">{text.length}/500</span>
                <button
                  type="submit"
                  disabled={!text.trim() || submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <p className="text-sm text-slate-600 mb-2">Sign in to leave a comment</p>
          <Link
            href={`/auth/signin?from=/listings/${listingId}`}
            className="text-sm font-semibold text-teal-600 hover:text-teal-800 underline"
          >
            Sign in / Register →
          </Link>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No comments yet. Be the first to ask a question!</p>
      ) : (
        <div className="space-y-5">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm font-bold text-slate-500">{c.userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 bg-white rounded-xl border border-slate-200 px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{c.userName}</span>
                    <span className="text-xs text-slate-400">{timeAgo(c.createdAt)}</span>
                  </div>
                  {user?.id === c.userId && (
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
