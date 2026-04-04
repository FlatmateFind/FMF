'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { SEED_JOBS, JobPost, JobType } from '@/data/jobs';

const TYPE_BADGE: Record<JobType, string> = {
  'Full-time':  'bg-blue-100 text-blue-700',
  'Part-time':  'bg-teal-100 text-teal-700',
  'Casual':     'bg-amber-100 text-amber-700',
  'Contract':   'bg-purple-100 text-purple-700',
  'Remote':     'bg-green-100 text-green-700',
  'Internship': 'bg-pink-100 text-pink-700',
};

const TYPE_ACCENT: Record<JobType, { bar: string; hover: string }> = {
  'Full-time':  { bar: 'bg-blue-500',   hover: 'hover:border-blue-200 hover:shadow-blue-50/50' },
  'Part-time':  { bar: 'bg-teal-500',   hover: 'hover:border-teal-200 hover:shadow-teal-50/50' },
  'Casual':     { bar: 'bg-amber-400',  hover: 'hover:border-amber-200 hover:shadow-amber-50/50' },
  'Contract':   { bar: 'bg-purple-500', hover: 'hover:border-purple-200 hover:shadow-purple-50/50' },
  'Remote':     { bar: 'bg-green-500',  hover: 'hover:border-green-200 hover:shadow-green-50/50' },
  'Internship': { bar: 'bg-pink-400',   hover: 'hover:border-pink-200 hover:shadow-pink-50/50' },
};

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

interface NearbyJobsProps {
  suburb: string;
  city: string;
  state: string;
}

export default function NearbyJobs({ suburb, city, state }: NearbyJobsProps) {
  const [jobs, setJobs] = useState<JobPost[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('flatmatefind_jobs');
      const userJobs: JobPost[] = stored ? JSON.parse(stored) : [];
      const all = [...userJobs.filter((j) => j.status === 'active'), ...SEED_JOBS];
      const seen = new Set<string>();
      const deduped = all.filter((j) => { if (seen.has(j.id)) return false; seen.add(j.id); return true; });

      const suburbLower = suburb.toLowerCase();
      const cityLower = city.toLowerCase();

      const exact = deduped.filter((j) => j.suburb.toLowerCase() === suburbLower && j.status === 'active');
      const cityMatch = deduped.filter(
        (j) => j.status === 'active' && j.suburb.toLowerCase() !== suburbLower &&
          (j.suburb.toLowerCase() === cityLower || j.suburb.toLowerCase().includes(cityLower))
      );
      const stateMatch = deduped.filter(
        (j) => j.status === 'active' && j.state === state &&
          j.suburb.toLowerCase() !== suburbLower && !j.suburb.toLowerCase().includes(cityLower)
      );

      setJobs([...exact, ...cityMatch, ...stateMatch].slice(0, 3));
    } catch { /* ignore */ }
  }, [suburb, city, state]);

  if (jobs.length === 0) return null;

  return (
    <div className="mt-14">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
            <Briefcase className="w-4.5 h-4.5 text-teal-600 w-[18px] h-[18px]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Jobs in this area</h2>
            <p className="text-xs text-slate-400">Opportunities near {suburb}, {state}</p>
          </div>
        </div>
        <Link
          href="/jobs"
          className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors px-3 py-1.5 rounded-lg border border-teal-200 hover:border-teal-400 hover:bg-teal-50"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Job cards */}
      <div className="space-y-2.5">
        {jobs.map((job) => {
          const accent = TYPE_ACCENT[job.type] ?? { bar: 'bg-slate-400', hover: 'hover:border-slate-200' };
          return (
            <Link
              key={job.id}
              href="/jobs"
              className={`flex overflow-hidden bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-150 group ${accent.hover}`}
            >
              {/* Accent bar */}
              <div className={`w-1 shrink-0 ${accent.bar}`} />

              {/* Content */}
              <div className="flex-1 px-4 py-3 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Title + company */}
                    <div className="flex items-baseline gap-2 flex-wrap mb-1">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                        {job.title}
                      </span>
                      {job.company && (
                        <span className="text-xs text-slate-400 shrink-0">@ {job.company}</span>
                      )}
                    </div>
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
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
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        {timeAgo(job.postedAt)}
                      </span>
                    </div>
                    {/* Description snippet */}
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1.5 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[job.type] ?? 'bg-slate-100 text-slate-600'}`}>
                      {job.type}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Jobs posted by renters &amp; subletters near {suburb}, {state} ·{' '}
        <Link href="/jobs" className="text-teal-600 hover:underline">See all jobs</Link>
      </p>
    </div>
  );
}
