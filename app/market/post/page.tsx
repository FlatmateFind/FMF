'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, AlertCircle, Package, Wrench } from 'lucide-react';
import { AUSTRALIAN_STATES, POST_LANGUAGES } from '@/lib/types';
import {
  ProductCategory, ServiceCategory, ProductCondition, PriceType,
  MarketKind,
} from '@/data/market';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

const PRODUCT_CATS: ProductCategory[] = [
  'Electronics', 'Food & Snacks', 'Clothing', 'Furniture', 'Books & Study', 'Vehicles', 'Kitchen', 'Sports & Fitness', 'Other',
];
const SERVICE_CATS: ServiceCategory[] = [
  'Tax & Accounting', 'Visa Help', 'Removalist', 'Cleaning', 'Driving Lessons', 'Tutoring', 'Photography', 'IT & Tech', 'Beauty & Wellness', 'Other',
];
const CONDITIONS: ProductCondition[] = ['New', 'Like New', 'Good', 'Fair', 'For Parts'];
const PRICE_TYPES_PRODUCT: PriceType[] = ['Fixed', 'Negotiable', 'Free'];
const PRICE_TYPES_SERVICE: PriceType[] = ['Fixed', 'Per Hour', 'Contact'];

interface FormData {
  kind: MarketKind | '';
  title: string;
  category: string;
  state: string;
  suburb: string;
  price: string;
  priceType: PriceType | '';
  condition: ProductCondition | '';
  description: string;
  contactEmail: string;
  contactPhone: string;
  contactName: string;
  postLanguage: string;
}

const EMPTY: FormData = {
  kind: '', title: '', category: '', state: '', suburb: '',
  price: '', priceType: '', condition: '', description: '',
  contactEmail: '', contactPhone: '', contactName: '', postLanguage: 'English',
};

