'use client';
import { useState, useEffect } from 'react';
import { JobPost } from '@/data/jobs';

const KEY = 'flatmatefind_jobs';

export function useJobListings() {
  const [userJobs, setUserJobs] = useState<JobPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) setUserJobs(JSON.parse(stored));
    setLoaded(true);
  }, []);

  function add(job: JobPost) {
    setUserJobs((prev) => {
      const next = [job, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function closeJob(id: string) {
    setUserJobs((prev) => {
      const next = prev.map((j) => j.id === id ? { ...j, status: 'closed' as const } : j);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  /** Active user-posted jobs for the current user */
  function activeCountForUser(userId: string): number {
    return userJobs.filter((j) => j.status === 'active' && j.id.startsWith(`job-${userId}`)).length;
  }

  return { userJobs, add, closeJob, activeCountForUser, loaded };
}

/** Read all jobs (seed + user-posted) from localStorage without React state */
export function getAllJobs(): JobPost[] {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
