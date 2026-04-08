'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AUSTRALIAN_STATES, POST_LANGUAGES } from '@/lib/types';
import { BusinessCategory } from '@/data/businesses';

const CATEGORIES: BusinessCategory[] = [
  'Café', 'Restaurant', 'Food & Bev', 'Retail', 'Service', 'Online', 'Franchise', 'Other',
];

interface FormData {
  name: string;
  category: BusinessCategory | '';
  state: string;
  suburb: string;
  askingPrice: string;
  weeklyRevenue: string;
  leaseMonthsRemaining: string;
  employees: string;
  established: string;
  reasonForSelling: string;
  description: string;
  contactEmail: string;
  contactName: string;
  postLanguage: string;
}

const EMPTY: FormData = {
  name: '', category: '', state: '', suburb: '',
  askingPrice: '', weeklyRevenue: '', leaseMonthsRemaining: '',
  employees: '', established: '', reasonForSelling: '', description: '',
  contactEmail: '', contactName: '', postLanguage: 'English',
};

export default function PostBusinessPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = 'Business name is required';
    if (!form.category) e.category = 'Please select a category';
    if (!form.state) e.state = 'Please select a state';
    if (!form.suburb.trim()) e.suburb = 'Suburb is required';
    if (!form.askingPrice || isNaN(Number(form.askingPrice))) e.askingPrice = 'Valid asking price required';
    if (!form.description.trim() || form.description.length < 50) e.description = 'Description must be at least 50 characters';
    if (!form.contactEmail.trim() || !form.contactEmail.includes('@')) e.contactEmail = 'Valid email required';
    if (!form.contactName.trim()) e.contactName = 'Contact name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Listing Submitted!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your business listing has been submitted for review. We&apos;ll publish it shortly.
          </p>
          <div className="flex gap-3">
            <Link href="/business" className="flex-1 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors text-center">
              Browse Listings
            </Link>
            <button onClick={() => { setForm(EMPTY); setSubmitted(false); }}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
              Post Another
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-700 to-purple-900 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/business" className="flex items-center gap-1.5 text-purple-300 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to listings
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold">List Your Business</h1>
          </div>
          <p className="text-purple-200 text-sm">Sell or transfer your Australian business. Free to list.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Business details */}
        <Section num={1} title="Business Details" color="purple">
          <Field label="Business Name" error={errors.name} required>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. The Corner Café" className={inputCls(errors.name)} />
          </Field>

          <Field label="Category" error={errors.category} required>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} type="button" onClick={() => set('category', c)}
                  className={chipCls(form.category === c)}>
                  {c}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {/* Location */}
        <Section num={2} title="Location" color="purple">
          <div className="grid grid-cols-2 gap-3">
            <Field label="State" error={errors.state} required>
              <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls(errors.state)}>
                <option value="">Select state</option>
                {AUSTRALIAN_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>)}
              </select>
            </Field>
            <Field label="Suburb" error={errors.suburb} required>
              <input type="text" value={form.suburb} onChange={(e) => set('suburb', e.target.value)}
                placeholder="e.g. Fitzroy" className={inputCls(errors.suburb)} />
            </Field>
          </div>
        </Section>

        {/* Financials */}
        <Section num={3} title="Financials" color="purple">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Asking Price (AUD)" error={errors.askingPrice} required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" min={0} value={form.askingPrice} onChange={(e) => set('askingPrice', e.target.value)}
                  placeholder="80000" className={`${inputCls(errors.askingPrice)} pl-7`} />
              </div>
            </Field>
            <Field label="Weekly Revenue (optional)">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" min={0} value={form.weeklyRevenue} onChange={(e) => set('weeklyRevenue', e.target.value)}
                  placeholder="5000" className={`${inputCls()} pl-7`} />
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Lease Remaining (months)">
              <input type="number" min={0} value={form.leaseMonthsRemaining} onChange={(e) => set('leaseMonthsRemaining', e.target.value)}
                placeholder="24" className={inputCls()} />
            </Field>
            <Field label="No. of Employees">
              <input type="number" min={0} value={form.employees} onChange={(e) => set('employees', e.target.value)}
                placeholder="3" className={inputCls()} />
            </Field>
            <Field label="Year Established">
              <input type="number" min={1900} max={2026} value={form.established} onChange={(e) => set('established', e.target.value)}
                placeholder="2020" className={inputCls()} />
            </Field>
          </div>
        </Section>

        {/* Description */}
        <Section num={4} title="Description" color="purple">
          <Field label="Reason for Selling (optional)">
            <input type="text" value={form.reasonForSelling} onChange={(e) => set('reasonForSelling', e.target.value)}
              placeholder="e.g. Relocating overseas" className={inputCls()} />
          </Field>
          <Field label="Full Description" error={errors.description} required>
            <textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the business, what's included in the sale, trading history, why it's a great opportunity..."
              className={inputCls(errors.description)} />
            <p className="text-[11px] text-slate-400 mt-1">{form.description.length}/50 minimum characters</p>
          </Field>
        </Section>

        {/* Language */}
        <Section num={5} title="Post Language" color="purple">
          <p className="text-xs text-slate-500 mb-3">Which language is this listing written in?</p>
          <div className="flex flex-wrap gap-2">
            {POST_LANGUAGES.map(({ label, native }) => (
              <button key={label} type="button" onClick={() => set('postLanguage', label)}
                className={chipCls(form.postLanguage === label)}>
                {label === native ? label : `${label} · ${native}`}
              </button>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section num={6} title="Contact Details" color="purple">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Your Name" error={errors.contactName} required>
              <input type="text" value={form.contactName} onChange={(e) => set('contactName', e.target.value)}
                placeholder="e.g. Sarah T." className={inputCls(errors.contactName)} />
            </Field>
            <Field label="Contact Email" error={errors.contactEmail} required>
              <input type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)}
                placeholder="your@email.com" className={inputCls(errors.contactEmail)} />
            </Field>
          </div>
          <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            Your email is shared only with serious enquirers and will not be publicly displayed.
          </div>
        </Section>

        <button type="submit"
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-sm transition-colors">
          Submit Listing →
        </button>
      </form>
    </main>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inputCls(error?: string) {
  return `w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
    error ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-purple-200 focus:border-purple-400'
  }`;
}

function chipCls(active: boolean) {
  return `px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
    active ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600'
  }`;
}

function Section({ num, title, color = 'purple', children }: { num: number; title: string; color?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {num}
        </div>
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
