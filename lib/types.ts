export type ListingType =
  | 'private room' | 'whole apartment' | 'whole house' | 'studio' | 'shared room'
  | 'master room' | 'second room' | 'study room' | 'sunny room' | 'living room' | 'self-contained';

export const LANGUAGES = [
  'English',
  'Mandarin', 'Cantonese',
  'Hindi', 'Punjabi', 'Tamil', 'Bengali', 'Urdu', 'Sinhalese', 'Nepali',
  'Tagalog', 'Vietnamese', 'Korean', 'Japanese', 'Thai', 'Indonesian', 'Malay',
  'Arabic',
  'Italian', 'Greek', 'German', 'French', 'Spanish', 'Portuguese',
];

export interface Listing {
  id: string;
  title: string;
  type: ListingType;
  location: {
    state: string;
    city: string;
    suburb: string;
    postcode: string;
    address: string;
    country: string;
  };
  rent: {
    amount: number;
    currency: string;
    period: 'week' | 'month';
  };
  inclusions: string[];
  bedrooms: number;
  bathrooms: number;
  currentOccupants: number;
  totalCapacity: number;
  furnished: 'furnished' | 'unfurnished';
  facilities: string[];
  roomFeatures?: string[];
  roomCategories?: string[];
  languages?: string[];
  preferredNationality: string[];
  preferredGender: 'male' | 'female' | 'any';
  petsAllowed: boolean;
  smokingAllowed: boolean;
  availableFrom: string;
  minimumStay: string;
  stayType?: 'short term' | 'long term' | 'both';
  rules?: string[];
  nearbyPlaces?: NearbyPlace[];
  images: string[];
  description: string;
  status?: 'active' | 'taken' | 'expired';
  postedBy: {
    name: string;
    type: 'owner' | 'agent' | 'current tenant';
    responseTime: string;
    verified: boolean;
  };
  postedAt: string;
  featured?: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'available-soon' | 'available-later';

export interface SearchFilters {
  state?: string;
  city?: string;
  type?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  furnished?: string;
  nationality?: string;
  gender?: string;
  petsAllowed?: boolean;
  availableBy?: string;   // ISO date YYYY-MM-DD — show listings available on or before this date
  language?: string;
  query?: string;
  sort?: SortOption;
}

export interface AustralianState {
  name: string;
  abbr: string;
  cities: string[];
}

export const AUSTRALIAN_STATES: AustralianState[] = [
  { name: 'New South Wales',          abbr: 'NSW', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Wagga Wagga'] },
  { name: 'Victoria',                 abbr: 'VIC', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton'] },
  { name: 'Queensland',               abbr: 'QLD', cities: ['Brisbane', 'Gold Coast', 'Cairns', 'Sunshine Coast', 'Townsville', 'Toowoomba'] },
  { name: 'Western Australia',        abbr: 'WA',  cities: ['Perth', 'Fremantle', 'Mandurah', 'Bunbury', 'Geraldton'] },
  { name: 'South Australia',          abbr: 'SA',  cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Augusta'] },
  { name: 'Tasmania',                 abbr: 'TAS', cities: ['Hobart', 'Launceston', 'Devonport', 'Burnie'] },
  { name: 'Australian Capital Territory', abbr: 'ACT', cities: ['Canberra'] },
  { name: 'Northern Territory',       abbr: 'NT',  cities: ['Darwin', 'Alice Springs', 'Katherine'] },
];

export const STATES = AUSTRALIAN_STATES.map((s) => s.abbr);

// Kept for backwards-compat (city filter in filter panel)
export const CITIES = AUSTRALIAN_STATES.flatMap((s) => s.cities);

// Specific room types shown in the post form dropdown
export const PROPERTY_TYPES = [
  'master room', 'second room', 'study room', 'sunny room', 'living room', 'studio',
] as const;

// Broad living arrangement categories (checklist in post form)
export const ROOM_CATEGORIES_LIST = ['Private', 'Shared', 'Whole unit', 'Self-contained'] as const;

export const ROOM_FEATURES_LIST = [
  'Ensuite', 'Balcony', 'Partition', 'Bunk bed', 'Single bed', 'Double bed',
  'Heater', 'Air conditioning', 'Male only', 'Female only', 'Mixed gender',
];

export const ROOM_TERMS_LIST = [
  'Own key', '2 weeks bond', '2 weeks move out notice',
];

export const HOUSE_RULES_LIST = [
  // Guests & visitors
  'No overnight guests',
  'Visitors by prior notice only',
  'No parties or events',
  // Noise & lifestyle
  'Quiet hours after 10pm',
  'No loud music',
  'Study-friendly environment',
  'Working professionals preferred',
  // Cleanliness
  'Clean kitchen after use',
  'Keep common areas tidy',
  'Weekly cleaning rotation',
  'No shoes inside',
  // Substances
  'No smoking indoors',
  'No drugs',
  'No alcohol',
  // Household
  'No food in bedrooms',
  'No pets',
  'Vegetarian household',
  'Halal household',
  'Bills split equally',
  '2 weeks notice to vacate',
  'No subletting without permission',
] as const;

export const INCLUSIONS_LIST = ['Electricity', 'Water', 'Gas', 'Internet', 'Netflix', 'Cleaning service', 'Council tax'];

export const FACILITIES_LIST = ['Parking', 'Gym', 'Pool', 'Air conditioning', 'Dishwasher', 'Washing machine', 'Balcony', 'Garden', 'Storage', 'Security'];

// Major immigrant nationalities in Australia (ABS top communities)
export const NATIONALITIES = [
  // Anglosphere
  'Australian', 'British', 'New Zealander', 'Irish', 'South African', 'American', 'Canadian',
  // East & South-East Asia
  'Chinese', 'Hong Konger', 'Taiwanese', 'Korean', 'Japanese', 'Filipino', 'Vietnamese',
  'Malaysian', 'Singaporean', 'Indonesian', 'Thai', 'Burmese',
  // South Asia
  'Indian', 'Sri Lankan', 'Nepalese', 'Bangladeshi', 'Pakistani',
  // Middle East & Central Asia
  'Afghan',
  // Europe
  'Italian', 'Greek', 'German', 'French', 'Spanish',
  // Latin America
  'Brazilian',
];

export type RoomType = ListingType;

export interface RenterProfile {
  userId: string;
  name: string;
  photo: string | null;           // base64 data URL or null
  age: number | null;
  nationality: string;
  aboutMe: string;
  // What I'm looking for
  preferredRoomTypes: RoomType[];
  preferredStates: string[];      // state abbrs e.g. ['NSW', 'VIC']
  preferredCities: string[];
  budgetMin: number | null;       // AUD/week
  budgetMax: number | null;       // AUD/week
  moveInDate: string | null;      // YYYY-MM-DD
  minimumStay: string;            // e.g. '3 months'
  preferredFacilities: string[];
  preferredStayType?: 'short term' | 'long term' | 'any';
  furnishedPreference: 'furnished' | 'unfurnished' | 'any';
  houseGenderPreference: 'male' | 'female' | 'any';
  petsOk: boolean;
  smokingOk: boolean;
  status?: 'active' | 'inactive';
  phone?: string;
  showPhone?: boolean;   // true = visible to everyone; false/undefined = sign-in required
  showEmail?: boolean;   // true = visible to everyone; false/undefined = sign-in required
  createdAt: string;
  updatedAt: string;
}

export interface RenterProfileFilters {
  state?: string;
  maxBudget?: number;
  availableBy?: string;   // ISO date — renters whose moveInDate <= this
  roomType?: string;
  nationality?: string;
  sort?: 'newest' | 'oldest';
}

export const MIN_STAY_OPTIONS = ['1 month', '2 months', '3 months', '6 months', '12 months', 'Flexible'];

export interface NearbyPlace {
  type: string;
  distance: string; // e.g. "5 min walk", "10 min drive", "500m"
}

export const NEARBY_PLACE_TYPES: { type: string; emoji: string }[] = [
  { type: 'Supermarket', emoji: '🛒' },
  { type: 'Train station', emoji: '🚉' },
  { type: 'Bus stop', emoji: '🚌' },
  { type: 'Tram stop', emoji: '🚋' },
  { type: 'University / TAFE', emoji: '🎓' },
  { type: 'School', emoji: '🏫' },
  { type: 'Hospital / Clinic', emoji: '🏥' },
  { type: 'Gym', emoji: '💪' },
  { type: 'Park', emoji: '🌳' },
  { type: 'Shopping centre', emoji: '🛍️' },
  { type: 'Pharmacy', emoji: '💊' },
  { type: 'Café / Restaurant', emoji: '☕' },
  { type: 'Airport', emoji: '✈️' },
  { type: 'Beach', emoji: '🏖️' },
];
