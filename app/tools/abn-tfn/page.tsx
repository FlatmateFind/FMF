'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, Info, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';

// Resident tax (same as tax calculator)
function calcTax(income: number): number {
  if (income <= 18200) return 0;
  if (income <= 45000) return (income - 18200) * 0.19;
  if (income <= 120000) return 5092 + (income - 45000) * 0.325;
  if (income <= 180000) return 29467 + (income - 120000) * 0.37;
  return 51667 + (income - 180000) * 0.45;
}
function calcLITO(income: number): number {
  if (income <= 37500) return 700;
  if (income <= 45000) return 700 - (income - 37500) * 0.05;
  if (income <= 66667) return 325 - (income - 45000) * 0.015;
  return 0;
}

const SUPER_RATE = 0.115; // 11.5% FY2024-25
const MEDICARE = 0.02;
const GST_THRESHOLD = 75000;

function fmt(n: number) {
  return `$${Math.round(Math.abs(n)).toLocaleString()}`;
}

type InputMode = 'annual' | 'hourly';

const PROS_CONS = {
  tfn: {
    pros: ['Tax withheld — no surprise tax bills', 'Super paid by employer (11.5%)', 'Entitled to leave (annual, sick, long service)', 'Workers compensation coverage', 'Easier tax return'],
    cons: ['Lower hourly rate vs ABN equivalent', 'Less flexibility to deduct expenses', 'Subject to payroll obligations'],
  },
  abn: {
    pros: ['Higher hourly/daily rate (reflects no benefits)', 'Deduct business expenses (phone, equipment, etc.)', 'Invoice multiple clients', 'Flexibility — choose your engagements'],
    cons: ['Must save for tax (no withholding)', 'No super paid by engager (must self-fund)', 'No leave entitlements', 'Quarterly BAS lodgement (if > $75k)', 'Sham contracting risk if arrangement is actually employment'],
  },
};

