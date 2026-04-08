'use client';
import { useState } from 'react';
import { MapPin, DollarSign, Clock, Mail, Building2, ChevronDown, ChevronUp, Languages } from 'lucide-react';
import { POST_LANGUAGES } from '@/lib/types';
import ShareButton from '@/components/ShareButton';
import { JobPost, JobType } from '@/data/jobs';
import { useAuth } from '@/context/AuthContext';
import NearbyListings from '@/components/NearbyListings';
import clsx from 'clsx';

const TYPE_BADGE: Record<JobType, string> = {
  'Full-time':  'bg-blue-100 text-blue-700',
  'Part-time':  'bg-teal-100 text-teal-700',
  'Casual':     'bg-amber-100 text-amber-700',
  'Contract':   'bg-purple-100 text-purple-700',
  'Remote':     'bg-green-100 text-green-700',
  'Internship': 'bg-pink-100 text-pink-700',
};

// Left accent bar + hover border colour per type
const TYPE_ACCENT: Record<JobType, { bar: string; hover: string; btn: string }> = {
  'Full-time':  { bar: 'bg-blue-500',   hover: 'hover:border-blue-200 hover:shadow-blue-50',   btn: 'border-blue-400 text-blue-600 hover:bg-blue-50' },
  'Part-time':  { bar: 'bg-teal-500',   hover: 'hover:border-teal-200 hover:shadow-teal-50',   btn: 'border-teal-400 text-teal-600 hover:bg-teal-50' },
  'Casual':     { bar: 'bg-amber-400',  hover: 'hover:border-amber-200 hover:shadow-amber-50',  btn: 'border-amber-400 text-amber-600 hover:bg-amber-50' },
  'Contract':   { bar: 'bg-purple-500', hover: 'hover:border-purple-200 hover:shadow-purple-50', btn: 'border-purple-400 text-purple-600 hover:bg-purple-50' },
  'Remote':     { bar: 'bg-green-500',  hover: 'hover:border-green-200 hover:shadow-green-50',  btn: 'border-green-400 text-green-600 hover:bg-green-50' },
  'Internship': { bar: 'bg-pink-400',   hover: 'hover:border-pink-200 hover:shadow-pink-50',    btn: 'border-pink-400 text-pink-600 hover:bg-pink-50' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function JobCard({ job }: { job: JobPost }) {
  const { user } = useAuth();
  const [showEmail, setShowEmail] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isClosed = job.status === 'closed';
  const isLong = job.description.length > 160;
  const accent = TYPE_ACCENT[job.type] ?? { bar: 'bg-slate-400', hover: 'hover:border-slate-200 hover:shadow-slate-50', btn: 'border-slate-400 text-slate-600 hover:bg-slate-50' };
  const langEntry = job.postLanguage && job.postLanguage !== 'English'
    ? POST_LANGUAGES.find((l) => l.label === job.postLanguage)
    : null;

  return (
    <div className={clsx(
      'bg-white border rounded-xl overflow-hidden transition-all duration-150 flex flex-col',
      isClosed
        ? 'border-slate-200 opacity-60'
        : 'border-slate-200 hover:shadow-md hover:border-blue-200 hover:shadow-blue-50'
    )}>
      {/* Top accent bar — solid blue to match page header */}
      {!isClosed && <div className="h-1 bg-blue-600" />}

      <div className="flex-1 p-4 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-[15px] leading-snug">{job.title}</h3>
            {job.company && (
              <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <Building2 className="w-3 h-3 shrink-0" />
                {job.company}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isClosed && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                Filled
              </span>
            )}
            <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', TYPE_BADGE[job.type] ?? 'bg-slate-100 text-slate-600')}>
              {job.type}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            {job.suburb}, {job.state}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <DollarSign className="w-3 h-3 shrink-0" />
              {job.salary}
            </span>
          )}
          {langEntry && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-full font-medium">
              <Languages className="w-3 h-3 shrink-0" />
              {langEntry.native}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3 shrink-0" />
            {timeAgo(job.postedAt)}
          </span>
        </div>

        {/* Description */}
        <div className="mb-3">
          <p className={clsx('text-sm text-slate-600 leading-relaxed', !expanded && isLong && 'line-clamp-3')}>
            {job.description}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-0.5 text-xs text-teal-600 font-medium mt-1.5 hover:text-teal-800 transition-colors"
            >
              {expanded ? <><ChevronUp className="w-3.5 h-3.5" />Show less</> : <><ChevronDown className="w-3.5 h-3.5" />Read more</>}
            </button>
          )}
        </div>

        {/* Nearby rooms */}
        {!isClosed && <NearbyListings suburb={job.suburb} state={job.state} />}

        {/* Share row */}
        <div className="flex items-center gap-2 mb-2">
          <ShareButton url={`https://flatmatefind.vercel.app/jobs`} title={`${job.title}${job.company ? ` @ ${job.company}` : ''} — ${job.suburb}, ${job.state}`} />
          <span className="text-[10px] text-slate-400">Share this listing</span>
        </div>

        {/* Apply */}
        {isClosed ? (
          <div className="w-full text-xs font-medium py-1.5 rounded-lg bg-slate-100 text-slate-400 text-center">
            Position filled
          </div>
        ) : showEmail ? (
          <a
            href={`mailto:${job.contactEmail}`}
            className="flex items-center gap-1.5 text-xs text-teal-700 font-medium bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5 w-full justify-center hover:bg-teal-100 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            {job.contactEmail}
          </a>
        ) : (
          <button
            onClick={() => {
              if (!user) { window.location.href = '/auth/signin?from=/jobs'; return; }
              setShowEmail(true);
            }}
            className={clsx(
              'w-full text-xs font-semibold py-1.5 rounded-lg border transition-colors',
              accent.btn
            )}
          >
            {user ? 'Show contact' : 'Sign in to apply'}
          </button>
        )}
      </div>
    </div>
  );
}
