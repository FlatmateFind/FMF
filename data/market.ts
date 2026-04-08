export type MarketKind = 'product' | 'service';

export type ProductCategory =
  | 'Electronics'
  | 'Food & Snacks'
  | 'Clothing'
  | 'Furniture'
  | 'Books & Study'
  | 'Vehicles'
  | 'Kitchen'
  | 'Sports & Fitness'
  | 'Other';

export type ServiceCategory =
  | 'Tax & Accounting'
  | 'Visa Help'
  | 'Removalist'
  | 'Cleaning'
  | 'Driving Lessons'
  | 'Tutoring'
  | 'Photography'
  | 'IT & Tech'
  | 'Beauty & Wellness'
  | 'Other';

export type ProductCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'For Parts';
export type PriceType = 'Fixed' | 'Negotiable' | 'Free' | 'Per Hour' | 'Contact';

export interface MarketListing {
  id: string;
  kind: MarketKind;
  title: string;
  category: ProductCategory | ServiceCategory;
  state: string;
  suburb: string;
  price: number;
  priceType: PriceType;
  condition?: ProductCondition;
  description: string;
  contactEmail: string;
  contactPhone?: string;
  postedByName: string;
  postedAt: string;
  status: 'active' | 'sold' | 'paused';
  postLanguage?: string;
}