export default function ABNvsTFNPage() {
  const [mode, setMode] = useState<InputMode>('annual');
  const [income, setIncome] = useState('');
  const [rate, setRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('38');
  const [weeksPerYear, setWeeksPerYear] = useState('48');

  const grossAnnual = useMemo(() => {
    if (mode === 'annual') return parseFloat(income) || 0;
    const r = parseFloat(rate) || 0;
    const h = parseFloat(hoursPerWeek) || 0;
    const w = parseFloat(weeksPerYear) || 0;
    return r * h * w;
  }, [mode, income, rate, hoursPerWeek, weeksPerYear]);

  const results = useMemo(() => {
    if (grossAnnual <= 0) return null;

    // — TFN / PAYG employee —
    const taxTFN = Math.max(0, calcTax(grossAnnual) - calcLITO(grossAnnual) + grossAnnual * MEDICARE);
    const superTFN = grossAnnual * SUPER_RATE; // employer pays on top
    const netTFN = grossAnnual - taxTFN;
    const totalCompTFN = grossAnnual + superTFN; // total cost to employer

    // — ABN contractor —
    // ABN rate is typically quoted without super obligation from engager
    // Assume same gross income, but contractor must self-fund super and pay own tax
    const taxABN = Math.max(0, calcTax(grossAnnual) - calcLITO(grossAnnual) + grossAnnual * MEDICARE);
    const superABNRecommended = grossAnnual * SUPER_RATE; // should put aside
    const gstApplies = grossAnnual >= GST_THRESHOLD;
    const setAsideForTax = taxABN + superABNRecommended;
    const netABN = grossAnnual - taxABN - superABNRecommended;
    // What you'd need to charge to match TFN take-home
    const requiredABNRate = totalCompTFN; // ABN quote to match total TFN package

    return { grossAnnual, taxTFN, superTFN, netTFN, taxABN, superABNRecommended, setAsideForTax, netABN, gstApplies, requiredABNRate };
  }, [grossAnnual]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Boxed hero */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white px-6 py-8">
          <Link href="/tools" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Tools
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">ABN vs TFN Calculator</h1>
          <p className="text-slate-400 text-sm">Compare take-home pay as an ABN contractor vs a TFN/PAYG employee in Australia.</p>
        </div>

        {/* Income input */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Income</h2>

          <div className="flex gap-2">
            {(['annual', 'hourly'] as InputMode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={clsx('px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize', {
                  'bg-slate-800 border-slate-800 text-white': mode === m,
                  'bg-white border-slate-200 text-slate-600 hover:border-slate-400': mode !== m,
                })}>
                {m}
              </button>
            ))}
          </div>

          {mode === 'annual' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Annual Gross Income (AUD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                <input type="number" min={0} value={income} onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g. 80000"
                  className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Hourly Rate</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input type="number" min={0} value={rate} onChange={(e) => setRate(e.target.value)}
                    placeholder="45" className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Hours / Week</label>
                <input type="number" min={1} max={80} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Weeks / Year</label>
                <input type="number" min={1} max={52} value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
              </div>
            </div>
          )}

          {grossAnnual > 0 && mode === 'hourly' && (
            <p className="text-xs text-slate-500">Annual equivalent: <strong className="text-slate-700">${grossAnnual.toLocaleString()}</strong></p>
          )}
        </div>

        {/* Results */}
        {results && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TFN */}
              <div className="bg-white border-2 border-teal-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-teal-700">TFN</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">PAYG Employee</p>
                    <p className="text-[11px] text-slate-400">Tax withheld, super included</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Row label="Gross Salary" value={fmt(results.grossAnnual)} />
                  <Row label="Income Tax + Medicare" value={`− ${fmt(results.taxTFN)}`} dim />
                  <div className="border-t border-slate-100 pt-2">
                    <Row label="Net Take-Home" value={fmt(results.netTFN)} bold highlight="teal" />
                  </div>
                  <div className="border-t border-slate-100 pt-2 space-y-1">
                    <Row label="Super (employer pays)" value={`+ ${fmt(results.superTFN)}`} note="on top of salary" />
                    <Row label="Total Package" value={fmt(results.grossAnnual + results.superTFN)} bold />
                  </div>
                </div>
              </div>

              {/* ABN */}
              <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-700">ABN</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Contractor / ABN</p>
                    <p className="text-[11px] text-slate-400">You manage tax + super</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Row label="Invoice Total (ex-GST)" value={fmt(results.grossAnnual)} />
                  <Row label="Income Tax + Medicare" value={`− ${fmt(results.taxABN)}`} dim note="set aside (not withheld)" />
                  <Row label="Super (self-funded)" value={`− ${fmt(results.superABNRecommended)}`} dim note="recommended" />
                  <div className="border-t border-slate-100 pt-2">
                    <Row label="Net Take-Home" value={fmt(results.netABN)} bold highlight="amber" />
                  </div>
                  <div className="border-t border-slate-100 pt-2">
                    <Row label="Must set aside" value={fmt(results.setAsideForTax)} note="tax + super" />
                  </div>
                </div>
              </div>
            </div>

            {/* Equivalence note */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-700">
              <p className="font-semibold mb-1">💡 To match a {fmt(results.grossAnnual)} salary package...</p>
              <p className="text-xs">
                As an ABN contractor you should charge at least{' '}
                <strong>{fmt(results.requiredABNRate)}/year</strong>{' '}
                (or {fmt(results.requiredABNRate / 52)}/week) to match the employer's total cost,
                because you cover your own super and have no paid leave.
              </p>
              {results.gstApplies && (
                <p className="text-xs mt-1.5 text-amber-700 font-medium">
                  ⚠️ Your income exceeds ${GST_THRESHOLD.toLocaleString()} — you must register for GST and add 10% to invoices.
                </p>
              )}
            </div>

            {/* Pros / Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['tfn', 'abn'] as const).map((type) => (
                <div key={type} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{type === 'tfn' ? 'TFN / Employee' : 'ABN / Contractor'}</h3>
                  <div className="space-y-1.5 mb-3">
                    {PROS_CONS[type].pros.map((p, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0 mt-0.5" />{p}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {PROS_CONS[type].cons.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                        <XCircle className="w-3 h-3 text-slate-300 shrink-0 mt-0.5" />{c}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!results && (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-400">
            Enter your income above to see the comparison.
          </div>
        )}

        <div className="flex items-start gap-2 p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Estimate only. Does not constitute financial or legal advice. Consult a registered tax agent or accountant for your specific situation.
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, bold, dim, highlight, note }: {
  label: string; value: string; bold?: boolean; dim?: boolean;
  highlight?: 'teal' | 'amber'; note?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <span className={clsx('text-xs', dim ? 'text-slate-400' : 'text-slate-600', bold && 'font-bold text-slate-800')}>{label}</span>
        {note && <span className="text-[10px] text-slate-400 ml-1">({note})</span>}
      </div>
      <span className={clsx('text-sm font-semibold tabular-nums', {
        'text-teal-600': highlight === 'teal',
        'text-amber-600': highlight === 'amber',
        'text-slate-800': bold && !highlight,
        'text-slate-400': dim,
        'text-slate-700': !bold && !dim && !highlight,
      })}>{value}</span>
    </div>
  );
}
