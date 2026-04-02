/**
 * AdSlot — placeholder ad unit.
 *
 * To go live, replace the inner <div> with your real ad code
 * (e.g. Google AdSense <ins> tag, or a direct image/link banner).
 *
 * Sizes:
 *  leaderboard — 728×90  (full-width page top/bottom banner)
 *  banner      — full-width, short  (between sections)
 *  rectangle   — 300×250 equivalent (sidebar)
 *  inline      — full card width, short (between listing cards in grid)
 */

type AdSize = 'leaderboard' | 'banner' | 'rectangle' | 'inline';

const SIZE_STYLES: Record<AdSize, { wrapper: string; height: string; label: string }> = {
  leaderboard: {
    wrapper: 'w-full',
    height: 'h-[90px]',
    label: '728 × 90 — Leaderboard',
  },
  banner: {
    wrapper: 'w-full',
    height: 'h-[80px] sm:h-[100px]',
    label: 'Full-width Banner',
  },
  rectangle: {
    wrapper: 'w-full',
    height: 'h-[250px]',
    label: '300 × 250 — Rectangle',
  },
  inline: {
    wrapper: 'w-full col-span-full sm:col-span-2 xl:col-span-3',
    height: 'h-[100px]',
    label: 'In-feed Banner',
  },
};

interface AdSlotProps {
  size: AdSize;
  className?: string;
  /** Optional label override, e.g. "Sponsored" */
  label?: string;
}

export default function AdSlot({ size, className = '', label }: AdSlotProps) {
  const { wrapper, height } = SIZE_STYLES[size];

  return (
    <div className={`${wrapper} ${className}`}>
      {/* ── Replace everything inside this div with your real ad code ── */}
      <div
        className={`
          relative flex flex-col items-center justify-center
          ${height}
          rounded-xl border border-dashed border-slate-300
          bg-gradient-to-br from-slate-50 to-slate-100
          overflow-hidden
        `}
      >
        {/* Ad badge */}
        <span className="absolute top-2 left-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label ?? 'Advertisement'}
        </span>

        {/* Placeholder content */}
        <div className="flex flex-col items-center gap-1 text-center px-4">
          <span className="text-2xl opacity-30">📢</span>
          <p className="text-xs font-semibold text-slate-400">Your ad here</p>
          <p className="text-[10px] text-slate-300 hidden sm:block">{SIZE_STYLES[size].label}</p>
        </div>

        {/* Subtle diagonal stripe pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #64748b 0, #64748b 1px, transparent 0, transparent 50%)',
            backgroundSize: '12px 12px',
          }}
        />
      </div>
    </div>
  );
}
