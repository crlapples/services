// src/components/BookingActions.tsx
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Tooltip } from 'flowbite-react';
import { Booking, BookingStatus, AllowedActions } from 'lib/booking-types';
import { cancelBooking } from 'lib/bookings-api';

export type BookingActionsProps = {
  booking: Pick<Booking, 'id' | 'revision' | 'status'>;
  serviceId?: string;
  allowedActions?: AllowedActions;
  showCancelOption: boolean;
};

function ActionWithDisableTooltip({
  children,
  action,
  tooltipMsg,
  onAction,
}: {
  action: boolean;
  tooltipMsg: string;
  onAction: React.MouseEventHandler;
} & React.PropsWithChildren) {
  return action ? (
    <button onClick={onAction}>{children}</button>
  ) : (
    <Tooltip style="light" content={tooltipMsg}>
      <span className="opacity-20">{children}</span>
    </Tooltip>
  );
}

export default function BookingActions({
  booking,
  serviceId,
  allowedActions,
  showCancelOption,
}: BookingActionsProps) {
  const [error, setError] = useState('');
  const { data: session } = useSession();

  const onCancel = async () => {
    try {
      setError('');
      await cancelBooking(session, booking);
      window.location.reload();
    } catch (e) {
      console.error(e);
      setError('Failed to cancel booking');
    }
  };

  const onBookAgain = () => {
    if (serviceId) {
      window.location.href = `/service/by-id/${serviceId}`;
    }
  };

  return error ? (
    <span className="text-red-600">{error}</span>
  ) : (
    <div className="text-highlight flex gap-2 underline text-sm">
      {showCancelOption && booking.status !== BookingStatus.CANCELED && (
        <ActionWithDisableTooltip
          action={!!allowedActions?.cancel}
          tooltipMsg="This booking cannot be cancelled online anymore, please contact support"
          onAction={onCancel}
        >
          Cancel
        </ActionWithDisableTooltip>
      )}
      <ActionWithDisableTooltip
        action={!!serviceId}
        tooltipMsg="This service is not bookable anymore"
        onAction={onBookAgain}
      >
        More Details
      </ActionWithDisableTooltip>
    </div>
  );
}