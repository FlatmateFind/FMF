export type TakeoverPropertyType = 'apartment' | 'unit' | 'house' | 'townhouse' | 'studio' | 'villa';
export type TakeoverFurnished = 'furnished' | 'unfurnished' | 'partial';

export interface TakeoverListing {
  id: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  propertyType: TakeoverPropertyType;
  bedrooms: number;
  bathrooms: number;
  rent: number;            // per week
  bond: number;            // total bond amount
  availableFrom: string;   // ISO date — when new tenant can move in
  leaseEndDate?: string;   // ISO date — when current lease ends (optional)
  agencyName?: string;
  agentOpenToNew: boolean; // has the agent confirmed they're open to new applicants?
  furnished: TakeoverFurnished;
  inclusions?: string[];   // e.g. fridge, washing machine, parking
  description: string;
  reasonForLeaving?: string;
  postLanguage?: string;
  contactName: string;
  contactEmail: string;
  postedAt: string;
  status: 'active' | 'filled' | 'closed';
  postedByUserId?: string;
  images: string[];
}

export const SEED_TAKEOVERS: TakeoverListing[] = [
  {
    id: 'to-001',
    suburb: 'Fitzroy',
    city: 'Melbourne',
    state: 'VIC',
    postcode: '3065',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    rent: 520,
    bond: 2080,
    availableFrom: '2026-05-01',
    leaseEndDate: '2026-10-31',
    agencyName: 'Ray White Fitzroy',
    agentOpenToNew: true,
    furnished: 'unfurnished',
    inclusions: ['Parking', 'Dishwasher', 'Air conditioning'],
    description: 'Lovely 2-bed apartment in the heart of Fitzroy. High ceilings, polished floorboards, balcony. Moving to Sydney for work — agent confirmed they are happy to do a new lease for the right tenant. 6 months remaining on current lease.',
    reasonForLeaving: 'Relocating interstate for work',
    contactName: 'Jessica T.',
    contactEmail: 'jessica.t@email.com',
    postedAt: '2026-04-02T09:00:00.000Z',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60'],
  },
  {
    id: 'to-002',
    suburb: 'Newtown',
    city: 'Sydney',
    state: 'NSW',
    postcode: '2042',
    propertyType: 'unit',
    bedrooms: 1,
    bathrooms: 1,
    rent: 480,
    bond: 1920,
    availableFrom: '2026-04-20',
    agencyName: 'McGrath Newtown',
    agentOpenToNew: true,
    furnished: 'furnished',
    inclusions: ['Fridge', 'Washing machine', 'Sofa & dining set', 'Internet ready'],
    description: 'Fully furnished 1-bed unit in Newtown, 5 min walk to King St cafes and restaurants. Completing postgrad studies and returning overseas. Everything stays — just bring your suitcase. Agent is professional and easy to deal with.',
    reasonForLeaving: 'Returning overseas after studies',
    contactName: 'Marcus L.',
    contactEmail: 'marcus.l@email.com',
    postedAt: '2026-04-01T14:00:00.000Z',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60'],
  },
  {
    id: 'to-003',
    suburb: 'South Brisbane',
    city: 'Brisbane',
    state: 'QLD',
    postcode: '4101',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    rent: 600,
    bond: 2400,
    availableFrom: '2026-05-15',
    leaseEndDate: '2027-01-14',
    agencyName: 'Place Estate Agents',
    agentOpenToNew: true,
    furnished: 'partial',
    inclusions: ['Built-in wardrobes', 'Secure parking', 'Gym access', 'Air conditioning'],
    description: 'Modern 2-bed 2-bath apartment with city views and rooftop pool. Brand new complex, perfect for professionals. Leaving to purchase property. Agent has been very accommodating — new lease available immediately.',
    reasonForLeaving: 'Buying a house',
    contactName: 'Sarah & Tom',
    contactEmail: 'sarahtom.qld@email.com',
    postedAt: '2026-03-30T10:30:00.000Z',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60'],
  },
  {
    id: 'to-004',
    suburb: 'Leederville',
    city: 'Perth',
    state: 'WA',
    postcode: '6007',
    propertyType: 'studio',
    bedrooms: 0,
    bathrooms: 1,
    rent: 295,
    bond: 1180,
    availableFrom: '2026-04-15',
    agencyName: 'Acton Inner West',
    agentOpenToNew: false,
    furnished: 'furnished',
    inclusions: ['All furniture', 'Kitchen appliances', 'Walking distance to café strip'],
    description: 'Cosy furnished studio in Leederville, one of Perth\'s most vibrant inner suburbs. Perfect for a solo professional or student. Note: agent prefers applicants to apply through normal process — I can put in a good word.',
    reasonForLeaving: 'Moving in with partner',
    contactName: 'Priya M.',
    contactEmail: 'priya.m@email.com',
    postedAt: '2026-03-28T08:00:00.000Z',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=60'],
  },
  {
    id: 'to-005',
    suburb: 'Surry Hills',
    city: 'Sydney',
    state: 'NSW',
    postcode: '2010',
    propertyType: 'townhouse',
    bedrooms: 3,
    bathrooms: 2,
    rent: 1100,
    bond: 4400,
    availableFrom: '2026-06-01',
    leaseEndDate: '2026-11-30',
    agencyName: 'BresicWhitney',
    agentOpenToNew: true,
    furnished: 'unfurnished',
    inclusions: ['Private courtyard', 'Parking x2', 'Internal laundry'],
    description: 'Stunning 3-bed terrace-style townhouse in Surry Hills. Ideal for a small family or group of professionals. Character home with modern kitchen. 8 months remaining. Agent is experienced with lease transfers — very smooth process.',
    reasonForLeaving: 'Family expanding, need more space',
    contactName: 'David & Erin K.',
    contactEmail: 'david.erin@email.com',
    postedAt: '2026-03-25T11:00:00.000Z',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60'],
  },
];
