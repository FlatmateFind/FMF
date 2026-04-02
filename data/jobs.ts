export type JobType = 'Full-time' | 'Part-time' | 'Casual' | 'Contract' | 'Remote' | 'Internship';

export interface JobPost {
  id: string;
  title: string;
  company?: string;
  type: JobType;
  state: string;
  suburb: string;
  salary?: string;
  description: string;
  contactEmail: string;
  postedByName: string;
  postedByRole: 'renter' | 'subletter';
  postedAt: string;
  status: 'active' | 'closed';
}

export const SEED_JOBS: JobPost[] = [
  {
    id: 'job-001',
    title: 'Barista / Café All-Rounder',
    company: 'The Daily Grind',
    type: 'Part-time',
    state: 'VIC',
    suburb: 'Fitzroy',
    salary: '$25–28/hr',
    description: 'Looking for an experienced barista for morning shifts (6am–2pm), Mon–Fri. Must have at least 1 year café experience. Latte art a plus. Friendly, fast-paced environment.',
    contactEmail: 'hire@dailygrind.com.au',
    postedByName: 'Tom W.',
    postedByRole: 'subletter',
    postedAt: '2026-04-01T08:00:00.000Z',
    status: 'active',
  },
  {
    id: 'job-002',
    title: 'Delivery Driver — Food & Grocery',
    company: 'QuickDrop AU',
    type: 'Casual',
    state: 'NSW',
    suburb: 'Newtown',
    salary: '$22/hr + tips',
    description: 'Flexible casual delivery shifts available 7 days. Must have valid licence, own reliable vehicle, and smartphone. ABN required. Great extra income for students or housemates.',
    contactEmail: 'drivers@quickdropau.com',
    postedByName: 'Sarah M.',
    postedByRole: 'renter',
    postedAt: '2026-03-31T10:30:00.000Z',
    status: 'active',
  },
  {
    id: 'job-003',
    title: 'Retail Sales Assistant',
    company: 'Urban Threads',
    type: 'Part-time',
    state: 'NSW',
    suburb: 'Surry Hills',
    salary: '$24/hr',
    description: 'Boutique clothing store seeking a friendly sales assistant for weekends + 2 weekdays. Experience in retail preferred but not required. Must be available Sat & Sun.',
    contactEmail: 'jobs@urbanthreads.com.au',
    postedByName: 'Emma T.',
    postedByRole: 'subletter',
    postedAt: '2026-03-30T14:00:00.000Z',
    status: 'active',
  },
  {
    id: 'job-004',
    title: 'Web Developer (React / Next.js)',
    company: 'Pixel Studio',
    type: 'Contract',
    state: 'VIC',
    suburb: 'South Yarra',
    salary: '$80–100/hr',
    description: '3-month contract for an experienced React/Next.js developer to join our small team. Remote-friendly. Must be Australian resident with ABN. Portfolio required.',
    contactEmail: 'dev@pixelstudio.com.au',
    postedByName: 'James K.',
    postedByRole: 'subletter',
    postedAt: '2026-03-29T09:15:00.000Z',
    status: 'active',
  },
  {
    id: 'job-005',
    title: 'House Cleaner — Residential',
    type: 'Casual',
    state: 'QLD',
    suburb: 'Fortitude Valley',
    salary: '$28–32/hr',
    description: 'Reliable cleaner needed for weekly residential cleans in inner Brisbane. Own transport preferred. 3–5 hours per clean. Regular, ongoing work. Immediate start available.',
    contactEmail: 'cleaning@brisbhomes.com.au',
    postedByName: 'Maria R.',
    postedByRole: 'renter',
    postedAt: '2026-03-28T16:00:00.000Z',
    status: 'active',
  },
  {
    id: 'job-006',
    title: 'Customer Support Specialist',
    company: 'SupportHive',
    type: 'Remote',
    state: 'NSW',
    suburb: 'Remote (anywhere)',
    salary: '$55,000–65,000/yr',
    description: 'Join our remote-first support team. Handle customer queries via email and chat. Must be fluent in English, have reliable internet, and be available during AEST business hours. 6-month probation.',
    contactEmail: 'talent@supporthive.io',
    postedByName: 'David L.',
    postedByRole: 'subletter',
    postedAt: '2026-03-27T11:00:00.000Z',
    status: 'active',
  },
  {
    id: 'job-007',
    title: 'Kitchen Hand / Dishwasher',
    company: 'Sokō Japanese Kitchen',
    type: 'Casual',
    state: 'VIC',
    suburb: 'Richmond',
    salary: '$21.50/hr',
    description: 'Busy Japanese restaurant looking for a reliable kitchen hand for evening shifts (5pm–10pm). 3–4 nights per week. No experience necessary — full training provided.',
    contactEmail: 'work@sokokitchen.com.au',
    postedByName: 'Hana K.',
    postedByRole: 'renter',
    postedAt: '2026-03-26T13:45:00.000Z',
    status: 'active',
  },
  {
    id: 'job-008',
    title: 'Marketing Intern — Social Media',
    company: 'Bloom Agency',
    type: 'Internship',
    state: 'NSW',
    suburb: 'Pyrmont',
    salary: 'Unpaid + course credit',
    description: 'Seeking a motivated marketing intern to assist with social content, scheduling, and analytics. 2–3 days per week. Ideal for students completing a marketing or comms degree.',
    contactEmail: 'intern@bloomagency.com.au',
    postedByName: 'Lena V.',
    postedByRole: 'renter',
    postedAt: '2026-03-25T09:30:00.000Z',
    status: 'active',
  },
];
