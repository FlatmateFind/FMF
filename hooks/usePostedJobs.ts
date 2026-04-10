'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { JobPost } from '@/data/jobs';

// Map DB row to JobPost
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

// Map JobPost to DB insert shape
function toDB(job: JobPost, userId: string) {
  return {
    id: job.id,
    user_id: userId,
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
}

export function usePostedJobs(userId?: string) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setJobs([]);
      setLoaded(true);
      return;
    }
    supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .order('posted_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('usePostedJobs fetch error:', error);
        setJobs((data ?? []).map(fromDB));
        setLoaded(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleStatus = useCallback(async (id: string) => {
    if (!userId) return;
    const current = jobs.find((j) => j.id === id);
    if (!current) return;
    const newStatus = current.status === 'active' ? 'paused' : 'active';
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) { console.error('usePostedJobs toggleStatus error:', error); return; }
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: newStatus } : j) as JobPost[]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, jobs]);

  const markFilled = useCallback(async (id: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'expired' })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) { console.error('usePostedJobs markFilled error:', error); return; }
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: 'filled' as const } : j));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const remove = useCallback(async (id: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) { console.error('usePostedJobs remove error:', error); return; }
    setJobs((prev) => prev.filter((j) => j.id !== id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Add function for inserting a new job
  const addJob = useCallback(async (job: JobPost) => {
    if (!userId) return;
    const row = toDB(job, userId);
    const { data, error } = await supabase
      .from('jobs')
      .insert(row)
      .select()
      .single();
    if (error) { console.error('usePostedJobs addJob error:', error); return; }
    setJobs((prev) => [fromDB(data), ...prev]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { jobs, loaded, toggleStatus, markFilled, remove, addJob };
}
