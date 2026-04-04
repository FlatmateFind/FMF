'use client';
import { useState, useEffect } from 'react';
import { JobPost } from '@/data/jobs';

const KEY = 'flatmatefind_jobs';

export function usePostedJobs(userId?: string) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      const all: JobPost[] = stored ? JSON.parse(stored) : [];
      // Only show jobs posted by this user
      setJobs(userId ? all.filter((j) => j.postedByUserId === userId) : all);
    } catch { /* ignore */ }
    setLoaded(true);
  }, [userId]);

  function saveAll(next: JobPost[]) {
    // Merge: replace user's jobs in the full list
    try {
      const stored = localStorage.getItem(KEY);
      const all: JobPost[] = stored ? JSON.parse(stored) : [];
      const otherJobs = all.filter((j) => j.postedByUserId !== userId);
      localStorage.setItem(KEY, JSON.stringify([...next, ...otherJobs]));
    } catch { /* ignore */ }
    setJobs(next);
  }

  function toggleStatus(id: string) {
    const next = jobs.map((j) =>
      j.id === id ? { ...j, status: j.status === 'active' ? 'paused' : 'active' } : j
    ) as JobPost[];
    saveAll(next);
  }

  function markFilled(id: string) {
    const next = jobs.map((j) =>
      j.id === id ? { ...j, status: 'filled' as const } : j
    );
    saveAll(next);
  }

  function remove(id: string) {
    saveAll(jobs.filter((j) => j.id !== id));
  }

  return { jobs, loaded, toggleStatus, markFilled, remove };
}
