// src/services/bookings-api.ts
import getAuthSession from 'lib/auth';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Booking, BookingStatus } from 'lib/booking-types';
import { getPlanById } from '@app/model/service/plans';

export interface ExtendedBooking {
  booking: Booking;
  allowedActions: {
    cancel?: boolean;
  };
}

export const getMyUpcomingBookings = async (): Promise<{ extendedBookings: ExtendedBooking[] }> => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) return { extendedBookings: [] };

    const db = getFirestore();
    const now = new Date().toISOString();
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('memberId', '==', session.userId),
      where('startDate', '>=', now),
      where('status', '==', BookingStatus.CONFIRMED),
      orderBy('startDate', 'asc')
    );

    const snapshot = await getDocs(bookingsQuery);
    const extendedBookings: ExtendedBooking[] = [];

    for (const doc of snapshot.docs) {
      const booking = { id: doc.id, ...doc.data() } as Booking;
      let title = booking.title;

      if (booking.planId) {
        const { data: plan } = await getPlanById(booking.planId);
        title = plan?.name || title;
      }

      extendedBookings.push({
        booking: { ...booking, title },
        allowedActions: {
          cancel: booking.status === BookingStatus.CONFIRMED,
        },
      });
    }

    return { extendedBookings };
  } catch (error) {
    console.error('Error fetching upcoming bookings:', error);
    return { extendedBookings: [] };
  }
};

export const getMyBookingHistory = async (): Promise<{ extendedBookings: ExtendedBooking[] }> => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) return { extendedBookings: [] };

    const db = getFirestore();
    const now = new Date().toISOString();
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('memberId', '==', session.userId),
      where('startDate', '<', now),
      orderBy('startDate', 'desc')
    );

    const snapshot = await getDocs(bookingsQuery);
    const extendedBookings: ExtendedBooking[] = [];

    for (const doc of snapshot.docs) {
      const booking = { id: doc.id, ...doc.data() } as Booking;
      let title = booking.title;

      if (booking.planId) {
        const { data: plan } = await getPlanById(booking.planId);
        title = plan?.name || title;
      }

      extendedBookings.push({
        booking: { ...booking, title },
        allowedActions: {
          cancel: false,
        },
      });
    }

    return { extendedBookings };
  } catch (error) {
    console.error('Error fetching booking history:', error);
    return { extendedBookings: [] };
  }
};