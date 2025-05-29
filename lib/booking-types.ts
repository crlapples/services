export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

export interface Booking {
  id: string;
  revision?: string;
  status: BookingStatus;
  planId?: string;
  serviceId: string;
  memberId: string;
  createdAt: string;
  startDate: string;
  title?: string;
  slot: {
    startDateTime: string;
    duration: number; // In minutes
  };
}
  
  export interface AllowedActions {
    cancel?: boolean;
  }