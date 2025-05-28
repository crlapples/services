import calendarAvailability from 'lib/calendarAvailability.json';

// Define interfaces
interface AvailabilityEntry {
  slot: {
    startDate: string;
    endDate: string;
    resource: {
      id: string;
      name: string;
    };
    location?: {
      id: string;
      name: string;
    };
  };
  bookable: boolean;
  bookingPolicyViolations: { tooLateToBook?: boolean; alreadyBooked?: boolean } | null;
}

interface QueryAvailabilityResponse {
  availabilityEntries: AvailabilityEntry[];
}

interface Booking {
  id: string;
  userId: string;
  slot: AvailabilityEntry['slot'];
  createdAt: string;
}

// In-memory storage for availability and bookings
let availabilityData: QueryAvailabilityResponse = calendarAvailability;
let bookings: Booking[] = [];

// Utility to generate a simple UUID
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Get availability with filtering
export const getServiceAvailability = ({
  serviceId,
  from,
  to,
  timezone,
  slotsPerDay,
  limit,
}: {
  serviceId?: string | string[];
  from: string;
  to: string;
  timezone?: string;
  slotsPerDay?: number;
  limit?: number;
}): Promise<QueryAvailabilityResponse> => {
  let filteredEntries = availabilityData.availabilityEntries;

  // Filter by date range
  filteredEntries = filteredEntries.filter(entry => {
    const slotDate = new Date(entry.slot.startDate);
    return slotDate >= new Date(from) && slotDate <= new Date(to);
  });

  // Filter by serviceId if provided (assuming serviceId relates to resource.id)
  if (serviceId) {
    const serviceIds = Array.isArray(serviceId) ? serviceId : [serviceId];
    filteredEntries = filteredEntries.filter(entry =>
      serviceIds.includes(entry.slot.resource.id)
    );
  }

  // Apply limit if provided
  if (limit) {
    filteredEntries = filteredEntries.slice(0, limit);
  }

  // Sort by startTime (ascending)
  filteredEntries.sort((a, b) =>
    new Date(a.slot.startDate).getTime() - new Date(b.slot.startDate).getTime()
  );

  return Promise.resolve({ availabilityEntries: filteredEntries });
};

// Book a slot
export const bookSlot = ({
  userId,
  slotStartDate,
  slotEndDate,
  resourceId,
}: {
  userId: string;
  slotStartDate: string;
  slotEndDate: string;
  resourceId: string;
}): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
  // Find the slot in availability data
  const slotEntry = availabilityData.availabilityEntries.find(
    entry =>
      entry.slot.startDate === slotStartDate &&
      entry.slot.endDate === slotEndDate &&
      entry.slot.resource.id === resourceId
  );

  if (!slotEntry) {
    return Promise.resolve({ success: false, error: "Slot not found" });
  }

  if (!slotEntry.bookable) {
    return Promise.resolve({
      success: false,
      error: `Slot is not bookable: ${JSON.stringify(slotEntry.bookingPolicyViolations)}`
    });
  }

  // Create booking
  const booking: Booking = {
    id: generateId(),
    userId,
    slot: slotEntry.slot,
    createdAt: new Date().toISOString(),
  };

  // Add to bookings
  bookings.push(booking);

  // Update slot to be non-bookable
  slotEntry.bookable = false;
  slotEntry.bookingPolicyViolations = { alreadyBooked: true };

  return Promise.resolve({ success: true, booking });
};