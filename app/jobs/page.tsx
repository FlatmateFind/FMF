'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, PlusCircle, Search, SlidersHorizontal, X, ArrowUpDown, Languages } from 'lucide-react';
import { SEED_JOBS, JobPost, JobType } from '@/data/jobs';
import { POST_LANGUAGES, AUSTRALIAN_STATES } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import JobCard from '@/components/JobCard';
import AdSlot from '@/components/AdSlot';

const ALL_TYPES: JobType[] = ['Full-time', 'Part-time', 'Casual', 'Contract', 'Remote', 'Internship'];

const TYPE_COLORS: Record<JobType, string> = {
  'Full-time':  'bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400',
  'Part-time':  'bg-teal-50 border-teal-200 text-teal-700 hover:border-teal-400',
  'Casual':     'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-400',
  'Contract':   'bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-400',
  'Remote':     'bg-green-50 border-green-200 text-green-700 hover:border-green-400',
  'Internship': 'bg-pink-50 border-pink-200 text-pink-700 hover:border-pink-400',
};

const TYPE_ACTIVE: Record<JobType, string> = {
  'Full-time':  'bg-blue-600 border-blue-600 text-white',
  'Part-time':  'bg-teal-600 border-teal-600 text-white',
  'Casual':     'bg-amber-500 border-amber-500 text-white',
  'Contract':   'bg-purple-600 border-purple-600 text-white',
  'Remote':     'bg-green-600 border-green-600 text-white',
  'Internship': 'bg-pink-500 border-pink-500 text-white',
};

export default function JobsPage() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState<JobPost[]>(SEED_JOBS);
  const [typeFilter, setTypeFilter] = useState<JobType[]>([]);
  const [langFilter, setLangFilter] = useState(''); // empty = all languages
  const [stateFilter, setStateFilter] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('flatmatefind_jobs');
      const userJobs: JobPost[] = stored ? JSON.parse(stored) : [];
      const combined = [...userJobs.filter((j) => j.status === 'active'), ...SEED_JOBS];
      const seen = new Set<string>();
      setAllJobs(combined.filter((j) => { if (seen.has(j.id)) return false; seen.add(j.id); return true; }));
    } catch { /* ignore */ }
  }, []);

  const toggleType = (t: JobType) =>
    setTypeFilter((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const filtered = allJobs
    .filter((j) => typeFilter.length === 0 || typeFilter.includes(j.type))
    .filter((j) => !langFilter || (j.postLanguage ?? 'English') === langFilter)
    .filter((j) => !stateFilter || j.state === stateFilter)
    .filter((j) => !query || j.title.toLowerCase().includes(query.toLowerCase()) || (j.company ?? '').toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === 'newest'
      ? new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      : new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime()
    );

  const hasFilters = typeFilter.length > 0 || langFilter || stateFilter;

  const clearAll = () => { setTypeFilter([]); setLangFilter(''); setStateFilter(''); };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Job type */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Job Type</p>
        <div className="flex flex-col gap-2">
          {ALL_TYPES.map((t) => {
            const active = typeFilter.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                  active ? TYPE_ACTIVE[t] : TYPE_COLORS[t]
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* State */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">State</p>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-teal-500 outline-none bg-white text-slate-700"
        >
          <option value="">All states</option>
          {AUSTRALIAN_STATES.map((s) => (
            <option key={s.abbr} value={s.abbr}>{s.abbr} — {s.name}</option>
          ))}
        </select>
      </div>

      {/* Post language */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Post Language</p>
        <p className="text-[11px] text-slate-400 mb-3">Show posts written in a specific language</p>
        <div className="flex flex-wrap gap-1.5">
          {POST_LANGUAGES.map(({ label, native }) => {
            const active = langFilter === label;
            return (
              <button
                key={label}
                onClick={() => setLangFilter(active ? '' : label)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  active
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700'
                }`}
              >
                {label === native ? label : <><span>{label}</span><span className="opacity-60">·</span><span>{native}</span></>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Sort By</p>
        <div className="flex flex-col gap-2">
          {(['newest', 'oldest'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                sort === s
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {s === 'newest' ? 'Newest first' : 'Oldest first'}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg py-2 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear all filters
        </button>
      )}

      {/* Ad slot */}
      <AdSlot size="rectangle" slotId="jobs-sidebar" />
    </div>
  );

  return (
    <div>
      {/* Hero header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">Jobs & Careers</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1">Find Your Next Job in Australia</h1>
              <p className="text-blue-200 text-sm">Browse roles across every state — full-time, casual, remote, and Working Holiday Visa friendly.</p>
            </div>
            <Link
              href="/jobs/post"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-xl transition-colors text-sm shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Post a Job
            </Link>
          </div>
        </div>
      </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search job title or company..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile filter toggle */}
      <div className="flex items-center gap-2 mb-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-teal-400 hover:text-teal-600 transition-colors bg-white"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && (
            <span className="w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {typeFilter.length + (langFilter ? 1 : 0) + (stateFilter ? 1 : 0)}
            </span>
          )}
        </button>
        <p className="text-sm text-slate-500 ml-auto">{filtered.length} job{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-slate-800">Filters</span>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <FilterSidebar />
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-slate-800 text-sm">Filters</span>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                  Clear all
                </button>
              )}
            </div>
            <FilterSidebar />
          </div>
        </aside>

        {/* Job cards */}
        <div className="flex-1 min-w-0">
          <div className="hidden lg:flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">{filtered.length} job{filtered.length !== 1 ? 's' : ''} found</p>
            {!user && (
              <Link href="/auth/signin?from=/jobs" className="text-xs text-teal-600 hover:text-teal-800 font-medium">
                Sign in to apply →
              </Link>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No jobs match your filters.</p>
              <button onClick={clearAll} className="mt-3 text-xs text-teal-600 hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filtered.map((job, i) => (
                <>
                  <JobCard key={job.id} job={job} />
                  {/* Ad slot every 6 cards */}
                  {i === 5 && (
                    <div key="ad-inline" className="xl:col-span-2">
                      <AdSlot size="leaderboard" slotId="home-leaderboard" />
                    </div>
                  )}
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
