'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator, ChevronLeft, ChevronDown, ChevronUp, Info, AlertCircle,
  TrendingDown, TrendingUp, DollarSign, ReceiptText, Minus,
} from 'lucide-react';
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

// ─── Types ───────────────────────────────────────────────────────────────────

type VisaType =
  | 'resident'
  | 'whm'
  | 'student'
  | 'graduate485'
  | 'skilled482'
  | 'nonresident';

interface VisaOption {
  id: VisaType;
  label: string;
  sub: string;
  taxTreatment: 'resident' | 'whm' | 'nonresident';
  medicareDefault: boolean;
}

// ─── Visa definitions ─────────────────────────────────────────────────────────

const VISA_OPTIONS: VisaOption[] = [
  {
    id: 'resident',
    label: 'Australian Citizen / PR',
    sub: 'Permanent residents and citizens',
    taxTreatment: 'resident',
    medicareDefault: true,
  },
  {
    id: 'whm',
    label: 'Working Holiday (417 / 462)',
    sub: 'Backpacker tax applies',
    taxTreatment: 'whm',
    medicareDefault: false,
  },
  {
    id: 'student',
    label: 'Student Visa (500)',
    sub: 'Treated as resident if in AU > 6 months',
    taxTreatment: 'resident',
    medicareDefault: false,
  },
  {
    id: 'graduate485',
    label: 'Temporary Graduate (485)',
    sub: 'Usually treated as resident',
    taxTreatment: 'resident',
    medicareDefault: true,
  },
  {
    id: 'skilled482',
    label: 'Skilled Worker (482 / TSS)',
    sub: 'Treated as resident for tax',
    taxTreatment: 'resident',
    medicareDefault: true,
  },
  {
    id: 'nonresident',
    label: 'Other Temporary Visa',
    sub: 'Non-resident tax rates apply',
    taxTreatment: 'nonresident',
    medicareDefault: false,
  },
];

const FINANCIAL_YEARS = [
  { label: '2024–25', value: '2024-25' },
  { label: '2023–24', value: '2023-24' },
  { label: '2022–23', value: '2022-23' },
];

// ─── Tax calculation engine ───────────────────────────────────────────────────

function calcResidentTax(income: number): number {
  if (income <= 18200) return 0;
  if (income <= 45000) return (income - 18200) * 0.19;
  if (income <= 120000) return 5092 + (income - 45000) * 0.325;
  if (income <= 180000) return 29467 + (income - 120000) * 0.37;
  return 51667 + (income - 180000) * 0.45;
}

function calcWhmTax(income: number): number {
  if (income <= 45000) return income * 0.15;
  if (income <= 120000) return 6750 + (income - 45000) * 0.325;
  if (income <= 180000) return 31125 + (income - 120000) * 0.37;
  return 53325 + (income - 180000) * 0.45;
}

function calcNonResidentTax(income: number): number {
  if (income <= 120000) return income * 0.325;
  if (income <= 180000) return 39000 + (income - 120000) * 0.37;
  return 61200 + (income - 180000) * 0.45;
}

function calcLITO(income: number): number {
  if (income <= 37500) return 700;
  if (income <= 45000) return 700 - (income - 37500) * 0.05;
  if (income <= 66667) return 325 - (income - 45000) * 0.015;
  return 0;
}

function calcLMITO(income: number, year: string): number {
  // LMITO was removed from 2022-23 onward (last year was 2021-22)
  if (year !== '2021-22') return 0;
  if (income <= 37000) return 255;
  if (income <= 48000) return 255 + (income - 37000) * (1080 / 11000);
  if (income <= 90000) return 1080;
  if (income <= 126000) return 1080 - (income - 90000) * (1080 / 36000);
  return 0;
}

interface TaxResult {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  grossTax: number;
  lito: number;
  medicare: number;
  netTax: number;
  withheld: number;
  refund: number; // positive = refund, negative = owing
  effectiveRate: number;
  marginalRate: number;
}

