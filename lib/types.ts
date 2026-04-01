export interface Listing {
  id: string;
  title: string;
  type: 'private room' | 'whole apartment' | 'whole house' | 'studio' | 'shared room';
  location: {
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

export const CITIES = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'];

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
