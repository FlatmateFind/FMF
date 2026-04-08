'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

const BTN_THEMES: { prefix: string; bg: string; hover: string }[] = [
  { prefix: '/jobs',                     bg: 'bg-blue-600',    hover: 'hover:bg-blue-700'    },
  { prefix: '/business',                 bg: 'bg-purple-600',  hover: 'hover:bg-purple-700'  },
  { prefix: '/events',                   bg: 'bg-rose-600',    hover: 'hover:bg-rose-700'    },
  { prefix: '/market',                   bg: 'bg-amber-500',   hover: 'hover:bg-amber-600'   },
  { prefix: '/community',                bg: 'bg-blue-600',    hover: 'hover:bg-blue-700'    },
  { prefix: '/takeover',                 bg: 'bg-orange-500',  hover: 'hover:bg-orange-600'  },
  { prefix: '/tools/compatibility-quiz', bg: 'bg-violet-600',  hover: 'hover:bg-violet-700'  },
  { prefix: '/tools/tax-calculator',     bg: 'bg-indigo-600',  hover: 'hover:bg-indigo-700'  },
  { prefix: '/tools/whv-tracker',        bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  { prefix: '/tools/hours-tracker',      bg: 'bg-blue-600',    hover: 'hover:bg-blue-700'    },
  { prefix: '/tools/abn-tfn',            bg: 'bg-slate-700',   hover: 'hover:bg-slate-800'   },
  { prefix: '/tools/visa-pathways',      bg: 'bg-indigo-600',  hover: 'hover:bg-indigo-700'  },
  { prefix: '/tools',                    bg: 'bg-violet-600',  hover: 'hover:bg-violet-700'  },
];

function useBtnTheme(pathname: string) {
  const sorted = [...BTN_THEMES].sort((a, b) => b.prefix.length - a.prefix.length);
  const match = sorted.find((p) => pathname.startsWith(p.prefix));
  return match ?? { bg: 'bg-teal-600', hover: 'hover:bg-teal-700' };
}

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const { bg, hover } = useBtnTheme(pathname);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[60] w-11 h-11 sm:w-10 sm:h-10 ${bg} ${hover} text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
