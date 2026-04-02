'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, Clock, ChevronRight } from 'lucide-react';
import { SEED_JOBS, JobPost, JobType } from '@/data/jobs';

const TYPE_STYLES: Record<JobType, string> = {
  'Full-time':  'bg-blue-100 text-blue-700',
  'Part-time':  'bg-teal-100 text-teal-700',
  'Casual':     'bg-amber-100 text-amber-700',
  'Contract':   'bg-purple-100 text-purple-700',
  'Remote':     'bg-green-100 text-green-700',
  'Internship': 'bg-pink-100 text-pink-700',
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

      // Prioritise: suburb match first, then city-name match, then same state
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900">Jobs in this area</h2>
        </div>
        <Link
          href="/jobs"
          className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 transition-colors"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-slate-900 text-sm truncate">{job.title}</span>
                  {job.company && (
                    <span className="text-xs text-slate-500 shrink-0">@ {job.company}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
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
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-1 mt-1.5">{job.description}</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_STYLES[job.type] ?? 'bg-slate-100 text-slate-600'}`}>
                {job.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Jobs posted by renters &amp; subletters near {suburb}, {state} ·{' '}
        <Link href="/jobs" className="text-teal-600 hover:underline">See all jobs</Link>
      </p>
    </div>
  );
}
