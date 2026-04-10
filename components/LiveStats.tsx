'use client';
import { useEffect, useState, useRef } from 'react';
import { listings as seedListings } from '@/data/listings';
import { createClient } from '@/lib/supabase/client';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

// Animate a number from `from` to `to` over ~1s
function useCountUp(target: number, enabled: boolean) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const start = performance.now();
    const duration = 900;

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    }

    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, enabled]);

  return display;
}

function StatItem({ value, suffix, label, animate }: Stat & { animate: boolean }) {
  const display = useCountUp(value, animate);
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-teal-600">
        {animate ? display.toLocaleString() : value.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}

export default function LiveStats() {
  const [stats, setStats] = useState<Stat[]>([
    { value: seedListings.length, suffix: '+', label: 'Listings' },
    { value: 120,                 suffix: '+', label: 'Renters joined' },
    { value: 8,                   suffix: '',  label: 'States & Territories' },
    { value: 0,                   suffix: '',  label: 'Free to browse' },
  ]);
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Query Supabase for live counts
  useEffect(() => {
    async function fetchCounts() {
      try {
        const supabase = createClient();

        // Count active DB listings
        const { count: dbListingCount } = await supabase
          .from('listings')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active');

        // Count renter profiles
        const { count: renterCount } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'renter');

        const totalListings = seedListings.length + (dbListingCount ?? 0);
        // Seed offset so numbers feel established even with 0 sign-ups
        const totalRenters = 120 + (renterCount ?? 0);

        setStats([
          { value: totalListings, suffix: '+', label: 'Listings' },
          { value: totalRenters,  suffix: '+', label: 'Renters joined' },
          { value: 8,             suffix: '',  label: 'States & Territories' },
          { value: 0,             suffix: '',  label: 'Free to browse' },
        ]);
      } catch {
        // On error, keep default seed-based values
      }
    }
    void fetchCounts();
  }, []);

  // Trigger count-up animation when the section scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white border-b border-slate-200">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) =>
            s.label === 'Free to browse' ? (
              // Static "Free" tile — no number animation
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-teal-600">Free</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ) : (
              <StatItem key={s.label} {...s} animate={animate} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
