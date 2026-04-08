export type EventCategory =
  | 'Social'
  | 'Food & Drink'
  | 'Sports'
  | 'Arts & Culture'
  | 'Music'
  | 'Markets'
  | 'Community'
  | 'Study & Career'
  | 'Games & Fun'
  | 'Other';

export interface EventListing {
  id: string;
  title: string;
  category: EventCategory;
  state: string;
  suburb: string;
  venue?: string;
  date: string; // ISO date string
  endDate?: string;
  time?: string; // "7:00 PM"
  priceType: 'Free' | 'Paid';
  price?: number;
  description: string;
  organizer: string;
  contactEmail: string;
  link?: string;
  postedByName: string;
  postedAt: string;
  status: 'active' | 'cancelled' | 'completed';
  postLanguage?: string;
}

export const SEED_EVENTS: EventListing[] = [
  {
    id: 'evt-001',
    title: 'International Student Mixer — Spring Social',
    category: 'Social',
    state: 'VIC',
    suburb: 'Melbourne CBD',
    venue: 'Rooftop Bar, Federation Square',
    date: '2026-04-19T19:00:00.000Z',
    time: '7:00 PM',
    priceType: 'Free',
    description: 'A chill social gathering for international students and new migrants. Meet new people, share your story, find housemates. Free drinks for first 50. All nationalities welcome!',
    organizer: 'Melbourne International Student Network',
    contactEmail: 'events@misnaustralia.com',
    postedByName: 'Tom B.',
    postedAt: '2026-04-01T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'evt-002',
    title: 'Weekend Artisan Food Market',
    category: 'Markets',
    state: 'NSW',
    suburb: 'Surry Hills',
    venue: 'Shannon Reserve, Surry Hills',
    date: '2026-04-20T09:00:00.000Z',
    endDate: '2026-04-21T15:00:00.000Z',
    time: '9:00 AM – 3:00 PM',
    priceType: 'Free',
    description: '80+ stalls featuring local produce, street food, handmade crafts, and vintage clothing. Live music from 11am. Dog-friendly. Free entry. Grab your coffee, browse, and enjoy the community vibes.',
    organizer: 'Surry Hills Community Market Collective',
    contactEmail: 'markets@surryhills.org.au',
    postedByName: 'Emma P.',
    postedAt: '2026-04-02T08:00:00.000Z',
    status: 'active',
  },
  {
    id: 'evt-003',
    title: 'Korean BBQ Night — Bring Friends',
    category: 'Food & Drink',
    state: 'VIC',
    suburb: 'Box Hill',
    venue: 'Gogi House KBBQ Restaurant',
    date: '2026-04-18T18:30:00.000Z',
    time: '6:30 PM',
    priceType: 'Paid',
    price: 35,
    description: '한국인 및 K-컬처 좋아하는 분들 모두 환영! 테이블 예약 필요. 1인 $35 (무한리필 고기+쌀밥 포함). 소주/맥주 별도. 선착순 20명. 카카오로 연락주세요.',
    organizer: 'Box Hill Korean Community',
    contactEmail: 'kbbqnight.boxhill@gmail.com',
    link: 'https://www.instagram.com/',
    postedByName: 'Minji P.',
    postedAt: '2026-04-03T11:00:00.000Z',
    status: 'active',
    postLanguage: 'Korean',
  },
  {
    id: 'evt-004',
    title: 'Flatmate Find & Coffee Chat',
    category: 'Community',
    state: 'QLD',
    suburb: 'South Brisbane',
    venue: 'Blackstar Coffee Roasters',
    date: '2026-04-26T10:00:00.000Z',
    time: '10:00 AM',
    priceType: 'Free',
    description: 'Looking for a flatmate or want to move out for the first time? Join our casual coffee morning. Bring your questions, meet potential housemates, and chat with locals who know the Brisbane rental market.',
    organizer: 'FlatmateFind Brisbane Community',
    contactEmail: 'brisbane@flatmatefind.com.au',
    postedByName: 'Lisa H.',
    postedAt: '2026-04-04T09:00:00.000Z',
    status: 'active',
  },
  {
    id: 'evt-005',
    title: 'Futsal Tournament — Open Teams',
    category: 'Sports',
    state: 'NSW',
    suburb: 'Ultimo',
    venue: 'Sydney Indoor Sports Centre',
    date: '2026-04-27T13:00:00.000Z',
    time: '1:00 PM',
    priceType: 'Paid',
    price: 20,
    description: 'Open futsal tournament, 5-a-side. Any skill level welcome — just show up and have fun! Register solo or as a team (max 6 per team). $20/person includes 3 guaranteed games. Trophy for winners.',
    organizer: 'Sydney Kicks FC',
    contactEmail: 'sydneykicks.futsal@gmail.com',
    postedByName: 'Carlos M.',
    postedAt: '2026-04-05T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'evt-006',
    title: 'Resume & LinkedIn Workshop for Internationals',
    category: 'Study & Career',
    state: 'VIC',
    suburb: 'Carlton',
    venue: 'Carlton Library, Meeting Room 2',
    date: '2026-04-22T18:00:00.000Z',
    time: '6:00 PM – 8:00 PM',
    priceType: 'Free',
    description: 'Free workshop tailored for international students and new migrants entering the Australian job market. Learn to write an Aussie-style resume, optimise LinkedIn, and ace interviews. Bring your laptop. Limited to 25 spots.',
    organizer: 'Carlton Migrant Resource Centre',
    contactEmail: 'workshop@carltonmrc.org.au',
    postedByName: 'Grace O.',
    postedAt: '2026-04-05T14:00:00.000Z',
    status: 'active',
  },
  {
    id: 'evt-007',
    title: 'Board Game Night — All Welcome',
    category: 'Games & Fun',
    state: 'WA',
    suburb: 'Northbridge',
    venue: 'Northbridge Community Hub',
    date: '2026-04-25T18:30:00.000Z',
    time: '6:30 PM',
    priceType: 'Free',
    description: 'Casual board game night every Friday. We have 50+ games — Catan, Ticket to Ride, Codenames, Pandemic, and more. Bring your own if you like! BYO snacks. Perfect for making new friends.',
    organizer: 'Perth Boardgamers Meetup',
    contactEmail: 'perthboardgames@gmail.com',
    postedByName: 'Amber K.',
    postedAt: '2026-04-06T10:00:00.000Z',
    status: 'active',
  },
];