export default function PostMarketPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function set(field: keyof FormData, value: string) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'kind') { next.category = ''; next.condition = ''; next.priceType = ''; }
      return next;
    });
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.kind) e.kind = 'Please select product or service';
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.category) e.category = 'Please select a category';
    if (!form.state) e.state = 'Please select a state';
    if (!form.suburb.trim()) e.suburb = 'Suburb is required';
    if (!form.priceType) e.priceType = 'Please select a price type';
    if (form.priceType && form.priceType !== 'Free' && form.priceType !== 'Contact' && (!form.price || isNaN(Number(form.price)))) {
      e.price = 'Please enter a valid price';
    }
    if (!form.description.trim() || form.description.length < 30) e.description = 'Description must be at least 30 characters';
    if (!form.contactEmail.trim() || !form.contactEmail.includes('@')) e.contactEmail = 'Valid email required';
    if (!form.contactName.trim()) e.contactName = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError('');

    const row = {
      user_id: user?.id ?? null,
      title: form.title.trim(),
      category: form.category || null,
      condition: form.kind === 'product' ? (form.condition || null) : null,
      price: form.price && form.priceType !== 'Free' && form.priceType !== 'Contact' ? Number(form.price) : null,
      negotiable: form.priceType === 'Negotiable',
      suburb: form.suburb || null,
      state: form.state || null,
      description: form.description.trim(),
      seller_name: form.contactName.trim(),
      contact_email: form.contactEmail.trim(),
      contact_phone: form.contactPhone || null,
    };

    const { error } = await supabase.from('market_items').insert(row);
    if (error) {
      setSubmitError(error.message);
      return;
    }
    setSubmitted(true);
  }

  const cats = form.kind === 'product' ? PRODUCT_CATS : form.kind === 'service' ? SERVICE_CATS : [];
  const priceTypes = form.kind === 'service' ? PRICE_TYPES_SERVICE : PRICE_TYPES_PRODUCT;

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Listing Posted!</h2>
          <p className="text-sm text-slate-500 mb-6">Your listing has been submitted. It will go live shortly.</p>
          <div className="flex gap-3">
            <Link href="/market" className="flex-1 px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors text-center">
              Browse Market
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
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/market" className="flex items-center gap-1.5 text-amber-200 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to market
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold">Post to Marketplace</h1>
          </div>
          <p className="text-amber-100 text-sm">Sell products or offer services to the FlatmateFind community.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Kind */}
        <Section num={1} title="What are you posting?">
          {errors.kind && <p className="text-[11px] text-rose-500 mb-2">{errors.kind}</p>}
          <div className="grid grid-cols-2 gap-3">
            {(['product', 'service'] as const).map((k) => (
              <button key={k} type="button" onClick={() => set('kind', k)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  form.kind === k ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white hover:border-amber-300'
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  form.kind === k ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {k === 'product' ? <Package className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 capitalize">{k}</p>
                  <p className="text-[11px] text-slate-500">{k === 'product' ? 'Items to sell' : 'Skills & help'}</p>
                </div>
              </button>
            ))}
          </div>
        </Section>

        {form.kind && (
          <>
            {/* Details */}
            <Section num={2} title="Listing Details">
              <Field label="Title" error={errors.title} required>
                <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
                  placeholder={form.kind === 'product' ? 'e.g. iPhone 13 Pro 256GB' : 'e.g. Tax Return Help for Students'}
                  className={inputCls(errors.title)} />
              </Field>

              <Field label="Category" error={errors.category} required>
                <div className="flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <button key={c} type="button" onClick={() => set('category', c)}
                      className={chipCls(form.category === c)}>{c}</button>
                  ))}
                </div>
              </Field>

              {form.kind === 'product' && (
                <Field label="Condition" error={errors.condition}>
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map((c) => (
                      <button key={c} type="button" onClick={() => set('condition', c)}
                        className={chipCls(form.condition === c)}>{c}</button>
                    ))}
                  </div>
                </Field>
              )}
            </Section>

            {/* Location + price */}
            <Section num={3} title="Location & Price">
              <div className="grid grid-cols-2 gap-3">
                <Field label="State" error={errors.state} required>
                  <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls(errors.state)}>
                    <option value="">Select state</option>
                    {AUSTRALIAN_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>)}
                  </select>
                </Field>
                <Field label="Suburb" error={errors.suburb} required>
                  <input type="text" value={form.suburb} onChange={(e) => set('suburb', e.target.value)}
                    placeholder="e.g. Carlton" className={inputCls(errors.suburb)} />
                </Field>
              </div>

              <Field label="Price Type" error={errors.priceType} required>
                <div className="flex flex-wrap gap-2">
                  {priceTypes.map((p) => (
                    <button key={p} type="button" onClick={() => set('priceType', p)}
                      className={chipCls(form.priceType === p)}>{p}</button>
                  ))}
                </div>
              </Field>

              {form.priceType && form.priceType !== 'Free' && form.priceType !== 'Contact' && (
                <Field label={`Price (AUD${form.priceType === 'Per Hour' ? ' per hour' : ''})`} error={errors.price} required>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input type="number" min={0} value={form.price} onChange={(e) => set('price', e.target.value)}
                      placeholder="0" className={`${inputCls(errors.price)} pl-7`} />
                  </div>
                </Field>
              )}
            </Section>

            {/* Description */}
            <Section num={4} title="Description">
              <Field label="Description" error={errors.description} required>
                <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)}
                  placeholder={form.kind === 'product'
                    ? 'Describe the item — brand, model, age, what\'s included, any defects...'
                    : 'Describe your service — what you offer, your experience, availability, how to book...'}
                  className={inputCls(errors.description)} />
                <p className="text-[11px] text-slate-400 mt-1">{form.description.length}/30 minimum characters</p>
              </Field>
            </Section>

            {/* Language */}
            <Section num={5} title="Post Language">
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
            <Section num={6} title="Contact">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Your Name" error={errors.contactName} required>
                  <input type="text" value={form.contactName} onChange={(e) => set('contactName', e.target.value)}
                    placeholder="e.g. Kevin T." className={inputCls(errors.contactName)} />
                </Field>
                <Field label="Email" error={errors.contactEmail} required>
                  <input type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)}
                    placeholder="your@email.com" className={inputCls(errors.contactEmail)} />
                </Field>
              </div>
              <Field label="Phone (optional)">
                <input type="tel" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)}
                  placeholder="04xx xxx xxx" className={inputCls()} />
              </Field>
              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                Your contact details are only shared with people who reach out about your listing.
              </div>
            </Section>

            {submitError && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{submitError}</p>
            )}
            <button type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-sm transition-colors">
              Post Listing →
            </button>
          </>
        )}
      </form>
    </main>
  );
}

function inputCls(error?: string) {
  return `w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
    error ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-amber-200 focus:border-amber-400'
  }`;
}
function chipCls(active: boolean) {
  return `px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
    active ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700'
  }`;
}
function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{num}</div>
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
