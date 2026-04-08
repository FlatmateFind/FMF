'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, PlusCircle, Trash2, CalendarDays, MapPin,
  CheckCircle2, Clock, Info, AlertTriangle, ChevronDown, ChevronUp,
  Briefcase, Shovel, Fish, TreePine, HardHat, Hotel, Flame,
  Heart, TrendingUp, FileText, ExternalLink, BadgeCheck, Star,
  CalendarRange, BarChart3, ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';
import { SEED_JOBS, type JobPost } from '@/data/jobs';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'flatmatefind_whv_tracker_v2';
type WHVYear = '2nd' | '3rd';

interface WorkEntry {
  id: string;
  employer: string;
  state: string;
  workType: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

const REQUIRED_DAYS: Record<WHVYear, number> = { '2nd': 88, '3rd': 179 };

const WORK_TYPES = [
  { value: 'Plant & animal cultivation', label: 'Plant & animal cultivation', icon: Shovel, desc: 'Fruit picking, harvesting, farm work, animal husbandry' },
  { value: 'Fishing & pearling', label: 'Fishing & pearling', icon: Fish, desc: 'Commercial fishing, prawn farming, pearl farming' },
  { value: 'Tree farming & felling', label: 'Tree farming & felling', icon: TreePine, desc: 'Logging, tree planting, plantation management' },
  { value: 'Mining', label: 'Mining', icon: HardHat, desc: 'Any mining or mineral extraction work' },
  { value: 'Construction (regional)', label: 'Construction (regional)', icon: HardHat, desc: 'Building, civil works in regional/remote areas' },
  { value: 'Tourism & hospitality (remote/regional)', label: 'Tourism & hospitality (regional)', icon: Hotel, desc: 'Remote resort, outback tourism, regional hotel work' },
  { value: 'Bushfire / disaster recovery', label: 'Bushfire / disaster recovery', icon: Flame, desc: 'Recovery or support work in disaster-affected areas' },
  { value: 'Aged care & disability (regional)', label: 'Aged care & disability (regional)', icon: Heart, desc: 'Support work in regional or remote aged care facilities' },
];

// States that qualify for 3rd year (Northern Australia)
const THIRD_YEAR_STATES = ['NT'];
const THIRD_YEAR_STATE_NOTES: Record<string, string> = {
  NT: 'All of Northern Territory qualifies for 3rd year.',
  QLD: 'Only work north of the Tropic of Capricorn (Townsville, Cairns, Mt Isa) counts for 3rd year.',
  WA: 'Only work north of the 26th parallel (Geraldton, Karratha, Broome, Port Hedland) counts for 3rd year.',
  SA: 'Only specified remote areas of SA count for 3rd year. Check IMMI for postcodes.',
};

const AU_STATES_FULL: { abbr: string; name: string; note2nd: string }[] = [
  { abbr: 'NSW', name: 'New South Wales', note2nd: 'Regional NSW qualifies (outside Sydney metro).' },
  { abbr: 'VIC', name: 'Victoria', note2nd: 'Regional VIC qualifies (outside Melbourne metro).' },
  { abbr: 'QLD', name: 'Queensland', note2nd: 'Most of QLD qualifies for 2nd year.' },
  { abbr: 'WA', name: 'Western Australia', note2nd: 'Regional WA qualifies. Northern WA also counts for 3rd year.' },
  { abbr: 'SA', name: 'South Australia', note2nd: 'Regional SA qualifies for 2nd year.' },
  { abbr: 'TAS', name: 'Tasmania', note2nd: 'Entire state qualifies.' },
  { abbr: 'NT', name: 'Northern Territory', note2nd: 'Entire NT qualifies for 2nd and 3rd year.' },
  { abbr: 'ACT', name: 'Australian Capital Territory', note2nd: 'Generally not considered regional — check IMMI.' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Plant & animal cultivation': 'bg-lime-100 text-lime-700',
  'Fishing & pearling': 'bg-blue-100 text-blue-700',
  'Tree farming & felling': 'bg-emerald-100 text-emerald-700',
  'Mining': 'bg-amber-100 text-amber-700',
  'Construction (regional)': 'bg-orange-100 text-orange-700',
  'Tourism & hospitality (remote/regional)': 'bg-violet-100 text-violet-700',
  'Bushfire / disaster recovery': 'bg-red-100 text-red-700',
  'Aged care & disability (regional)': 'bg-pink-100 text-pink-700',
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Plant & animal cultivation': Shovel,
  'Fishing & pearling': Fish,
  'Tree farming & felling': TreePine,
  'Mining': HardHat,
  'Construction (regional)': HardHat,
  'Tourism & hospitality (remote/regional)': Hotel,
  'Bushfire / disaster recovery': Flame,
  'Aged care & disability (regional)': Heart,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 0;
  return Math.floor((e.getTime() - s.getTime()) / 86400000) + 1;
}

function fmtDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function inputCls(err?: string) {
  return `w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 bg-white ${
    err ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-300 focus:border-emerald-400'
  }`;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
      {children}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );
}

function WHVJobCard({ job }: { job: JobPost }) {
  const catColor = CATEGORY_COLORS[job.whvCategory ?? ''] ?? 'bg-slate-100 text-slate-600';
  const CatIcon = CATEGORY_ICONS[job.whvCategory ?? ''] ?? Briefcase;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 leading-tight">{job.title}</p>
          {job.company && <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {job.whvYears?.includes('3rd') && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
              <Star className="w-2.5 h-2.5" /> 3rd yr
            </span>
          )}
          {job.whvYears?.includes('2nd') && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
              <BadgeCheck className="w-2.5 h-2.5" /> 2nd yr
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2.5">
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${catColor}`}>
          <CatIcon className="w-2.5 h-2.5" />
          {job.whvCategory}
        </span>
        <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
          <MapPin className="w-2.5 h-2.5" />{job.suburb}, {job.state}
        </span>
        <span className="text-[10px] text-slate-500">{job.type}</span>
      </div>

      {job.salary && (
        <p className="text-xs font-semibold text-teal-700 mb-2">{job.salary}</p>
      )}
      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{job.description}</p>
      <a
        href={`mailto:${job.contactEmail}`}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
      >
        Apply via email <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function WHVTrackerPage() {
  const [year, setYear] = useState<WHVYear>('2nd');
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employer: '', state: '', workType: '', startDate: '', endDate: '', notes: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [visaExpiry, setVisaExpiry] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [jobFilter, setJobFilter] = useState<'all' | '2nd' | '3rd'>('all');
  const [loaded, setLoaded] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.year) setYear(d.year);
        if (d.entries) setEntries(d.entries);
        if (d.visaExpiry) setVisaExpiry(d.visaExpiry);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ year, entries, visaExpiry }));
  }, [year, entries, visaExpiry, loaded]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalDays = useMemo(
    () => entries.reduce((sum, e) => sum + daysBetween(e.startDate, e.endDate), 0),
    [entries]
  );

  const required = REQUIRED_DAYS[year];
  const remaining = Math.max(0, required - totalDays);
  const pct = Math.min(100, Math.round((totalDays / required) * 100));
  const done = totalDays >= required;

  // Days per work type
  const byType = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of entries) {
      const d = daysBetween(e.startDate, e.endDate);
      map[e.workType] = (map[e.workType] ?? 0) + d;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  // Pace: avg days per week from entries spanning > 7 days
  const pace = useMemo(() => {
    if (entries.length === 0) return null;
    const sorted = [...entries].sort((a, b) => a.startDate.localeCompare(b.startDate));
    const first = sorted[0].startDate;
    const last = sorted[sorted.length - 1].endDate;
    const spanDays = daysBetween(first, last);
    if (spanDays < 7) return null;
    const rate = (totalDays / spanDays) * 7; // days per week
    return Math.round(rate * 10) / 10;
  }, [entries, totalDays]);

  // Estimated completion date
  const estimatedCompletion = useMemo(() => {
    if (done || !pace || pace <= 0 || entries.length === 0) return null;
    const sorted = [...entries].sort((a, b) => b.endDate.localeCompare(a.endDate));
    const lastDay = sorted[0].endDate;
    const weeksNeeded = remaining / pace;
    return addDays(lastDay, Math.ceil(weeksNeeded * 7));
  }, [done, pace, remaining, entries]);

  // Visa deadline warning
  const visaDaysLeft = visaExpiry ? daysFromNow(visaExpiry) : null;
  const atRisk = estimatedCompletion && visaExpiry && estimatedCompletion > visaExpiry;

  // WHV jobs
  const whvJobs = useMemo(() => {
    return SEED_JOBS.filter((j) => {
      if (!j.whvEligible) return false;
      if (jobFilter === '2nd') return j.whvYears?.includes('2nd');
      if (jobFilter === '3rd') return j.whvYears?.includes('3rd');
      return true;
    });
  }, [jobFilter]);

  // ── Form handlers ──────────────────────────────────────────────────────────
  function setField(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  }

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.employer.trim()) e.employer = 'Required';
    if (!form.state) e.state = 'Required';
    if (!form.workType) e.workType = 'Required';
    if (!form.startDate) e.startDate = 'Required';
    if (!form.endDate) e.endDate = 'Required';
    if (form.startDate && form.endDate && form.endDate < form.startDate) e.endDate = 'Must be after start';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addEntry() {
    if (!validate()) return;
    setEntries((e) => [
      ...e,
      { id: Date.now().toString(), employer: form.employer, state: form.state, workType: form.workType, startDate: form.startDate, endDate: form.endDate, notes: form.notes || undefined },
    ]);
    setForm({ employer: '', state: '', workType: '', startDate: '', endDate: '', notes: '' });
    setShowForm(false);
  }

  function removeEntry(id: string) {
    setEntries((e) => e.filter((x) => x.id !== id));
  }

  const formDays = form.startDate && form.endDate && form.endDate >= form.startDate
    ? daysBetween(form.startDate, form.endDate)
    : 0;

  const isThirdYearState = form.state === 'NT' ||
    (year === '3rd' && ['QLD', 'WA', 'SA'].includes(form.state));

  if (!loaded) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Boxed hero */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white px-6 py-8">
          <Link href="/tools" className="flex items-center gap-1.5 text-emerald-300 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Tools
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <CalendarRange className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">WHV Days Tracker</h1>
              <p className="text-emerald-200 text-sm">
                Track your 88 or 179 regional work days, estimate completion date, and find eligible jobs.
              </p>
            </div>
          </div>
        </div>

        {/* ── Visa year selector ─────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Which extension are you working toward?</h2>
          <div className="grid grid-cols-2 gap-3">
            {(['2nd', '3rd'] as WHVYear[]).map((y) => (
              <button key={y} onClick={() => setYear(y)}
                className={clsx('p-4 rounded-xl border-2 text-left transition-all', {
                  'border-emerald-500 bg-emerald-50': year === y,
                  'border-slate-200 bg-white hover:border-emerald-200': year !== y,
                })}>
                <p className={clsx('text-sm font-bold', year === y ? 'text-emerald-700' : 'text-slate-800')}>
                  {y} Year Extension
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {y === '2nd'
                    ? '88 days — regional Australia, all approved categories'
                    : '179 days — Northern Australia only (NT, north QLD, north WA)'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Visa expiry date ───────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Visa Expiry Date (optional)</h2>
              <p className="text-[11px] text-slate-400">We&apos;ll warn you if you&apos;re at risk of not completing before your visa expires.</p>
            </div>
            <input
              type="date"
              value={visaExpiry}
              onChange={(e) => setVisaExpiry(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          {visaExpiry && visaDaysLeft !== null && (
            <div className={clsx('flex items-center gap-2 mt-3 text-xs rounded-xl px-3 py-2', {
              'bg-rose-50 text-rose-700': visaDaysLeft < 30,
              'bg-amber-50 text-amber-700': visaDaysLeft >= 30 && visaDaysLeft < 90,
              'bg-emerald-50 text-emerald-700': visaDaysLeft >= 90,
            })}>
              {visaDaysLeft < 30 ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
              <span>
                Visa expires in <strong>{visaDaysLeft} days</strong> ({fmtDate(visaExpiry)})
                {atRisk && ' — at current pace you may not reach the required days in time.'}
              </span>
            </div>
          )}
        </div>

        {/* ── Progress dashboard ─────────────────────────────────────────── */}
        <div className={clsx('border rounded-2xl p-5 shadow-sm', done ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200')}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Progress</h2>
            {done && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for extension!
              </span>
            )}
          </div>

          {/* Big numbers */}
          <div className="flex items-end gap-3 mb-4 flex-wrap">
            <div>
              <p className={clsx('text-5xl font-black', done ? 'text-emerald-600' : 'text-slate-900')}>{totalDays}</p>
              <p className="text-xs text-slate-400 mt-0.5">days completed</p>
            </div>
            <p className="text-3xl text-slate-300 font-light mb-1">/</p>
            <div className="mb-1">
              <p className="text-2xl font-bold text-slate-500">{required}</p>
              <p className="text-xs text-slate-400">required</p>
            </div>
            {!done && remaining > 0 && (
              <div className="ml-auto text-right">
                <p className="text-xl font-bold text-amber-600">{remaining}</p>
                <p className="text-xs text-slate-400">days to go</p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className={clsx('h-full rounded-full transition-all duration-700 relative', done ? 'bg-emerald-500' : 'bg-amber-400')}
              style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>0</span>
            <span className="font-semibold">{pct}% complete</span>
            <span>{required}</span>
          </div>

          {/* Pace & projection */}
          {!done && pace !== null && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Weekly pace</p>
                </div>
                <p className="text-lg font-bold text-slate-800">{pace} <span className="text-xs font-normal text-slate-400">days/week</span></p>
              </div>
              {estimatedCompletion && (
                <div className={clsx('border rounded-xl p-3', atRisk ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100')}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CalendarDays className={clsx('w-3.5 h-3.5', atRisk ? 'text-rose-500' : 'text-violet-500')} />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Est. completion</p>
                  </div>
                  <p className={clsx('text-sm font-bold', atRisk ? 'text-rose-700' : 'text-slate-800')}>{fmtDate(estimatedCompletion)}</p>
                  {atRisk && <p className="text-[10px] text-rose-600 mt-0.5">Before visa expiry!</p>}
                </div>
              )}
              {visaDaysLeft !== null && !done && (
                <div className="bg-white border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Visa days left</p>
                  </div>
                  <p className="text-lg font-bold text-slate-800">{visaDaysLeft}</p>
                </div>
              )}
            </div>
          )}

          {done && (
            <div className="mt-4 bg-emerald-100 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
              <p className="font-semibold mb-1">You have completed the required days!</p>
              <p>Keep your payslips, employer declaration (Form 1263), and contracts ready before lodging your visa extension application.</p>
            </div>
          )}
        </div>

        {/* ── What qualifies? ────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800">What work qualifies? What states count?</span>
            </div>
            {showInfo ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showInfo && (
            <div className="px-5 pb-5 border-t border-slate-100 space-y-4 pt-4">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2.5">Approved Work Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WORK_TYPES.map(({ value, icon: Icon, desc }) => (
                    <div key={value} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <Icon className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{value}</p>
                        <p className="text-[10px] text-slate-400 leading-snug">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2.5">
                  {year === '2nd' ? '2nd Year — Eligible Regions' : '3rd Year — Northern Australia Only'}
                </h3>
                {year === '2nd' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AU_STATES_FULL.filter((s) => s.abbr !== 'ACT').map((s) => (
                      <div key={s.abbr} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <MapPin className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{s.abbr} — {s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.note2nd}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(THIRD_YEAR_STATE_NOTES).map(([state, note]) => (
                      <div key={state} className={clsx('flex items-start gap-2 p-2.5 rounded-xl border', state === 'NT' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200')}>
                        <MapPin className={clsx('w-3 h-3 mt-0.5 shrink-0', state === 'NT' ? 'text-emerald-600' : 'text-amber-600')} />
                        <div>
                          <p className={clsx('text-xs font-semibold', state === 'NT' ? 'text-emerald-700' : 'text-amber-700')}>{state}</p>
                          <p className="text-[10px] text-slate-500">{note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                <div className="flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-0.5">Evidence you need to keep</p>
                    <ul className="space-y-0.5 text-[11px]">
                      <li>• Payslips or payment summaries for each employer</li>
                      <li>• Employer declaration (Form 1263 — employer must sign)</li>
                      <li>• Your tax file number declaration lodged with each employer</li>
                      <li>• Bank statements showing payments from the employer</li>
                    </ul>
                    <p className="mt-2 text-[10px] text-blue-500">Always verify current requirements at <strong>immi.homeaffairs.gov.au</strong> before applying.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Work entries ───────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-800">Work History</h2>
              {entries.length > 0 && (
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Entry
            </button>
          </div>

          {/* Add form */}
          {showForm && (
            <div className="p-5 border-b border-slate-100 bg-slate-50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label required>Employer / Farm Name</Label>
                  <input type="text" value={form.employer} onChange={(e) => setField('employer', e.target.value)}
                    placeholder="e.g. Sunny Farm, Bundaberg" className={inputCls(errors.employer)} />
                  {errors.employer && <p className="text-[10px] text-rose-500 mt-0.5">{errors.employer}</p>}
                </div>
                <div>
                  <Label required>State / Territory</Label>
                  <select value={form.state} onChange={(e) => setField('state', e.target.value)} className={inputCls(errors.state)}>
                    <option value="">Select</option>
                    {AU_STATES_FULL.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>)}
                  </select>
                  {errors.state && <p className="text-[10px] text-rose-500 mt-0.5">{errors.state}</p>}
                </div>
              </div>

              <div>
                <Label required>Work Type (WHV category)</Label>
                <select value={form.workType} onChange={(e) => setField('workType', e.target.value)} className={inputCls(errors.workType)}>
                  <option value="">Select work category</option>
                  {WORK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {form.workType && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {WORK_TYPES.find((t) => t.value === form.workType)?.desc}
                  </p>
                )}
                {errors.workType && <p className="text-[10px] text-rose-500 mt-0.5">{errors.workType}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label required>Start Date</Label>
                  <input type="date" value={form.startDate} onChange={(e) => setField('startDate', e.target.value)} className={inputCls(errors.startDate)} />
                  {errors.startDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.startDate}</p>}
                </div>
                <div>
                  <Label required>End Date</Label>
                  <input type="date" value={form.endDate} onChange={(e) => setField('endDate', e.target.value)} className={inputCls(errors.endDate)} />
                  {errors.endDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.endDate}</p>}
                </div>
              </div>

              {formDays > 0 && (
                <div className="flex items-center gap-2">
                  <span className={clsx('px-3 py-1 rounded-full text-xs font-bold', 'bg-emerald-100 text-emerald-700 border border-emerald-200')}>
                    +{formDays} days
                  </span>
                  <span className="text-[11px] text-slate-400">
                    → total: {totalDays + formDays} / {required} days
                    {totalDays + formDays >= required && ' ✓ eligible!'}
                  </span>
                </div>
              )}

              {/* 3rd year region warning */}
              {year === '3rd' && form.state && !['NT'].includes(form.state) && (
                <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    {THIRD_YEAR_STATE_NOTES[form.state] ?? `${form.state} may not fully qualify for 3rd year. Verify the specific area at immi.homeaffairs.gov.au.`}
                  </span>
                </div>
              )}

              <div>
                <Label>Notes (optional)</Label>
                <input type="text" value={form.notes} onChange={(e) => setField('notes', e.target.value)}
                  placeholder="e.g. Employer ABN, address, payslip reference..." className={inputCls()} />
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={addEntry}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors">
                  Save Entry
                </button>
                <button onClick={() => { setShowForm(false); setErrors({}); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Entry list */}
          {entries.length === 0 && !showForm ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <CalendarDays className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-400 mb-1">No entries yet</p>
              <p className="text-xs text-slate-400">Add your first work period to start tracking.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {[...entries].sort((a, b) => b.startDate.localeCompare(a.startDate)).map((e) => {
                const days = daysBetween(e.startDate, e.endDate);
                const CatIcon = CATEGORY_ICONS[e.workType] ?? Briefcase;
                const catColor = CATEGORY_COLORS[e.workType] ?? 'bg-slate-100 text-slate-600';
                return (
                  <div key={e.id} className="flex items-start gap-3 px-5 py-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-sm font-black text-emerald-600">{days}</span>
                      <span className="text-[9px] text-emerald-500 font-semibold">days</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{e.employer}</p>
                      <div className="flex items-center flex-wrap gap-2 mt-1">
                        <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${catColor}`}>
                          <CatIcon className="w-2.5 h-2.5" />
                          {e.workType}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                          <MapPin className="w-2.5 h-2.5" />{e.state}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {fmtDate(e.startDate)} → {fmtDate(e.endDate)}
                      </p>
                      {e.notes && (
                        <p className="text-[10px] text-slate-400 mt-0.5 italic truncate">{e.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeEntry(e.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors shrink-0 mt-0.5"
                      title="Remove entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Breakdown by work type ─────────────────────────────────────── */}
        {byType.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-bold text-slate-800">Days by Work Category</h2>
            </div>
            <div className="space-y-3">
              {byType.map(([type, days]) => {
                const pctBar = Math.min(100, Math.round((days / Math.max(totalDays, 1)) * 100));
                const CatIcon = CATEGORY_ICONS[type] ?? Briefcase;
                const catColor = CATEGORY_COLORS[type] ?? 'bg-slate-100 text-slate-600';
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${catColor}`}>
                        <CatIcon className="w-2.5 h-2.5" />
                        {type}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{days}d</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pctBar}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── WHV-eligible jobs ──────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">WHV-Eligible Jobs</h2>
              <p className="text-xs text-slate-400 mt-0.5">All jobs below count toward your 88 or 179 day requirement.</p>
            </div>
            <div className="flex gap-1.5">
              {(['all', '2nd', '3rd'] as const).map((f) => (
                <button key={f} onClick={() => setJobFilter(f)}
                  className={clsx('px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors', {
                    'bg-emerald-600 text-white border-emerald-600': jobFilter === f,
                    'bg-white text-slate-600 border-slate-200 hover:border-emerald-300': jobFilter !== f,
                  })}>
                  {f === 'all' ? 'All' : `${f} Year`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whvJobs.map((job) => <WHVJobCard key={job.id} job={job} />)}
          </div>

          <div className="mt-4 text-center">
            <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-800 font-semibold transition-colors">
              Browse all jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center pb-2">
          Data is saved locally on your device only. Always keep official payslips, Form 1263, and employer records as evidence for your visa application.
        </p>
      </div>
    </main>
  );
}
