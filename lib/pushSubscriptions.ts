// ── In-memory push subscription store ────────────────────────────────────────
// For production, replace with a database (Vercel KV, Postgres, etc.)

export interface NotificationPreferences {
  // Listings
  suburbs: string[];          // e.g. ['Bondi', 'Surry Hills']
  budgetMin: number | null;
  budgetMax: number | null;
  roomTypes: string[];        // 'Private Room' | 'Shared Room' | 'Studio' | 'Entire Apartment'
  languages: string[];        // e.g. ['English', 'Mandarin']
  states: string[];           // e.g. ['NSW', 'VIC']
  // Find
  enableJobs: boolean;
  jobTypes: string[];         // 'Full-time' | 'Part-time' | 'Casual'
  enableBusiness: boolean;
  enableMarket: boolean;
  enableEvents: boolean;
  // Community
  enableCommunity: boolean;
}

export interface StoredSubscription {
  id: string;
  endpoint: string;
  keys: { auth: string; p256dh: string };
  preferences: NotificationPreferences;
  createdAt: string;
}

// Module-level store (persists within a single serverless function instance)
const store = new Map<string, StoredSubscription>();

export function saveSubscription(sub: StoredSubscription) {
  store.set(sub.endpoint, sub);
}

export function removeSubscription(endpoint: string) {
  store.delete(endpoint);
}

export function getSubscriptionByEndpoint(endpoint: string) {
  return store.get(endpoint) ?? null;
}

export function getAllSubscriptions(): StoredSubscription[] {
  return Array.from(store.values());
}

// Return subscriptions matching a given listing/job/event
export function getMatchingSubscriptions(
  type: 'listing' | 'job' | 'business' | 'market' | 'event' | 'community',
  meta: {
    suburb?: string;
    state?: string;
    price?: number;
    roomType?: string;
    language?: string;
    jobType?: string;
  }
): StoredSubscription[] {
  return getAllSubscriptions().filter(({ preferences: p }) => {
    if (type === 'listing') {
      if (p.suburbs.length && meta.suburb && !p.suburbs.some((s) => meta.suburb!.toLowerCase().includes(s.toLowerCase()))) return false;
      if (p.states.length && meta.state && !p.states.includes(meta.state)) return false;
      if (p.budgetMax != null && meta.price != null && meta.price > p.budgetMax) return false;
      if (p.budgetMin != null && meta.price != null && meta.price < p.budgetMin) return false;
      if (p.roomTypes.length && meta.roomType && !p.roomTypes.includes(meta.roomType)) return false;
      if (p.languages.length && meta.language && !p.languages.includes(meta.language)) return false;
      return true;
    }
    if (type === 'job') return p.enableJobs && (!p.jobTypes.length || !meta.jobType || p.jobTypes.includes(meta.jobType));
    if (type === 'business') return p.enableBusiness;
    if (type === 'market') return p.enableMarket;
    if (type === 'event') return p.enableEvents;
    if (type === 'community') return p.enableCommunity;
    return false;
  });
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  suburbs: [], budgetMin: null, budgetMax: null,
  roomTypes: [], languages: [], states: [],
  enableJobs: true, jobTypes: [],
  enableBusiness: false, enableMarket: false, enableEvents: true,
  enableCommunity: true,
};
