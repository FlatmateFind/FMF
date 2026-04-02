'use client';
import { useEffect, useRef, useState } from 'react';
import { X, Send, Star, StarOff, MessageCircle, User, Search } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useShortlist } from '@/hooks/useShortlist';
import { Listing } from '@/lib/types';

interface ChatModalProps {
  listing: Listing;
  onClose: () => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatModal({ listing, onClose }: ChatModalProps) {
  const { messages, send, isTyping } = useChat(listing.id, listing.postedBy.name);
  const { isShortlisted, toggle: toggleShortlist } = useShortlist();
  const [input, setInput] = useState('');
  const [isHostView, setIsHostView] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleSend() {
    if (!input.trim()) return;
    send(input.trim());
    setInput('');
  }

  const shortlisted = isShortlisted(listing.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:w-[420px] sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[600px]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
          <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-teal-600 text-sm">
              {listing.postedBy.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
              {listing.postedBy.name}
            </p>
            <p className="text-xs text-slate-400 truncate">{listing.title}</p>
          </div>

          {/* Host view toggle */}
          <button
            onClick={() => setIsHostView((v) => !v)}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
              isHostView
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
            title="Switch between renter and host view"
          >
            {isHostView
              ? <><User className="w-3.5 h-3.5 inline mr-1" />Host view</>
              : <><Search className="w-3.5 h-3.5 inline mr-1" />Renter view</>
            }
          </button>

          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Host-mode shortlist banner */}
        {isHostView && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between shrink-0">
            <span className="text-xs text-amber-700 font-medium">
              Host mode — reviewing renter enquiry
            </span>
            <button
              onClick={() => toggleShortlist(listing.id)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                shortlisted
                  ? 'bg-amber-500 text-white'
                  : 'bg-white border border-amber-300 text-amber-600 hover:bg-amber-50'
              }`}
            >
              {shortlisted ? (
                <><Star className="w-3 h-3 fill-current" /> Shortlisted</>
              ) : (
                <><StarOff className="w-3 h-3" /> Shortlist renter</>
              )}
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg) => {
            const isYou = msg.sender === 'you';
            return (
              <div key={msg.id} className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                {!isYou && (
                  <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mr-2 self-end">
                    <span className="text-xs font-bold text-teal-600">
                      {listing.postedBy.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className={`max-w-[75%] ${isYou ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isYou
                        ? 'bg-teal-600 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mr-2 self-end">
                <span className="text-xs font-bold text-teal-600">{listing.postedBy.name.charAt(0)}</span>
              </div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100 shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none max-h-24"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
