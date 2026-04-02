'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertTriangle, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useJobListings } from '@/hooks/useJobListings';
import { checkSpam } from '@/lib/spamGuard';
import { AUSTRALIAN_STATES } from '@/lib/types';
import { JobType } from '@/data/jobs';

const JOB_TYPES: JobType[] = ['Full-time', 'Part-time', 'Casual', 'Contract', 'Remote', 'Internship'];

const inputClass = 'w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none';
const selectClass = `${inputClass} bg-white`;

export default function PostJobPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { userJobs, add } = useJobListings();
  const [submitted, setSubmitted] = useState(false);
  const [spamWarnings, setSpamWarnings] = useState<string[]>([]);
  const [blockError, setBlockError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<JobType | ''>('');
  const [state, setState] = useState('');
  const [suburb, setSuburb] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin?from=/jobs/post');
  }, [loading, user, router]);

  // Pre-fill email from user account
  useEffect(() => {
    if (user) setContactEmail(user.email);
  }, [user]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (!type) errs.type = 'Required';
    if (!state) errs.state = 'Required';
    if (!suburb.trim()) errs.suburb = 'Required';
    if (!description.trim() || description.trim().length < 50)
      errs.description = `At least 50 characters required (${description.trim().length}/50)`;
    if (!contactEmail.trim()) errs.contactEmail = 'Required';
    if (contactEmail && !contactEmail.includes('@')) errs.contactEmail = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBlockError('');
    setSpamWarnings([]);

    // Rate limit: max 2 active jobs per user
    const active = userJobs.filter(
      (j) => j.status === 'active' && j.id.startsWith(`job-${user!.id}`)
    ).length;
    if (active >= 2) {
      setBlockError('You already have 2 active job posts. Close an existing one before posting another.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Spam check
    const spam = checkSpam(`${title} ${description}`);
    if (spam.flagged) {
      setSpamWarnings(spam.reasons);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!validate()) return;

    add({
      id: `job-${user!.id}-${Date.now()}`,
      title: title.trim(),
      company: company.trim() || undefined,
      type: type as JobType,
      state,
      suburb: suburb.trim(),
      salary: salary.trim() || undefined,
      description: description.trim(),
      contactEmail: contactEmail.trim(),
      postedByName: user!.name,
      postedByRole: user!.role,
      postedAt: new Date().toISOString(),
      status: 'active',
    });

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-14 h-14 text-teal-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Job Posted!</h1>
        <p className="text-slate-500 text-sm mb-6">Your listing is now visible on the job board.</p>
        <div className="flex justify-center gap-3">
          <Link href="/#jobs" className="px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 text-sm transition-colors">View Job Board</Link>
          <Link href="/dashboard" className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 text-sm transition-colors">Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-6 h-6 text-teal-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Post a Job</h1>
          <p className="text-slate-500 text-sm">Reach renters and subletters looking for work</p>
        </div>
      </div>

      {/* Rate limit error */}
      {blockError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{blockError}</p>
        </div>
      )}

      {/* Spam warnings */}
      {spamWarnings.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-5">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm mb-1">Listing flagged for review</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {spamWarnings.map((w) => <li key={w} className="text-amber-700 text-sm">{w}</li>)}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Barista, Delivery Driver, Web Developer" className={inputClass} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Company + Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company <span className="text-slate-400 font-normal">(optional)</span></label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Acme Pty Ltd" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Type <span className="text-red-500">*</span></label>
            <select value={type} onChange={(e) => setType(e.target.value as JobType)} className={selectClass}>
              <option value="">Select...</option>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>
        </div>

        {/* State + Suburb */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
            <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass}>
              <option value="">Select state...</option>
              {AUSTRALIAN_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Suburb / Area <span className="text-red-500">*</span></label>
            <input value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="e.g. Fitzroy, Remote" className={inputClass} />
            {errors.suburb && <p className="text-red-500 text-xs mt-1">{errors.suburb}</p>}
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Pay / Salary <span className="text-slate-400 font-normal">(optional)</span></label>
          <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. $25/hr, $60,000/yr, Negotiable" className={inputClass} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Description <span className="text-red-500">*</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe the role, requirements, hours, and what you're looking for..."
            className={`${inputClass} resize-none`}
          />
          <div className="flex justify-between mt-1">
            {errors.description
              ? <p className="text-red-500 text-xs">{errors.description}</p>
              : <p className="text-xs text-slate-400">Minimum 50 characters</p>}
            <span className={`text-xs font-medium ${description.trim().length >= 50 ? 'text-green-600' : 'text-slate-400'}`}>
              {description.trim().length}/50
            </span>
          </div>
        </div>

        {/* Contact email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Email <span className="text-red-500">*</span></label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="applicants@youremail.com" className={inputClass} />
          {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
          <p className="text-xs text-slate-400 mt-1">Only shown to signed-in users who click &ldquo;Apply&rdquo;.</p>
        </div>

        <button type="submit" className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-sm">
          Post Job
        </button>
      </form>
    </div>
  );
}
