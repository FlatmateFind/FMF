export type BusinessCategory =
  | 'Café'
  | 'Restaurant'
  | 'Retail'
  | 'Food & Bev'
  | 'Service'
  | 'Online'
  | 'Franchise'
  | 'Other';

export interface BusinessListing {
  id: string;
  name: string;
  category: BusinessCategory;
  state: string;
  suburb: string;
  askingPrice: number;
  weeklyRevenue?: number;
  leaseMonthsRemaining?: number;
  employees?: number;
  established?: number;
  reasonForSelling?: string;
  description: string;
  contactEmail: string;
  postedByName: string;
  postedAt: string;
  status: 'active' | 'sold' | 'paused';
  postLanguage?: string;
}

export const SEED_BUSINESSES: BusinessListing[] = [
  {
    id: 'biz-001',
    name: 'Morning Ritual Café',
    category: 'Café',
    state: 'VIC',
    suburb: 'Fitzroy',
    askingPrice: 95000,
    weeklyRevenue: 8500,
    leaseMonthsRemaining: 36,
    employees: 4,
    established: 2019,
    reasonForSelling: 'Relocating overseas',
    description: 'Thriving specialty coffee café in the heart of Fitzroy. Established loyal customer base with strong breakfast and lunch trade. Fully fitted kitchen, 2 Synesso machines, 24 seats inside + 8 outdoor. Training included.',
    contactEmail: 'sell@morningritual.com.au',
    postedByName: 'Sarah T.',
    postedAt: '2026-04-01T09:00:00.000Z',
    status: 'active',
  },
  {
    id: 'biz-002',
    name: 'Lucky Noodle House',
    category: 'Restaurant',
    state: 'NSW',
    suburb: 'Haymarket',
    askingPrice: 145000,
    weeklyRevenue: 14000,
    leaseMonthsRemaining: 48,
    employees: 6,
    established: 2017,
    reasonForSelling: 'Owner retiring',
    description: 'Busy 60-seat noodle restaurant in Chinatown precinct with strong dinner and weekend trade. Full commercial kitchen, liquor licence, POS system. Average 400 covers/week.',
    contactEmail: 'luckynoodlehouse.au@gmail.com',
    postedByName: 'James L.',
    postedAt: '2026-04-02T11:00:00.000Z',
    status: 'active',
  },
  {
    id: 'biz-003',
    name: 'TechFix Mobile Repairs',
    category: 'Service',
    state: 'QLD',
    suburb: 'South Brisbane',
    askingPrice: 42000,
    weeklyRevenue: 3200,
    leaseMonthsRemaining: 24,
    employees: 2,
    established: 2021,
    description: 'Phone and laptop repair shop with steady walk-in trade. Includes all tools, stock (~$8k), customer database, and supplier accounts. Simple to run — ideal for tech-savvy buyer.',
    contactEmail: 'techfix.brisbane@outlook.com',
    postedByName: 'Mike D.',
    postedAt: '2026-04-03T08:30:00.000Z',
    status: 'active',
  },
  {
    id: 'biz-004',
    name: 'Bloom Florist & Gift Studio',
    category: 'Retail',
    state: 'WA',
    suburb: 'Leederville',
    askingPrice: 68000,
    weeklyRevenue: 5200,
    leaseMonthsRemaining: 30,
    employees: 3,
    established: 2018,
    reasonForSelling: 'Health reasons',
    description: 'Charming florist with gift and homewares range. Strong corporate accounts (events, weekly office deliveries). Includes cold room, van, and all fittings. Instagram following of 6.2k.',
    contactEmail: 'bloomperth@gmail.com',
    postedByName: 'Linda F.',
    postedAt: '2026-04-04T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'biz-005',
    name: 'CleanPro Residential Services',
    category: 'Service',
    state: 'NSW',
    suburb: 'Surry Hills',
    askingPrice: 35000,
    weeklyRevenue: 4800,
    employees: 5,
    established: 2020,
    reasonForSelling: 'Moving interstate',
    description: 'Profitable cleaning business with 40+ regular residential clients and 5 end-of-lease contracts per month. Includes branded van, supplies, 2 contractors with ABNs. Fully systemised with scheduling app.',
    contactEmail: 'cleanpro.sell@gmail.com',
    postedByName: 'Anna V.',
    postedAt: '2026-04-05T14:00:00.000Z',
    status: 'active',
  },
  {
    id: 'biz-006',
    name: '珍珠奶茶専門店',
    category: 'Food & Bev',
    state: 'VIC',
    suburb: 'Box Hill',
    askingPrice: 78000,
    weeklyRevenue: 9200,
    leaseMonthsRemaining: 42,
    employees: 4,
    established: 2022,
    description: '人気のバブルティーショップ。Box Hillショッピングセンター内。毎週末は行列ができる繁盛店。全設備付き。引き継ぎサポートあり。',
    contactEmail: 'bubbletea.boxhill@gmail.com',
    postedByName: 'Mei C.',
    postedAt: '2026-04-06T09:00:00.000Z',
    status: 'active',
    postLanguage: 'Japanese',
  },
];
