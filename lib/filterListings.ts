import { listings } from '@/data/listings';
import { SearchFilters, Listing } from './types';

export function filterListings(filters: SearchFilters): Listing[] {
  return listings.filter((listing) => {
    // Exclude taken/expired listings from search results
    if (listing.status === 'taken' || listing.status === 'expired') return false;
    if (filters.state && listing.location.state.toUpperCase() !== filters.state.toUpperCase()) return false;
    if (filters.city && listing.location.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.minRent && listing.rent.amount < filters.minRent) return false;
    if (filters.maxRent && listing.rent.amount > filters.maxRent) return false;
    if (filters.bedrooms && listing.bedrooms < filters.bedrooms) return false;
    if (filters.furnished && listing.furnished !== filters.furnished) return false;
    if (filters.nationality && filters.nationality !== 'any') {
      if (listing.preferredNationality.length > 0 && !listing.preferredNationality.includes(filters.nationality)) return false;
    }
    if (filters.gender && filters.gender !== 'any') {
      if (listing.preferredGender !== 'any' && listing.preferredGender !== filters.gender) return false;
    }
    if (filters.petsAllowed === true && !listing.petsAllowed) return false;
    // Available by: listing must be available on or before the requested date
    if (filters.availableBy && listing.availableFrom > filters.availableBy) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const searchable = `${listing.title} ${listing.location.city} ${listing.location.suburb} ${listing.location.postcode} ${listing.location.address} ${listing.description}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

export function getListingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function getSimilarListings(listing: Listing, count = 3): Listing[] {
  return listings
    .filter((l) => l.id !== listing.id && (l.location.city === listing.location.city || l.type === listing.type))
    .slice(0, count);
}
