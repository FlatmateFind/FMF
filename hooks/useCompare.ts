'use client';
import { useState, useEffect } from 'react';

const KEY = 'flatmatefind_compare';
const EVENT = 'flatmatefind_compare_change';
const MAX = 2;

function readStorage(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readStorage());
    function sync() { setIds(readStorage()); }
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  function persist(next: string[]) {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }

  function toggle(id: string) {
    const current = readStorage();
    if (current.includes(id)) {
      persist(current.filter((x) => x !== id));
    } else if (current.length < MAX) {
      persist([...current, id]);
    }
  }

  function remove(id: string) {
    persist(readStorage().filter((x) => x !== id));
  }

  function clear() {
    persist([]);
  }

  return {
    ids,
    isSelected: (id: string) => ids.includes(id),
    isFull: ids.length >= MAX,
    toggle,
    remove,
    clear,
  };
}
