'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, AlertCircle } from 'lucide-react';
import { AUSTRALIAN_STATES, POST_LANGUAGES } from '@/lib/types';
import { EventCategory } from '@/data/events';

const CATEGORIES: EventCategory[] = [
  'Social', 'Food & Drink', 'Sports', 'Arts & Culture', 'Music', 'Markets', 'Community', 'Study & Career', 'Games & Fun', 'Other',
];

interface FormData {
  title: string;
  category: EventCategory | '';
  state: string;
  suburb: string;
  venue: string;
  date: string;
  endDate: string;
  time: string;
  priceType: 'Free' | 'Paid' | '';
  price: string;
  description: string;
  organizer: string;
  contactEmail: string;
  link: string;
  postLanguage: string;
}

const EMPTY: FormData = {
  title: '', category: '', state: '', suburb: '', venue: '',
  date: '', endDate: '', time: '', priceType: '', price: '',
  description: '', organizer: '', contactEmail: '', link: '', postLanguage: 'English',
};

export default function PostEventPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) e.title = 'Event title is required';
    if (!form.category) e.category = 'Please select a category';
    if (!form.state) e.state = 'Please select a state';
    if (!form.suburb.trim()) e.suburb = 'Suburb is required';
    if (!form.date) e.date = 'Event date is required';
    if (!form.priceType) e.priceType = 'Please select Free or Paid';
    if (form.priceType === 'Paid' && (!form.price || isNaN(Number(form.price)))) e.price = 'Enter a ticket price';
    if (!form.description.trim() || form.description.length < 30) e.description = 'Description must be at least 30 characters';
    if (!form.organizer.trim()) e.organizer = 'Organiser name is required';
    if (!form.contactEmail.trim() || !form.contactEmail.includes('@')) e.contactEmail = 'Valid email required';
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
          <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-7 h-7 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Event Posted!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your event has been submitted and will appear on the events page shortly.
          </p>
          <div className="flex gap-3">
            <Link href="/events" className="flex-1 px-4 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 transition-colors text-center">
              Browse Events
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
      <div className="bg-gradient-to-br from-rose-500 to-pink-700 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/events" className="flex items-center gap-1.5 text-rose-200 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to events
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold">Post an Event</h1>
          </div>
          <p className="text-rose-100 text-sm">Share your event with the local community. Free to post.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Basic info */}
        <Section num={1} title="Event Details">
          <Field label="Event Title" error={errors.title} required>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. International Student Mixer" className={inputCls(errors.title)} />
          </Field>

          <Field label="Category" error={errors.category} required>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} type="button" onClick={() => set('category', c)}
                  className={chipCls(form.category === c)}>{c}</button>
              ))}
            </div>
          </Field>
        </Section>

        {/* Location */}
        <Section num={2} title="Location">
          <div className="grid grid-cols-2 gap-3">
            <Field label="State" error={errors.state} required>
              <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls(errors.state)}>
                <option value="">Select state</option>
                {AUSTRALIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Suburb" error={errors.suburb} required>
              <input type="text" value={form.suburb} onChange={(e) => set('suburb', e.target.value)}
                placeholder="e.g. Carlton" className={inputCls(errors.suburb)} />
            </Field>
          </div>
          <Field label="Venue Name (optional)">
            <input type="text" value={form.venue} onChange={(e) => set('venue', e.target.value)}
              placeholder="e.g. Rooftop Bar, Federation Square" className={inputCls()} />
          </Field>
        </Section>

        {/* Date & time */}
        <Section num={3} title="Date & Time">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date" error={errors.date} required>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                className={inputCls(errors.date)} />
            </Field>
            <Field label="End Date (optional, for multi-day)">
              <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)}
                className={inputCls()} />
            </Field>
          </div>
          <Field label="Time (optional)">
            <input type="text" value={form.time} onChange={(e) => set('time', e.target.value)}
              placeholder="e.g. 7:00 PM or 10:00 AM – 4:00 PM" className={inputCls()} />
          </Field>
        </Section>

        {/* Tickets */}
        <Section num={4} title="Tickets & Price">
          <Field label="Entry" error={errors.priceType} required>
            <div className="grid grid-cols-2 gap-3">
              {(['Free', 'Paid'] as const).map((p) => (
                <button key={p} type="button" onClick={() => set('priceType', p)}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.priceType === p
                      ? p === 'Free' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200'
                  }`}>
                  {p === 'Free' ? '🎉 Free' : '🎟️ Paid'}
                </button>
              ))}
            </div>
          </Field>
          {form.priceType === 'Paid' && (
            <Field label="Ticket Price (AUD)" error={errors.price} required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" min={0} value={form.price} onChange={(e) => set('price', e.target.value)}
                  placeholder="25" className={`${inputCls(errors.price)} pl-7`} />
              </div>
            </Field>
          )}
        </Section>

        {/* Description */}
        <Section num={5} title="About the Event">
          <Field label="Description" error={errors.description} required>
            <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Tell people what to expect — who it's for, what's happening, what to bring, how to register..."
              className={inputCls(errors.description)} />
            <p className="text-[11px] text-slate-400 mt-1">{form.description.length}/30 minimum characters</p>
          </Field>
          <Field label="Event Link / Registration URL (optional)">
            <input type="url" value={form.link} onChange={(e) => set('link', e.target.value)}
              placeholder="https://eventbrite.com/..." className={inputCls()} />
          </Field>
        </Section>

        {/* Language */}
        <Section num={6} title="Post Language">
          <p className="text-xs text-slate-500 mb-3">What language is this event post written in?</p>
          <div className="flex flex-wrap gap-2">
            {POST_LANGUAGES.map(({ label, native }) => (
              <button key={label} type="button" onClick={() => set('postLanguage', label)}
                className={chipCls(form.postLanguage === label)}>
                {label === native ? label : `${label} · ${native}`}
              </button>
            ))}
          </div>
        </Section>

        {/* Organiser */}
        <Section num={7} title="Organiser">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Organiser Name" error={errors.organizer} required>
              <input type="text" value={form.organizer} onChange={(e) => set('organizer', e.target.value)}
                placeholder="e.g. Melbourne International Students Network" className={inputCls(errors.organizer)} />
            </Field>
            <Field label="Contact Email" error={errors.contactEmail} required>
              <input type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)}
                placeholder="events@yourorg.com" className={inputCls(errors.contactEmail)} />
            </Field>
          </div>
          <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            Your email will only be shown for RSVP / booking enquiries.
          </div>
        </Section>

        <button type="submit"
          className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-colors">
          Post Event →
        </button>
      </form>
    </main>
  );
}

function inputCls(error?: string) {
  return `w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
    error ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-rose-200 focus:border-rose-400'
  }`;
}
function chipCls(active: boolean) {
  return `px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
    active ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-600'
  }`;
}
function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{num}</div>
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
