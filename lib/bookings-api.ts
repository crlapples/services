// src/services/bookings-api.ts
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Session } from 'next-auth';
import { Booking, BookingStatus } from 'lib/booking-types';

export const cancelBooking = async (session: Session | null, booking: Pick<Booking, 'id' | 'revision'>): Promise<void> => {
  if (!session?.userId) {
    throw new Error('Unauthorized: No user session found');
  }

  try {
    const db = getFirestore();
    const bookingRef = doc(db, 'bookings', booking.id);
    const updateData: Partial<Booking> = {
      status: BookingStatus.CANCELED,
      updatedAt: new Date().toISOString(),
    };
    if (booking.revision) {
      updateData.revision = (parseInt(booking.revision) + 1).toString();
    }
    await updateDoc(bookingRef, updateData);
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw new Error('Failed to cancel booking');
  }
};