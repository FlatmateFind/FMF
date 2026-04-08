'use client';
import { useState, useEffect } from 'react';

const ITEMS = [
  { word: 'Rooms',     sub: 'Free to browse. No fees. Message hosts directly.' },
  { word: 'Flatmates', sub: 'Filter by lifestyle, language & move-in date.' },
  { word: 'Jobs',      sub: 'Casual, part-time & full-time roles near you.' },
  { word: 'Events',    sub: 'Markets, meetups & activities in your area.' },
  { word: 'Products',  sub: 'Local goods & services from your community.' },
  { word: 'Services',  sub: 'Tradies, tutors & local businesses near you.' },
  { word: 'Business',  sub: 'Cafés, shops & businesses for sale near you.' },
  { word: 'More',      sub: 'Everything you need for life in Australia — in one place.' },
];

export default function HeroText() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % ITEMS.length);
        setVisible(true);
      }, 350);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const item = ITEMS[idx];

  return (
    <>
      <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight mb-4">
        Find{' '}
        <span
          className={`inline-block transition-all duration-300 text-teal-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          {item.word}
        </span>
      </h1>
      <p
        className={`text-sm sm:text-xl text-teal-100 mb-10 max-w-2xl mx-auto transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {item.sub}
      </p>
    </>
  );
}
