'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { JobPost, SEED_JOBS } from '@/data/jobs';

// Map DB row → JobPost
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDB(row: any): JobPost {
  return {
    id: row.id,
    title: row.title,
    company: row.company ?? '',
    type: row.type as JobPost['type'],
    state: row.state,
    suburb: row.suburb ?? '',
    salary: row.pay ?? '',
    description: row.description ?? '',
    contactEmail: row.contact_email ?? '',
    postedByName: row.posted_by_name ?? '',
    postedByRole: (row.posted_by_role as 'renter' | 'subletter') ?? 'renter',
    postedByUserId: row.user_id,
    postedAt: row.posted_at,
    status: row.status as JobPost['status'],
    postLanguage: row.post_language,
  };
}

export function useJobListings() {
  const [userJobs, setUserJobs] = useState<JobPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('posted_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('useJobListings fetch error:', error);
        setUserJobs((data ?? []).map(fromDB));
        setLoaded(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = useCallback(async (job: JobPost) => {
    const row = {
      id: job.id,
      user_id: job.postedByUserId,
      title: job.title,
      company: job.company ?? '',
      type: job.type,
      state: job.state,
      suburb: job.suburb ?? '',
      description: job.description,
      pay: job.salary ?? '',
      contact_email: job.contactEmail,
      post_language: job.postLanguage,
      status: job.status,
      posted_at: job.postedAt,
    };
    const { data, error } = await supabase
      .from('jobs')
      .insert(row)
      .select()
      .single();
    if (error) { console.error('useJobListings add error:', error); return; }
    setUserJobs((prev) => [fromDB(data), ...prev]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeJob = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'expired' })
      .eq('id', id);
    if (error) { console.error('useJobListings closeJob error:', error); return; }
    setUserJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: 'closed' as const } : j));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function activeCountForUser(userId: string): number {
    return userJobs.filter((j) => j.status === 'active' && j.postedByUserId === userId).length;
  }

  return { userJobs, add, closeJob, activeCountForUser, loaded };
}

/** Read all jobs (seed + DB) — returns a merged array for server-side or non-hook use */
export async function getAllJobsAsync(): Promise<JobPost[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active');
    const dbJobs = (data ?? []).map(fromDB);
    const dbIds = new Set(dbJobs.map((j) => j.id));
    const seedOnly = SEED_JOBS.filter((j) => !dbIds.has(j.id));
    return [...dbJobs, ...seedOnly];
  } catch {
    return SEED_JOBS;
  }
}

/** Legacy sync helper — returns only seed jobs (for SSR contexts) */
export function getAllJobs(): JobPost[] {
  return SEED_JOBS;
}
