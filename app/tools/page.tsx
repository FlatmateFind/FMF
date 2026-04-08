import Link from 'next/link';
import { Calculator, ChevronRight, Users, CalendarCheck, Clock, Briefcase, Wrench, Layers } from 'lucide-react';

const TOOLS = [
  {
    href: '/tools/compatibility-quiz',
    icon: Users,
    color: 'bg-violet-100 text-violet-600',
    accent: 'border-violet-200',
    title: 'Flatmate Compatibility Quiz',
    desc: 'Discover your flatmate personality type and who you\'d live best with. 10 questions, instant result.',
    badge: 'Popular',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    href: '/tools/tax-calculator',
    icon: Calculator,
    color: 'bg-indigo-100 text-indigo-600',
    accent: 'border-indigo-200',
    title: 'Tax Refund Calculator',
    desc: 'Estimate your Australian tax refund for all visa types — Working Holiday, Student, Skilled, and more.',
    badge: 'Free',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
  {
    href: '/tools/whv-tracker',
    icon: CalendarCheck,
    color: 'bg-emerald-100 text-emerald-600',
    accent: 'border-emerald-200',
    title: 'WHV Days Tracker',
    desc: 'Track your 88 or 179 regional work days for 2nd and 3rd year Working Holiday Visa eligibility.',
    badge: null,
    badgeColor: '',
  },
  {
    href: '/tools/hours-tracker',
    icon: Clock,
    color: 'bg-blue-100 text-blue-600',
    accent: 'border-blue-200',
    title: 'Visa Work Hours Tracker',
    desc: 'Log your weekly work hours and track fortnightly totals. Configurable limit for any visa condition.',
    badge: null,
    badgeColor: '',
  },
  {
    href: '/tools/abn-tfn',
    icon: Briefcase,
    color: 'bg-slate-100 text-slate-600',
    accent: 'border-slate-200',
    title: 'ABN vs TFN Calculator',
    desc: 'Side-by-side take-home pay comparison as an ABN contractor vs a PAYG employee in Australia.',
    badge: null,
    badgeColor: '',
  },
  {
    href: '/tools/visa-pathways',
    icon: Layers,
    color: 'bg-indigo-100 text-indigo-600',
    accent: 'border-indigo-200',
    title: 'Visa Pathways',
    desc: 'Explore every visa option to stay longer, get sponsored, or achieve PR — personalised to your current visa and goals.',
    badge: 'New',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Tools</h1>
        </div>
        <p className="text-slate-500 mb-8 text-sm">Free calculators and tools for renters, workers, and visa holders in Australia.</p>

        <div className="grid gap-3">
          {TOOLS.map(({ href, icon: Icon, color, accent, title, desc, badge, badgeColor }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 bg-white border ${accent} rounded-2xl p-5 hover:shadow-md transition-all group`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{title}</h2>
                  {badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
