'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, PlusCircle, Filter } from 'lucide-react';
import { SEED_JOBS, JobPost, JobType } from '@/data/jobs';
import { useAuth } from '@/context/AuthContext';
import JobCard from '@/components/JobCard';

const ALL_TYPES: JobType[] = ['Full-time', 'Part-time', 'Casual', 'Contract', 'Remote', 'Internship'];

export default function HomeJobBoard() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState<JobPost[]>(SEED_JOBS);
  const [filter, setFilter] = useState<JobType | 'All'>('All');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('flatmatefind_jobs');
      const userJobs: JobPost[] = stored ? JSON.parse(stored) : [];
      const combined = [...userJobs.filter((j) => j.status === 'active'), ...SEED_JOBS];
      // De-duplicate by id
      const seen = new Set<string>();
      setAllJobs(combined.filter((j) => { if (seen.has(j.id)) return false; seen.add(j.id); return true; }));
    } catch { /* ignore */ }
  }, []);

  const filtered = filter === 'All'
    ? allJobs
    : allJobs.filter((j) => j.type === filter);

  return (
    <section id="jobs" className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-teal-400" />
              <h2 className="text-2xl font-bold">Jobs Board</h2>
            </div>
            <p className="text-slate-400 text-sm">Work opportunities for renters &amp; subletters in your area</p>
          </div>
          <Link
            href="/jobs/post"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-lg transition-colors text-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Post a Job
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* ── Left: scrollable job list ───────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Type filter pills */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {(['All', ...ALL_TYPES] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    filter === t
                      ? 'bg-teal-500 text-white border-teal-500'
                      : 'bg-transparent text-slate-400 border-slate-600 hover:border-teal-400 hover:text-teal-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Scrollable list */}
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1 scrollbar-thin">
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">No jobs match this filter.</div>
              ) : (
                filtered.map((job) => <JobCard key={job.id} job={job} />)
              )}
            </div>

            <p className="text-xs text-slate-500 mt-3">Showing {filtered.length} job{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          {/* ── Right: CTA panel ─────────────────────────────────────────── */}
          <div className="mt-8 lg:mt-0 space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <Briefcase className="w-8 h-8 text-teal-400 mb-3" />
              <h3 className="font-bold text-lg mb-1">Hiring someone?</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Post your job for free and reach renters and subletters actively looking for work nearby.
              </p>
              <Link
                href="/jobs/post"
                className="block text-center w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-lg text-sm transition-colors"
              >
                Post a Job — Free
              </Link>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <h4 className="font-semibold text-sm mb-3 text-slate-300">How it works</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
                  Sign in with your FlatmateFind account
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
                  Fill in the job details — takes under 2 minutes
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center font-bold shrink-0 text-[10px]">3</span>
                  Applicants contact you directly by email
                </li>
              </ul>
              <p className="text-xs text-slate-500 mt-3 border-t border-slate-700 pt-3">
                Max 2 active posts per account. All listings are reviewed for spam.
              </p>
            </div>

            {!user && (
              <div className="bg-teal-900/40 border border-teal-700/50 rounded-2xl p-4 text-center">
                <p className="text-sm text-teal-300 mb-3">Sign in to apply to jobs or post your own.</p>
                <Link href="/auth/signin" className="text-xs font-semibold text-teal-400 hover:text-teal-300 underline">Sign in / Register →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
