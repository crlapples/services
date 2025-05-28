// types/calendar-availability.d.ts
export interface Resource {
    id: string;
    name: string;
  }
  
  export interface Location {
    id: string;
    name: string;
  }
  
  export interface Slot {
    startDate: string;
    endDate: string;
    resource?: Resource;
    location?: Location;
    serviceId?: string;
  }
  
  export interface BookingPolicyViolations {
    tooLateToBook?: boolean;
    tooEarlyToBook?: boolean;
  }
  
  export interface SlotAvailability {
    slot: Slot;
    bookable: boolean;
    bookingPolicyViolations: BookingPolicyViolations | null;
  }
  
  export interface CalendarAvailability {
    availabilityEntries: SlotAvailability[];
  }