'use client';
import { useState, useRef, useEffect } from 'react';
import { Share2, Facebook, MessageCircle, Copy, Check, MessageSquare } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title?: string;
  size?: 'sm' | 'md';
}

const SHARE_OPTIONS = [
  {
    key: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    color: 'text-[#1877F2]',
    bg: 'hover:bg-[#1877F2]/10',
    action: (url: string, title?: string) => {
      const u = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}${title ? `&quote=${encodeURIComponent(title)}` : ''}`;
      window.open(u, '_blank', 'noopener,noreferrer,width=600,height=500');
    },
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-[#25D366]',
    bg: 'hover:bg-[#25D366]/10',
    action: (url: string, title?: string) => {
      const text = title ? `${title}\n${url}` : url;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    },
  },
  {
    key: 'sms',
    label: 'SMS',
    icon: MessageSquare,
    color: 'text-slate-600',
    bg: 'hover:bg-slate-100',
    action: (url: string, title?: string) => {
      const body = title ? `${title} — ${url}` : url;
      window.location.href = `sms:?body=${encodeURIComponent(body)}`;
    },
  },
  {
    key: 'copy',
    label: 'Copy link',
    icon: Copy,
    color: 'text-slate-600',
    bg: 'hover:bg-slate-100',
    action: () => {},  // handled separately
  },
];

export default function ShareButton({ url, title, size = 'sm' }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
    } catch {
      setOpen(false);
    }
  }

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const btnSize = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Share"
        className={`flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all ${btnSize}`}
      >
        <Share2 className={iconSize} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 min-w-[140px]">
          {/* Caret */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45" />

          {SHARE_OPTIONS.map(({ key, label, icon: Icon, color, bg, action }) => {
            const isCopy = key === 'copy';
            return (
              <button
                key={key}
                onClick={() => {
                  if (isCopy) { handleCopy(); return; }
                  action(url, title);
                  setOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 transition-colors ${bg}`}
              >
                {isCopy && copied
                  ? <Check className={`w-3.5 h-3.5 text-teal-500`} />
                  : <Icon className={`w-3.5 h-3.5 ${color}`} />
                }
                {isCopy && copied ? <span className="text-teal-600">Copied!</span> : label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
