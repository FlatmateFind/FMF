const KEY = 'flatmatefind_views';

// Seeded view counts so popular/new sections are meaningful from day one
const SEED_VIEWS: Record<string, number> = {
  'syd-002': 247,
  'mel-001': 189,
  'syd-001': 156,
  'mel-003': 134,
  'bri-001': 98,
  'gc-001':  87,
  'per-001': 72,
  'adl-001': 65,
  'syd-003': 54,
  'syd-005': 48,
  'mel-002': 43,
  'bri-002': 38,
  'per-002': 31,
  'mel-004': 27,
  'syd-004': 24,
  'syd-006': 19,
  'adl-002': 15,
  'bri-003': 12,
  'gc-002':   8,
  'mel-005':  6,
};

function readStored(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}'); } catch { return {}; }
}

/** Returns total views (seed + real) for a listing */
export function getViews(id: string): number {
  return (SEED_VIEWS[id] ?? 0) + (readStored()[id] ?? 0);
}

/** Increments real view count and returns new total */
export function incrementViews(id: string): number {
  const stored = readStored();
  stored[id] = (stored[id] ?? 0) + 1;
  localStorage.setItem(KEY, JSON.stringify(stored));
  return (SEED_VIEWS[id] ?? 0) + stored[id];
}

/** Returns all listing IDs sorted by total views descending */
export function getTopListingIds(n: number): string[] {
  const stored = readStored();
  const allIds = new Set([...Object.keys(SEED_VIEWS), ...Object.keys(stored)]);
  return [...allIds]
    .sort((a, b) => getViews(b) - getViews(a))
    .slice(0, n);
}