function calculateTax(
  grossIncome: number,
  withheld: number,
  deductions: number,
  treatment: 'resident' | 'whm' | 'nonresident',
  medicare: boolean,
  year: string,
): TaxResult {
  const taxableIncome = Math.max(0, grossIncome - deductions);

  let grossTax = 0;
  if (treatment === 'resident') grossTax = calcResidentTax(taxableIncome);
  else if (treatment === 'whm') grossTax = calcWhmTax(taxableIncome);
  else grossTax = calcNonResidentTax(taxableIncome);

  const lito = treatment === 'resident' ? calcLITO(taxableIncome) : 0;
  const medicareAmt = medicare ? taxableIncome * 0.02 : 0;
  const netTax = Math.max(0, grossTax - lito + medicareAmt);
  const refund = withheld - netTax;
  const effectiveRate = taxableIncome > 0 ? (netTax / taxableIncome) * 100 : 0;

  let marginalRate = 0;
  if (treatment === 'resident') {
    if (taxableIncome <= 18200) marginalRate = 0;
    else if (taxableIncome <= 45000) marginalRate = 19;
    else if (taxableIncome <= 120000) marginalRate = 32.5;
    else if (taxableIncome <= 180000) marginalRate = 37;
    else marginalRate = 45;
  } else if (treatment === 'whm') {
    if (taxableIncome <= 45000) marginalRate = 15;
    else if (taxableIncome <= 120000) marginalRate = 32.5;
    else if (taxableIncome <= 180000) marginalRate = 37;
    else marginalRate = 45;
  } else {
    if (taxableIncome <= 120000) marginalRate = 32.5;
    else if (taxableIncome <= 180000) marginalRate = 37;
    else marginalRate = 45;
  }

  return {
    grossIncome,
    totalDeductions: deductions,
    taxableIncome,
    grossTax,
    lito,
    medicare: medicareAmt,
    netTax,
    withheld,
    refund,
    effectiveRate,
    marginalRate,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtMoney(n: number) {
  return `$${fmt(Math.abs(n))}`;
}

// ─── Deduction row ────────────────────────────────────────────────────────────

interface Deduction {
  id: string;
  label: string;
  amount: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TaxCalculatorPage() {
  const [visaId, setVisaId] = useState<VisaType>('resident');
  const [year, setYear] = useState('2024-25');
  const [incomeMode, setIncomeMode] = useState<'annual' | 'weekly'>('annual');
  const [incomeAnnual, setIncomeAnnual] = useState('');
  const [incomeWeekly, setIncomeWeekly] = useState('');
  const [weeks, setWeeks] = useState('52');
  const [withheld, setWithheld] = useState('');
  const [medicare, setMedicare] = useState(true);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [showDeductions, setShowDeductions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const visa = VISA_OPTIONS.find((v) => v.id === visaId)!;

  // sync medicare default when visa changes
  function selectVisa(id: VisaType) {
    const v = VISA_OPTIONS.find((x) => x.id === id)!;
    setVisaId(id);
    setMedicare(v.medicareDefault);
  }

  // Compute gross income
  const grossIncome = useMemo(() => {
    if (incomeMode === 'annual') return parseFloat(incomeAnnual) || 0;
    const wkly = parseFloat(incomeWeekly) || 0;
    const wks = parseFloat(weeks) || 0;
    return wkly * wks;
  }, [incomeMode, incomeAnnual, incomeWeekly, weeks]);

  const totalDeductions = useMemo(() => {
    return deductions.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
  }, [deductions]);

  const withheldNum = parseFloat(withheld) || 0;

  const result = useMemo<TaxResult | null>(() => {
    if (grossIncome <= 0) return null;
    return calculateTax(grossIncome, withheldNum, totalDeductions, visa.taxTreatment, medicare, year);
  }, [grossIncome, withheldNum, totalDeductions, visa.taxTreatment, medicare, year]);

  function addDeduction() {
    setDeductions((d) => [...d, { id: Math.random().toString(36).slice(2), label: '', amount: '' }]);
  }

  function updateDeduction(id: string, field: 'label' | 'amount', val: string) {
    setDeductions((d) => d.map((x) => x.id === id ? { ...x, [field]: val } : x));
  }

  function removeDeduction(id: string) {
    setDeductions((d) => d.filter((x) => x.id !== id));
  }

  const isRefund = result && result.refund >= 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <SectionTabs tabs={SECTION_TABS} className="px-4 pt-4 max-w-4xl mx-auto" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Boxed hero */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-6 py-8">
          <Link href="/tools" className="flex items-center gap-1.5 text-indigo-300 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Tools
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Tax Refund Calculator</h1>
              <p className="text-indigo-200 text-sm">
                Estimate your tax refund or balance for all visa types — Working Holiday, Student, Skilled, and more.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <span>
            <strong>Estimate only.</strong> This calculator provides a general estimate based on ATO tax rates and is not financial or tax advice.
            For complex situations, consult a registered tax agent. Tax residency status is determined by the ATO, not visa type alone.
          </span>
        </div>

        {/* Card: Financial Year + Visa */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Step 1 — Your Situation</h2>

          {/* Financial year */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Financial Year</label>
            <div className="flex gap-2">
              {FINANCIAL_YEARS.map((fy) => (
                <button
                  key={fy.value}
                  onClick={() => setYear(fy.value)}
                  className={clsx(
                    'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all',
                    year === fy.value
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
                  )}
                >
                  {fy.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visa selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Visa / Residency Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VISA_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVisa(v.id)}
                  className={clsx(
                    'flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                    visaId === v.id
                      ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                      : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                  )}
                >
                  <div className={clsx(
                    'w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center',
                    visaId === v.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  )}>
                    {visaId === v.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{v.label}</p>
                    <p className="text-[11px] text-slate-500">{v.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tax treatment pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Tax treatment:</span>
            <span className={clsx('px-2.5 py-0.5 rounded-full font-semibold', {
              'bg-teal-50 text-teal-700 border border-teal-200': visa.taxTreatment === 'resident',
              'bg-amber-50 text-amber-700 border border-amber-200': visa.taxTreatment === 'whm',
              'bg-red-50 text-red-700 border border-red-200': visa.taxTreatment === 'nonresident',
            })}>
              {visa.taxTreatment === 'resident' && 'Resident rates + LITO'}
              {visa.taxTreatment === 'whm' && 'Working Holiday Maker (WHM) rates'}
              {visa.taxTreatment === 'nonresident' && 'Non-resident rates'}
            </span>
          </div>

          {/* Medicare levy */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Medicare Levy (2%)</label>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  onClick={() => setMedicare(val)}
                  className={clsx(
                    'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all',
                    medicare === val
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                  )}
                >
                  {val ? 'Apply (typical)' : 'Exempt'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              WHM, non-residents, and many temporary visa holders are Medicare exempt. Some student visa holders may be exempt under a reciprocal health agreement.
            </p>
          </div>
        </div>

        {/* Card: Income */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Step 2 — Income</h2>

          {/* Income mode toggle */}
          <div className="flex gap-2">
            {(['annual', 'weekly'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setIncomeMode(m)}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize',
                  incomeMode === m
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {incomeMode === 'annual' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Annual Gross Income (AUD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  value={incomeAnnual}
                  onChange={(e) => setIncomeAnnual(e.target.value)}
                  placeholder="e.g. 55000"
                  className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Weekly Gross Pay (AUD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    value={incomeWeekly}
                    onChange={(e) => setIncomeWeekly(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Weeks Worked</label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={weeks}
                  onChange={(e) => setWeeks(e.target.value)}
                  placeholder="52"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                />
              </div>
            </div>
          )}

          {incomeMode === 'weekly' && grossIncome > 0 && (
            <p className="text-xs text-slate-500">
              Annual equivalent: <strong className="text-slate-700">${fmt(grossIncome)}</strong>
            </p>
          )}

          {/* Tax withheld */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Tax Withheld (from your payment summaries / PAYG)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
              <input
                type="number"
                min={0}
                value={withheld}
                onChange={(e) => setWithheld(e.target.value)}
                placeholder="e.g. 8000"
                className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Find this on your income statement in myGov / ATO online, or from your employer's payment summary.
            </p>
          </div>
        </div>

        {/* Card: Deductions (optional) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowDeductions((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
          >
            <div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest text-left">
                Step 3 — Deductions
                <span className="normal-case font-normal text-slate-400 ml-1">(optional)</span>
              </h2>
              {totalDeductions > 0 && (
                <p className="text-xs text-indigo-600 font-medium mt-0.5 text-left">
                  Total: ${fmt(totalDeductions)}
                </p>
              )}
            </div>
            {showDeductions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showDeductions && (
            <div className="px-5 pb-5 space-y-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 pt-3">
                Common deductions: work-related expenses, union fees, self-education, charitable donations, tax agent fees.
                You must have records to support all claims.
              </p>

              {deductions.map((d) => (
                <div key={d.id} className="flex gap-2">
                  <input
                    type="text"
                    value={d.label}
                    onChange={(e) => updateDeduction(d.id, 'label', e.target.value)}
                    placeholder="Description (e.g. Work uniform)"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <div className="relative w-28 shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      min={0}
                      value={d.amount}
                      onChange={(e) => updateDeduction(d.id, 'amount', e.target.value)}
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <button
                    onClick={() => removeDeduction(d.id)}
                    className="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors shrink-0 self-center"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button
                onClick={addDeduction}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
              >
                + Add deduction
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {result ? (
          <div className="space-y-4">
            {/* Big refund / owing banner */}
            <div className={clsx(
              'rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4',
              isRefund
                ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                : 'bg-gradient-to-br from-rose-500 to-rose-600 text-white'
            )}>
              <div className={clsx(
                'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0',
                isRefund ? 'bg-white/20' : 'bg-white/20'
              )}>
                {isRefund
                  ? <TrendingDown className="w-7 h-7" />
                  : <TrendingUp className="w-7 h-7" />
                }
              </div>
              <div>
                <p className="text-sm font-semibold opacity-90 mb-1">
                  {isRefund ? 'Estimated Tax Refund' : 'Estimated Tax Owing'}
                </p>
                <p className="text-4xl font-bold tracking-tight">
                  {fmtMoney(result.refund)}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  {isRefund
                    ? `You paid $${fmt(result.withheld)} but owe $${fmt(result.netTax)} — the ATO would refund the difference.`
                    : `You paid $${fmt(result.withheld)} but owe $${fmt(result.netTax)} — you'll need to pay the difference.`
                  }
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Tax Breakdown</h3>
              <div className="space-y-0">
                <Row icon={<DollarSign className="w-3.5 h-3.5" />} label="Gross Income" value={`$${fmt(result.grossIncome)}`} />
                {result.totalDeductions > 0 && (
                  <Row icon={<Minus className="w-3.5 h-3.5" />} label="Total Deductions" value={`− $${fmt(result.totalDeductions)}`} dim />
                )}
                {result.totalDeductions > 0 && (
                  <Row icon={<DollarSign className="w-3.5 h-3.5" />} label="Taxable Income" value={`$${fmt(result.taxableIncome)}`} bold />
                )}
                <div className="border-t border-slate-100 my-2" />
                <Row icon={<ReceiptText className="w-3.5 h-3.5" />} label="Gross Tax" value={`$${fmt(result.grossTax)}`} />
                {result.lito > 0 && (
                  <Row icon={<Minus className="w-3.5 h-3.5" />} label="Low Income Tax Offset (LITO)" value={`− $${fmt(result.lito)}`} dim />
                )}
                {result.medicare > 0 && (
                  <Row icon={<ReceiptText className="w-3.5 h-3.5" />} label="Medicare Levy (2%)" value={`$${fmt(result.medicare)}`} />
                )}
                <Row icon={<ReceiptText className="w-3.5 h-3.5" />} label="Net Tax Payable" value={`$${fmt(result.netTax)}`} bold />
                <div className="border-t border-slate-100 my-2" />
                <Row icon={<DollarSign className="w-3.5 h-3.5" />} label="Tax Withheld (PAYG)" value={`$${fmt(result.withheld)}`} />
                <div className="border-t border-slate-100 my-2" />
                <Row
                  icon={isRefund ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  label={isRefund ? 'Refund' : 'Tax Owing'}
                  value={`${isRefund ? '' : ''}${fmtMoney(result.refund)}`}
                  bold
                  highlight={isRefund ? 'teal' : 'rose'}
                />
              </div>

              {/* Rates */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-slate-500 mb-1">Effective Rate</p>
                  <p className="text-xl font-bold text-slate-800">{result.effectiveRate.toFixed(1)}%</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-slate-500 mb-1">Marginal Rate</p>
                  <p className="text-xl font-bold text-slate-800">{result.marginalRate}%</p>
                </div>
              </div>
            </div>

            {/* Rate table info toggle */}
            <button
              onClick={() => setShowInfo((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              {showInfo ? 'Hide' : 'Show'} {visa.taxTreatment === 'whm' ? 'WHM' : visa.taxTreatment === 'nonresident' ? 'non-resident' : 'resident'} rate table
              {showInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showInfo && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                  {year} {visa.taxTreatment === 'whm' ? 'Working Holiday Maker' : visa.taxTreatment === 'nonresident' ? 'Non-Resident' : 'Resident'} Tax Rates
                </h3>
                {visa.taxTreatment === 'resident' && (
                  <RateTable rows={[
                    ['$0 – $18,200', 'Nil', '0%'],
                    ['$18,201 – $45,000', '19c for each $1 over $18,200', '19%'],
                    ['$45,001 – $120,000', '$5,092 + 32.5c per $1 over $45,000', '32.5%'],
                    ['$120,001 – $180,000', '$29,467 + 37c per $1 over $120,000', '37%'],
                    ['$180,001+', '$51,667 + 45c per $1 over $180,000', '45%'],
                  ]} />
                )}
                {visa.taxTreatment === 'whm' && (
                  <RateTable rows={[
                    ['$0 – $45,000', '15c for each $1', '15%'],
                    ['$45,001 – $120,000', '$6,750 + 32.5c per $1 over $45,000', '32.5%'],
                    ['$120,001 – $180,000', '$31,125 + 37c per $1 over $120,000', '37%'],
                    ['$180,001+', '$53,325 + 45c per $1 over $180,000', '45%'],
                  ]} />
                )}
                {visa.taxTreatment === 'nonresident' && (
                  <RateTable rows={[
                    ['$0 – $120,000', '32.5c for each $1', '32.5%'],
                    ['$120,001 – $180,000', '$39,000 + 37c per $1 over $120,000', '37%'],
                    ['$180,001+', '$61,200 + 45c per $1 over $180,000', '45%'],
                  ]} />
                )}
                {visa.taxTreatment === 'resident' && (
                  <p className="text-[11px] text-slate-400 mt-3">
                    LITO reduces your tax by up to $700 (phased out above $37,500). Medicare levy of 2% applies separately.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : grossIncome > 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-sm text-slate-500 shadow-sm">
            Enter your tax withheld above to see your refund estimate.
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Enter your income above to get started</p>
            <p className="text-xs text-slate-400 mt-1">Select your visa type and fill in your income details</p>
          </div>
        )}

        {/* ATO link nudge */}
        <div className="flex items-start gap-2.5 p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
          <span>
            To lodge your actual tax return, visit{' '}
            <strong>myTax</strong> through{' '}
            <strong>myGov</strong> at{' '}
            <span className="font-mono">my.gov.au</span>{' '}
            or use a registered tax agent. Lodgement is usually open from 1 July each year.
          </span>
        </div>

      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Row({
  icon, label, value, bold, dim, highlight,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  bold?: boolean;
  dim?: boolean;
  highlight?: 'teal' | 'rose';
}) {
  return (
    <div className={clsx('flex items-center justify-between py-2', {
      'text-slate-400': dim,
      'text-slate-700': !dim && !bold,
    })}>
      <div className="flex items-center gap-2">
        <span className={clsx('shrink-0', dim ? 'text-slate-300' : 'text-slate-400')}>{icon}</span>
        <span className={clsx('text-xs', bold ? 'font-bold text-slate-800' : '')}>{label}</span>
      </div>
      <span className={clsx('text-sm font-semibold tabular-nums', {
        'text-slate-800': bold && !highlight,
        'text-teal-600': highlight === 'teal',
        'text-rose-600': highlight === 'rose',
        'text-slate-500': dim,
      })}>
        {value}
      </span>
    </div>
  );
}

function RateTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-1.5 pr-4 text-slate-500 font-semibold">Taxable Income</th>
            <th className="text-left py-1.5 pr-4 text-slate-500 font-semibold">Tax on this Income</th>
            <th className="text-right py-1.5 text-slate-500 font-semibold">Rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([range, formula, rate]) => (
            <tr key={range} className="border-b border-slate-50">
              <td className="py-1.5 pr-4 text-slate-700 font-medium whitespace-nowrap">{range}</td>
              <td className="py-1.5 pr-4 text-slate-500">{formula}</td>
              <td className="py-1.5 text-right text-slate-700 font-semibold whitespace-nowrap">{rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
