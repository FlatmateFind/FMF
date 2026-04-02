'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, PlusCircle, Filter } from 'lucide-react';
import { SEED_JOBS, JobPost, JobType } from '@/data/jobs';
import { useAuth } from '@/context/AuthContext';
import JobCard from '@/components/JobCard';
import AdSlot from '@/components/AdSlot';

const ALL_TYPES: JobType[] = ['Full-time', 'Part-time', 'Casual', 'Contract', 'Remote', 'Internship'];

export default function JobsPage() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState<JobPost[]>(SEED_JOBS);
  const [filter, setFilter] = useState<JobType | 'All'>('All');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('flatmatefind_jobs');
      const userJobs: JobPost[] = stored ? JSON.parse(stored) : [];
      const combined = [...userJobs.filter((j) => j.status === 'active'), ...SEED_JOBS];
      const seen = new Set<string>();
      setAllJobs(combined.filter((j) => { if (seen.has(j.id)) return false; seen.add(j.id); return true; }));
    } catch { /* ignore */ }
  }, []);

  const filtered = filter === 'All' ? allJobs : allJobs.filter((j) => j.type === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900">Jobs Board</h1>
          </div>
          <p className="text-slate-500 text-sm">Work opportunities for renters &amp; subletters across Australia</p>
        </div>
        <Link
          href="/jobs/post"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors text-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Post a Job
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* ── Left: job list ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {(['All', ...ALL_TYPES] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  filter === t
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Job list — scrollable on large screens */}
          <div className="space-y-3 lg:max-h-[680px] lg:overflow-y-auto lg:pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">No jobs match this filter.</div>
            ) : (
              filtered.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Showing {filtered.length} job{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ── Right: sidebar ─────────────────────────────────────────────── */}
        <div className="mt-8 lg:mt-0 space-y-4">
          {/* Post a job CTA */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <Briefcase className="w-8 h-8 text-teal-600 mb-3" />
            <h3 className="font-bold text-slate-900 text-lg mb-1">Hiring someone?</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">
              Post your job for free and reach renters and subletters actively looking for work nearby.
            </p>
            <Link
              href="/jobs/post"
              className="block text-center w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Post a Job — Free
            </Link>
          </div>

          {/* How it works */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h4 className="font-semibold text-sm text-slate-700 mb-3">How it works</h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
                Sign in with your FlatmateFind account
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
                Fill in the job details — takes under 2 minutes
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">3</span>
                Applicants contact you directly by email
              </li>
            </ul>
            <p className="text-xs text-slate-400 mt-3 border-t border-slate-200 pt-3">
              Max 2 active posts per account. All listings are reviewed for spam.
            </p>
          </div>

          {/* Sign-in nudge for guests */}
          {!user && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-teal-700 mb-2">Sign in to apply to jobs or post your own.</p>
              <Link href="/auth/signin?from=/jobs" className="text-xs font-semibold text-teal-600 hover:text-teal-800 underline">
                Sign in / Register →
              </Link>
            </div>
          )}

          {/* Ad slot */}
          <AdSlot size="rectangle" />
        </div>
      </div>
    </div>
  );
}
