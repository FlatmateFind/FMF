import Link from 'next/link';
import { Calculator, ChevronRight } from 'lucide-react';

const TOOLS = [
  {
    href: '/tools/tax-calculator',
    icon: Calculator,
    color: 'bg-indigo-100 text-indigo-600',
    title: 'Tax Refund Calculator',
    desc: 'Estimate your Australian tax refund for all visa types — Working Holiday, Student, Skilled, and more.',
    badge: 'Free',
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tools</h1>
        <p className="text-slate-500 mb-8">Free calculators and resources for renters and workers in Australia.</p>

        <div className="grid gap-4">
          {TOOLS.map(({ href, icon: Icon, color, title, desc, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{title}</h2>
                  {badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">{badge}</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
