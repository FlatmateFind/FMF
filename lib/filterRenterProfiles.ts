import { RenterProfile, RenterProfileFilters } from './types';

export function filterRenterProfiles(
  profiles: RenterProfile[],
  filters: RenterProfileFilters
): RenterProfile[] {
  return profiles.filter((p) => {
    // State: include if renter has no preference OR their list includes this state
    if (filters.state) {
      if (p.preferredStates.length > 0 && !p.preferredStates.includes(filters.state)) return false;
    }

    // Max budget: include if renter has no max OR their max is within the filter
    if (filters.maxBudget) {
      if (p.budgetMax !== null && p.budgetMax > filters.maxBudget) return false;
    }

    // Available by: include renters whose move-in date is on or before the filter date
    if (filters.availableBy) {
      if (p.moveInDate !== null && p.moveInDate > filters.availableBy) return false;
    }

    // Room type: include if renter has no preference OR their list includes this type
    if (filters.roomType) {
      if (
        p.preferredRoomTypes.length > 0 &&
        !p.preferredRoomTypes.includes(filters.roomType as RenterProfile['preferredRoomTypes'][number])
      ) return false;
    }

    // Nationality: exact match
    if (filters.nationality && p.nationality !== filters.nationality) return false;

    return true;
  });
}