export const SEED_MARKET: MarketListing[] = [
  {
    id: 'mkt-001',
    kind: 'product',
    title: 'MacBook Pro 14" M3 — 2023',
    category: 'Electronics',
    state: 'VIC',
    suburb: 'Melbourne CBD',
    price: 1800,
    priceType: 'Negotiable',
    condition: 'Like New',
    description: 'MacBook Pro 14" M3, 16GB RAM, 512GB SSD. Barely used, bought new in Oct 2023. No scratches. Original box and charger included. Selling as upgrading to M4.',
    contactEmail: 'macbook.sell@gmail.com',
    postedByName: 'Kevin T.',
    postedAt: '2026-04-01T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'mkt-002',
    kind: 'service',
    title: 'Tax Return Filing — All Visa Types',
    category: 'Tax & Accounting',
    state: 'NSW',
    suburb: 'Sydney CBD',
    price: 99,
    priceType: 'Fixed',
    description: 'Registered tax agent offering individual tax returns for all visa types: WHM, student, skilled, permanent resident. Includes ATO lodgement, maximise deductions. Online or in-person. Available July–Oct.',
    contactEmail: 'taxback.sydney@gmail.com',
    contactPhone: '0412 345 678',
    postedByName: 'Rachel K.',
    postedAt: '2026-04-02T09:00:00.000Z',
    status: 'active',
  },
  {
    id: 'mkt-003',
    kind: 'product',
    title: 'Japanese Snack Box — 20 items',
    category: 'Food & Snacks',
    state: 'VIC',
    suburb: 'Box Hill',
    price: 35,
    priceType: 'Fixed',
    condition: 'New',
    description: 'Assorted Japanese snacks imported from Japan — Pocky, KitKat flavours, Calbee chips, Hi-Chew, Meiji chocolates and more. 20 items per box. Pick up only from Box Hill.',
    contactEmail: 'jpsnacks.au@gmail.com',
    postedByName: 'Yuki M.',
    postedAt: '2026-04-02T14:00:00.000Z',
    status: 'active',
    postLanguage: 'Japanese',
  },
  {
    id: 'mkt-004',
    kind: 'service',
    title: 'Visa Application Help — Student & PR',
    category: 'Visa Help',
    state: 'QLD',
    suburb: 'Brisbane CBD',
    price: 150,
    priceType: 'Per Hour',
    description: 'Migration agent assistance with student visa (500), graduate visa (485), and skilled visa (189/190) applications. Document check, cover letter writing, and AOS/sponsorship guidance. Free 20-min initial consultation.',
    contactEmail: 'migration.help.brisbane@gmail.com',
    postedByName: 'David P.',
    postedAt: '2026-04-03T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'mkt-005',
    kind: 'product',
    title: 'IKEA MALM Queen Bed Frame + Mattress',
    category: 'Furniture',
    state: 'NSW',
    suburb: 'Newtown',
    price: 280,
    priceType: 'Negotiable',
    condition: 'Good',
    description: 'IKEA MALM bed frame (queen) in white + medium-firm mattress. 2 years old, no damage. Buyer must collect and disassemble. Available from 20 April.',
    contactEmail: 'ikea.malm.newtown@gmail.com',
    postedByName: 'Sophie R.',
    postedAt: '2026-04-03T12:00:00.000Z',
    status: 'active',
  },
  {
    id: 'mkt-006',
    kind: 'service',
    title: 'Student Removalist — Affordable Moving',
    category: 'Removalist',
    state: 'VIC',
    suburb: 'Carlton',
    price: 60,
    priceType: 'Per Hour',
    description: 'Affordable moving service for students and renters. 2-person team with van. Specialise in apartment and share house moves. Melbourne metro area. Short notice OK. No hidden fees.',
    contactEmail: 'studentmoves.mel@gmail.com',
    contactPhone: '0422 111 222',
    postedByName: 'Ben A.',
    postedAt: '2026-04-04T08:00:00.000Z',
    status: 'active',
  },
  {
    id: 'mkt-007',
    kind: 'service',
    title: 'Driving Lessons — Beginner Friendly',
    category: 'Driving Lessons',
    state: 'NSW',
    suburb: 'Parramatta',
    price: 75,
    priceType: 'Per Hour',
    description: 'Accredited driving instructor, 10+ years experience. Automatic and manual. Specialise in nervous beginners and overseas licence conversions. Flexible scheduling including weekends. Free pick-up within 5km.',
    contactEmail: 'drive.parramatta@gmail.com',
    contactPhone: '0433 555 666',
    postedByName: 'Chris W.',
    postedAt: '2026-04-04T09:30:00.000Z',
    status: 'active',
  },
  {
    id: 'mkt-008',
    kind: 'product',
    title: 'Samsung 65" 4K QLED TV',
    category: 'Electronics',
    state: 'WA',
    suburb: 'Perth CBD',
    price: 750,
    priceType: 'Fixed',
    condition: 'Good',
    description: 'Samsung 65" QLED 4K Smart TV (2022 model). Works perfectly, no dead pixels. Selling due to move. Remote and original stand included. Pick up only from Perth CBD.',
    contactEmail: 'tvperth.sell@gmail.com',
    postedByName: 'Omar H.',
    postedAt: '2026-04-05T11:00:00.000Z',
    status: 'active',
  },
  {
    id: 'mkt-009',
    kind: 'service',
    title: 'Math & Science Tutoring — HSC / IB',
    category: 'Tutoring',
    state: 'NSW',
    suburb: 'Chatswood',
    price: 55,
    priceType: 'Per Hour',
    description: 'UNSW engineering graduate offering Maths (Ext 1 & 2), Physics, and Chemistry tutoring for HSC and IB students. In-person or online. Group discounts available (2–3 students). Trial lesson $30.',
    contactEmail: 'tutor.chatswood@gmail.com',
    postedByName: 'Priya S.',
    postedAt: '2026-04-05T14:00:00.000Z',
    status: 'active',
  },
  {
    id: 'mkt-010',
    kind: 'product',
    title: '스킨케어 세트 — K-Beauty 10종',
    category: 'Other',
    state: 'VIC',
    suburb: 'Doncaster',
    price: 85,
    priceType: 'Fixed',
    condition: 'New',
    description: '한국에서 직접 가져온 K-뷰티 스킨케어 세트. COSRX, Laneige, Innisfree 포함. 새 제품, 미개봉. 도크체스터 픽업 또는 $10 택배 가능.',
    contactEmail: 'kbeauty.mel@naver.com',
    postedByName: 'Jisoo K.',
    postedAt: '2026-04-06T10:00:00.000Z',
    status: 'active',
    postLanguage: 'Korean',
  },
];
