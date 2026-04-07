'use client';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  url: string;        // full URL to share
  title?: string;     // optional text for the share message
  size?: 'sm' | 'md';
  variant?: 'icon' | 'pill';
}

export default function ShareButton({ url, title, size = 'sm', variant = 'pill' }: ShareButtonProps) {
  function handleShare() {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}${title ? `&quote=${encodeURIComponent(title)}` : ''}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        title="Share on Facebook"
        className={`flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all ${
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
        }`}
      >
        <Share2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1877F2] hover:bg-[#166FE5] text-white transition-colors"
    >
      <Share2 className="w-3 h-3" />
      Share
    </button>
  );
}
