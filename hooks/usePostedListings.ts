'use client';
import { useState, useEffect } from 'react';

export interface PostedListing {
  id: string;
  title: string;
  type: string;
  city: string;
  suburb: string;
  postcode: string;
  address: string;
  rentAmount: number;
  currency: string;
  period: string;
  bedrooms: number;
  bathrooms: number;
  availableFrom: string;
  postedAt: string;
  status: 'active' | 'paused' | 'taken';
  contactName: string;
  inclusions?: string[];
  facilities?: string[];
  stayType?: string;
  rules?: string[];
  nearbyPlaces?: import('@/lib/types').NearbyPlace[];
  roomFeatures?: string[];
  roomCategories?: string[];
  postLanguage?: string;
  languages?: string[];
}

const KEY = 'flatmatefind_posted_listings';

export function usePostedListings() {
  const [posted, setPosted] = useState<PostedListing[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) setPosted(JSON.parse(stored));
    setLoaded(true);
  }, []);

  function add(listing: PostedListing) {
    setPosted((prev) => {
      const next = [listing, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function toggleStatus(id: string) {
    setPosted((prev) => {
      const next = prev.map((l) =>
        l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l
      ) as PostedListing[];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function markTaken(id: string) {
    setPosted((prev) => {
      const next = prev.map((l) =>
        l.id === id ? { ...l, status: 'taken' as const } : l
      );
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function remove(id: string) {
    setPosted((prev) => {
      const next = prev.filter((l) => l.id !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return { posted, add, toggleStatus, markTaken, remove, loaded };
}
