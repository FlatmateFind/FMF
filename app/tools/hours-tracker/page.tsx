'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, PlusCircle, Trash2, AlertTriangle, CheckCircle2, Info, Clock } from 'lucide-react';
import SectionTabs from '@/components/SectionTabs';

const SECTION_TABS = [
  { label: 'Tools Home', href: '/tools' },
  { label: 'Compatibility Quiz', href: '/tools/compatibility-quiz' },
  { label: 'Tax Calculator', href: '/tools/tax-calculator' },
  { label: 'WHV Tracker', href: '/tools/whv-tracker' },
  { label: 'Hours Tracker', href: '/tools/hours-tracker' },
  { label: 'ABN & TFN', href: '/tools/abn-tfn' },
  { label: 'Visa Pathways', href: '/tools/visa-pathways' },
];
import clsx from 'clsx';

const STORAGE_KEY = 'flatmatefind_hours_tracker';

interface WorkEntry {
  id: string;
  employer: string;
  date: string;
  hours: number;
}

// A fortnight starts from a fixed anchor Monday; group entries into 14-day blocks
const ANCHOR = new Date('2024-01-01'); // Monday — any fixed Monday works

function getFortnight(dateStr: string): string {
  const d = new Date(dateStr);
  const diff = Math.floor((d.getTime() - ANCHOR.getTime()) / (86400000 * 14));
  const start = new Date(ANCHOR.getTime() + diff * 14 * 86400000);
  const end = new Date(start.getTime() + 13 * 86400000);
  return `${start.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function getFortnightKey(dateStr: string): number {
  const d = new Date(dateStr);
  return Math.floor((d.getTime() - ANCHOR.getTime()) / (86400000 * 14));
}

export default function HoursTrackerPage() {
  const [limit, setLimit] = useState(40);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [form, setForm] = useState({ employer: '', date: '', hours: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [showForm, setShowForm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.limit) setLimit(data.limit);
        if (data.entries) setEntries(data.entries);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ limit, entries }));
  }, [limit, entries, loaded]);

  // Group entries by fortnight
  const fortnights = useMemo(() => {
    const groups: Record<number, { label: string; entries: WorkEntry[]; total: number }> = {};
    for (const e of entries) {
      const key = getFortnightKey(e.date);
      if (!groups[key]) groups[key] = { label: getFortnight(e.date), entries: [], total: 0 };
      groups[key].entries.push(e);
      groups[key].total += e.hours;
    }
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([, v]) => v);
  }, [entries]);

  // Current fortnight total
  const todayKey = getFortnightKey(new Date().toISOString().split('T')[0]);
  const currentFnTotal = entries
    .filter((e) => getFortnightKey(e.date) === todayKey)
    .reduce((s, e) => s + e.hours, 0);

  const currentPct = Math.min(100, Math.round((currentFnTotal / limit) * 100));
  const isOver = currentFnTotal > limit;
  const isWarning = currentFnTotal >= limit * 0.8 && !isOver;

  function setField(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  }

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.employer.trim()) e.employer = 'Required';
    if (!form.date) e.date = 'Required';
    const h = parseFloat(form.hours);
    if (!form.hours || isNaN(h) || h <= 0 || h > 24) e.hours = 'Enter valid hours (0–24)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addEntry() {
    if (!validate()) return;
    setEntries((e) => [...e, { id: Date.now().toString(), employer: form.employer, date: form.date, hours: parseFloat(form.hours) }]);
    setForm({ employer: '', date: '', hours: '' });
    setShowForm(false);
  }

  function removeEntry(id: string) {
    setEntries((e) => e.filter((x) => x.id !== id));
  }

  if (!loaded) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <SectionTabs tabs={SECTION_TABS} className="px-4 pt-4 max-w-4xl mx-auto" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Boxed hero */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white px-6 py-8">
          <Link href="/tools" className="flex items-center gap-1.5 text-blue-300 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Tools
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Work Hours Tracker</h1>
              <p className="text-blue-200 text-sm">Track your work hours by fortnight. Set your own limit based on your visa conditions.</p>
            </div>
          </div>
        </div>

        {/* Limit setting */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Fortnightly Hour Limit</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {[20, 40, 48, 60].map((h) => (
              <button key={h} onClick={() => setLimit(h)}
                className={clsx('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all', {
                  'bg-blue-600 border-blue-600 text-white': limit === h,
                  'bg-white border-slate-200 text-slate-600 hover:border-blue-300': limit !== h,
                })}>
                {h} hrs/fn
              </button>
            ))}
            <input type="number" min={1} max={168} value={limit}
              onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 px-3 py-1.5 border border-slate-200 rounded-full text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Student visa (500) work restrictions were removed from 1 July 2023. Other visa types may have different conditions — check your visa grant notice.</span>
          </div>
        </div>

        {/* Current fortnight summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Current Fortnight</h2>
          <div className="flex items-end gap-4 mb-3">
            <div>
              <p className="text-4xl font-bold text-slate-900">{currentFnTotal.toFixed(1)}</p>
              <p className="text-xs text-slate-400">hours worked</p>
            </div>
            <div className="text-slate-300 text-2xl">/</div>
            <div>
              <p className="text-2xl font-semibold text-slate-500">{limit}</p>
              <p className="text-xs text-slate-400">hour limit</p>
            </div>
            <div className="ml-auto">
              {isOver && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  <AlertTriangle className="w-3 h-3" /> Over limit
                </span>
              )}
              {isWarning && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> Approaching
                </span>
              )}
              {!isOver && !isWarning && currentFnTotal > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  <CheckCircle2 className="w-3 h-3" /> On track
                </span>
              )}
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all duration-500', {
                'bg-rose-500': isOver,
                'bg-amber-400': isWarning,
                'bg-teal-500': !isOver && !isWarning,
              })}
              style={{ width: `${currentPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{currentPct}% of limit — {Math.max(0, limit - currentFnTotal).toFixed(1)} hrs remaining</p>
        </div>

        {/* Add entry + log */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Work Log</h2>
            <button onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              <PlusCircle className="w-3.5 h-3.5" /> Add Entry
            </button>
          </div>

          {showForm && (
            <div className="p-5 border-b border-slate-100 bg-slate-50 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Employer *</label>
                  <input type="text" value={form.employer} onChange={(e) => setField('employer', e.target.value)}
                    placeholder="e.g. Woolworths Chadstone" className={inputCls(errors.employer)} />
                  {errors.employer && <p className="text-[10px] text-rose-500 mt-0.5">{errors.employer}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Hours *</label>
                  <input type="number" min={0.5} max={24} step={0.5} value={form.hours} onChange={(e) => setField('hours', e.target.value)}
                    placeholder="8" className={inputCls(errors.hours)} />
                  {errors.hours && <p className="text-[10px] text-rose-500 mt-0.5">{errors.hours}</p>}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Date *</label>
                <input type="date" value={form.date} onChange={(e) => setField('date', e.target.value)}
                  className={inputCls(errors.date)} />
                {errors.date && <p className="text-[10px] text-rose-500 mt-0.5">{errors.date}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={addEntry}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors">
                  Add
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {fortnights.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-400">No entries yet. Add your first shift above.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fortnights.map((fn) => {
                const over = fn.total > limit;
                const warn = fn.total >= limit * 0.8 && !over;
                return (
                  <div key={fn.label}>
                    <div className={clsx('flex items-center justify-between px-5 py-2.5 text-xs font-bold', {
                      'bg-rose-50 text-rose-700': over,
                      'bg-amber-50 text-amber-700': warn,
                      'bg-slate-50 text-slate-500': !over && !warn,
                    })}>
                      <span>{fn.label}</span>
                      <span>{fn.total.toFixed(1)} / {limit} hrs {over ? '⚠️ Over' : ''}</span>
                    </div>
                    {fn.entries
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((e) => (
                      <div key={e.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50">
                        <div className="text-xs text-slate-400 w-20 shrink-0">{e.date}</div>
                        <div className="flex-1 text-xs text-slate-700 truncate">{e.employer}</div>
                        <div className="text-xs font-semibold text-slate-800 w-14 text-right shrink-0">{e.hours}h</div>
                        <button onClick={() => removeEntry(e.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          Data saved locally on your device. Always keep your own payslips as official records.
        </p>
      </div>
    </main>
  );
}

function inputCls(err?: string) {
  return `w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 ${
    err ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-200 focus:border-blue-400'
  }`;
}
