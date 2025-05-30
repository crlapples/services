// src/app/account/my-bookings/page.tsx
'use client'

import MyAccountSection from 'app/components/MyAccount/MyAccountSection';
import getAuthSession from 'lib/auth';
import {
  getMyBookingHistory,
  getMyUpcomingBookings,
} from 'app/model/bookings/bookings-api';
import { useFormattedTimezone } from 'app/hooks/useFormattedTimezone';
import BookingActions from 'app/components/MyAccount/Bookings/BookingActions';
import { format } from 'date-fns';
import { getCurrentMember } from 'app/model/members/members-api';
import { redirect } from 'next/navigation';

const DATE_TIME_FORMAT = 'MMM dd, yyyy, h:mm a';

const formatDateAndTime = (date: Date) => format(new Date(date), DATE_TIME_FORMAT);

enum SelectedView {
  UPCOMING = 'UPCOMING',
  HISTORY = 'HISTORY',
}

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const session = await getAuthSession();
  if (!session?.userId) {
    redirect('/auth/signin');
  }

  const timezoneStr = useFormattedTimezone();

  return (
    <>
      <h2 className="text-highlight text-4xl">Manage Your Bookings</h2>
      <div className="text-sm font-open-sans-condensed py-2">
        <p className="pt-2">View, cancel your bookings and easily book again.</p>
        <p className="pt-2">Timezone: {timezoneStr}</p>
      </div>
      <nav className="text-center sm:text-left font-open-sans-condensed text-highlight my-2 border-b border-white border-opacity-[0.04]">
        {[
          { name: 'Upcoming', value: SelectedView.UPCOMING },
          { name: 'History', value: SelectedView.HISTORY },
        ].map(({ name, value }) => (
          <a
            key={value}
            className={`w-20 sm:w-28 inline-block text-center py-4 border-b-[3px] border-opacity-60`}
            href={`?view=${value}`}
          >
            {name}
          </a>
        ))}
      </nav>
        <div className="py-12 text-center font-open-sans-condensed">
          <div className="mb-3">{"You've got nothing booked at the moment."}</div>
          <a href="/classes-schedule" className="text-sm text-highlight underline">
            Check Out Our Classes
          </a>
        </div>
        
</>
  );
}