// src/types/booking.ts
export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELED = 'CANCELED',
  }
  
  export interface Booking {
    _id: string;
    revision?: string; // Optional, for optimistic concurrency
    status: BookingStatus;
    planId?: string; // Links to Plan._id from plans.json
    serviceId?: string; // Links to Service.id from service-api.ts
    memberId: string; // Links to Member.id from member-api.ts
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AllowedActions {
    cancel?: boolean;
  }