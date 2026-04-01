export interface Listing {
  id: string;
  title: string;
  type: 'private room' | 'whole apartment' | 'whole house' | 'studio' | 'shared room';
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
  furnished: 'furnished' | 'unfurnished' | 'partially furnished';
  facilities: string[];
  preferredNationality: string[];
  preferredGender: 'male' | 'female' | 'any';
  petsAllowed: boolean;
  smokingAllowed: boolean;
  availableFrom: string;
  minimumStay: string;
  images: string[];
  description: string;
  postedBy: {
    name: string;
    type: 'owner' | 'agent' | 'current tenant';
    responseTime: string;
    verified: boolean;
  };
  postedAt: string;
  featured?: boolean;
}

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
  query?: string;
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

export const PROPERTY_TYPES = ['private room', 'whole apartment', 'whole house', 'studio', 'shared room'] as const;

export const INCLUSIONS_LIST = ['Electricity', 'Water', 'Gas', 'Internet', 'Netflix', 'Cleaning service', 'Council tax'];

export const FACILITIES_LIST = ['Parking', 'Gym', 'Pool', 'Air conditioning', 'Dishwasher', 'Washing machine', 'Balcony', 'Garden', 'Storage', 'Security'];

export const NATIONALITIES = [
  'Afghan', 'American', 'Australian', 'Bangladeshi', 'British', 'Brazilian',
  'Canadian', 'Chinese', 'Filipino', 'French', 'German', 'Indian', 'Indonesian',
  'Irish', 'Italian', 'Japanese', 'Korean', 'Malaysian', 'Nepalese', 'New Zealander',
  'Pakistani', 'Singaporean', 'South African', 'Spanish', 'Sri Lankan',
  'Taiwanese', 'Thai', 'Vietnamese',
];

export type RoomType = 'private room' | 'whole apartment' | 'whole house' | 'studio' | 'shared room';

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
  furnishedPreference: 'furnished' | 'unfurnished' | 'any';
  houseGenderPreference: 'male' | 'female' | 'any';
  petsOk: boolean;
  smokingOk: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RenterProfileFilters {
  state?: string;
  maxBudget?: number;
  availableBy?: string;   // ISO date — renters whose moveInDate <= this
  roomType?: string;
  nationality?: string;
}

export const MIN_STAY_OPTIONS = ['1 month', '2 months', '3 months', '6 months', '12 months', 'Flexible'];
