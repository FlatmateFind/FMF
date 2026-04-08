'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, PlusCircle, Trash2, CalendarDays, MapPin, CheckCircle2, Clock, Info } from 'lucide-react';
import clsx from 'clsx';

const STORAGE_KEY = 'flatmatefind_whv_tracker';

type WHVYear = '2nd' | '3rd';

interface WorkEntry {
  id: string;
  employer: string;
  state: string;
  workType: string;
  startDate: string;
  endDate: string;
}

const WORK_TYPES = [
  'Plant & animal cultivation',
  'Fishing & pearling',
  'Tree farming & felling',
  'Mining',
  'Construction (regional)',
  'Tourism & hospitality (regional)',
  'Bushfire / disaster recovery',
  'Other specified work',
];

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

const REQUIRED_DAYS: Record<WHVYear, number> = { '2nd': 88, '3rd': 179 };

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 0;
  return Math.floor((e.getTime() - s.getTime()) / 86400000) + 1;
}

function fmt(n: number) {
  return n.toLocaleString();
}

export default function WHVTrackerPage() {
  const [year, setYear] = useState<WHVYear>('2nd');
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employer: '', state: '', workType: '', startDate: '', endDate: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.year) setYear(data.year);
        if (data.entries) setEntries(data.entries);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ year, entries }));
  }, [year, entries, loaded]);

  const totalDays = useMemo(() =>
    entries.reduce((sum, e) => sum + daysBetween(e.startDate, e.endDate), 0), [entries]);

  const required = REQUIRED_DAYS[year];
  const remaining = Math.max(0, required - totalDays);
  const pct = Math.min(100, Math.round((totalDays / required) * 100));
  const done = totalDays >= required;

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
    if (form.startDate && form.endDate && form.endDate < form.startDate) e.endDate = 'End must be after start';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addEntry() {
    if (!validate()) return;
    setEntries((e) => [...e, { id: Date.now().toString(), ...form }]);
    setForm({ employer: '', state: '', workType: '', startDate: '', endDate: '' });
    setShowForm(false);
  }

  function removeEntry(id: string) {
    setEntries((e) => e.filter((x) => x.id !== id));
  }

  if (!loaded) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/tools" className="flex items-center gap-1.5 text-emerald-300 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Tools
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">WHV Days Tracker</h1>
          <p className="text-emerald-200 text-sm">Track your 88 or 179 regional work days for 2nd/3rd year Working Holiday Visa.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Year selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Which visa year are you tracking?</h2>
          <div className="grid grid-cols-2 gap-3">
            {(['2nd', '3rd'] as WHVYear[]).map((y) => (
              <button key={y} onClick={() => setYear(y)}
                className={clsx('p-4 rounded-xl border-2 text-left transition-all', {
                  'border-emerald-500 bg-emerald-50': year === y,
                  'border-slate-200 bg-white hover:border-emerald-200': year !== y,
                })}>
                <p className={clsx('text-sm font-bold', year === y ? 'text-emerald-700' : 'text-slate-800')}>
                  {y} Year WHV
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {REQUIRED_DAYS[y]} days of regional work required
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Progress</h2>
            {done && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Eligible!
              </span>
            )}
          </div>

          <div className="flex items-end gap-4 mb-3">
            <div>
              <p className="text-4xl font-bold text-slate-900">{fmt(totalDays)}</p>
              <p className="text-xs text-slate-400">days completed</p>
            </div>
            <div className="text-slate-300 text-2xl">/</div>
            <div>
              <p className="text-2xl font-semibold text-slate-500">{required}</p>
              <p className="text-xs text-slate-400">days required</p>
            </div>
            {!done && (
              <div className="ml-auto text-right">
                <p className="text-lg font-bold text-amber-600">{remaining}</p>
                <p className="text-xs text-slate-400">days to go</p>
              </div>
            )}
          </div>

          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all duration-500', done ? 'bg-emerald-500' : 'bg-amber-400')}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{pct}% complete</p>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
          <span>
            <strong>Eligible work</strong> must be in regional Australia in an approved category (farming, fishing, mining, construction in regional areas, etc.).
            Always verify eligibility on the official ATO/IMMI website before lodging your visa extension.
          </span>
        </div>

        {/* Work entries */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Work Entries</h2>
            <button onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">
              <PlusCircle className="w-3.5 h-3.5" />
              Add Entry
            </button>
          </div>

          {/* Add form */}
          {showForm && (
            <div className="p-5 border-b border-slate-100 bg-slate-50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Employer / Farm Name *</label>
                  <input type="text" value={form.employer} onChange={(e) => setField('employer', e.target.value)}
                    placeholder="e.g. Sunny Farm, QLD" className={inputCls(errors.employer)} />
                  {errors.employer && <p className="text-[10px] text-rose-500 mt-0.5">{errors.employer}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">State *</label>
                  <select value={form.state} onChange={(e) => setField('state', e.target.value)} className={inputCls(errors.state)}>
                    <option value="">Select</option>
                    {AU_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-[10px] text-rose-500 mt-0.5">{errors.state}</p>}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Work Type *</label>
                <select value={form.workType} onChange={(e) => setField('workType', e.target.value)} className={inputCls(errors.workType)}>
                  <option value="">Select work type</option>
                  {WORK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.workType && <p className="text-[10px] text-rose-500 mt-0.5">{errors.workType}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Start Date *</label>
                  <input type="date" value={form.startDate} onChange={(e) => setField('startDate', e.target.value)} className={inputCls(errors.startDate)} />
                  {errors.startDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">End Date *</label>
                  <input type="date" value={form.endDate} onChange={(e) => setField('endDate', e.target.value)} className={inputCls(errors.endDate)} />
                  {errors.endDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.endDate}</p>}
                </div>
              </div>
              {form.startDate && form.endDate && form.endDate >= form.startDate && (
                <p className="text-[11px] text-emerald-600 font-semibold">
                  = {daysBetween(form.startDate, form.endDate)} days
                </p>
              )}
              <div className="flex gap-2">
                <button onClick={addEntry}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors">
                  Add Entry
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Entry list */}
          {entries.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No entries yet. Add your first work period above.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {entries.map((e) => {
                const days = daysBetween(e.startDate, e.endDate);
                return (
                  <div key={e.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-emerald-600">{days}d</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{e.employer}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{e.state}</span>
                        <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{e.startDate} → {e.endDate}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{e.workType}</p>
                    </div>
                    <button onClick={() => removeEntry(e.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          Data saved locally on your device. Always keep your own payslips and contracts as official evidence.
        </p>
      </div>
    </main>
  );
}

function inputCls(err?: string) {
  return `w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 ${
    err ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-400'
  }`;
}
