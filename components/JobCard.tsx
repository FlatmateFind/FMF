'use client';
import { useState } from 'react';
import { MapPin, DollarSign, Clock, Mail, Building2 } from 'lucide-react';
import { JobPost, JobType } from '@/data/jobs';
import { useAuth } from '@/context/AuthContext';
import NearbyListings from '@/components/NearbyListings';
import clsx from 'clsx';

const TYPE_STYLES: Record<JobType, string> = {
  'Full-time':  'bg-blue-100 text-blue-700',
  'Part-time':  'bg-teal-100 text-teal-700',
  'Casual':     'bg-amber-100 text-amber-700',
  'Contract':   'bg-purple-100 text-purple-700',
  'Remote':     'bg-green-100 text-green-700',
  'Internship': 'bg-pink-100 text-pink-700',
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

  return (
    <div className={clsx(
      "bg-white border rounded-xl p-4 transition-all duration-150",
      isClosed ? "border-slate-200 opacity-60" : "border-slate-200 hover:shadow-md hover:border-teal-200"
    )}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1">{job.title}</h3>
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
          <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', TYPE_STYLES[job.type] ?? 'bg-slate-100 text-slate-600')}>
            {job.type}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          {job.suburb}, {job.state}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 shrink-0" />
            {job.salary}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="w-3 h-3 shrink-0" />
          {timeAgo(job.postedAt)}
        </span>
      </div>

      {/* Description */}
      <div className="bg-slate-50 rounded-lg px-3 py-2.5 mb-3">
        <p className={clsx('text-sm text-slate-700 leading-relaxed', !expanded && isLong && 'line-clamp-3')}>
          {job.description}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-teal-600 font-medium mt-1 hover:text-teal-800 transition-colors"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Nearby rooms */}
      {!isClosed && <NearbyListings suburb={job.suburb} state={job.state} />}

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
          className="w-full text-xs font-semibold py-1.5 rounded-lg border border-teal-500 text-teal-600 hover:bg-teal-50 transition-colors"
        >
          {user ? 'Show contact' : 'Sign in to apply'}
        </button>
      )}
    </div>
  );
}
