// CalendarSidebar.tsx
'use client';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { SlotViewModel } from 'app/components/Calendar/calendar.view-model';
import { SlotAvailability } from 'lib/calendar-availability';

const CalendarSidebar = ({
  service,
  selectedDate,
  selectedTime,
  slotsForTime,
}: {
  service: { id: string; name: string; duration: string; payment: any };
  selectedDate: Date;
  selectedTime: string;
  slotsForTime: SlotViewModel[];
}) => {
  const [selectedSlot, setSelectedSlot] = useState<SlotAvailability | undefined>();
  
  const goToCheckout = useCallback(() => {
    // Implement your checkout logic here
    console.log('Proceeding to checkout with slot:', selectedSlot);
  }, [selectedSlot]);

  useEffect(() => {
    setSelectedSlot(
      slotsForTime?.length === 1
        ? slotsForTime?.[0]?.slotAvailability
        : undefined
    );
  }, [selectedTime, slotsForTime]);

  return (
    <>
      <div className="border-b pb-2">
        <h2 className="text-2xl text-white">Service Details</h2>
      </div>
      <section className="mt-4 font-open-sans-condensed text-lg">
        <div>{service.name}</div>
        <div>
          {format(selectedDate, 'd MMMM yyyy')}
          {selectedTime ? ' at ' + selectedTime : ''}
        </div>
        <section className="mt-1">
          <div>{service.duration}</div>
          <div>${service.payment?.price || '0'}</div>
          {slotsForTime.length > 1 ? (
            <>
              <label htmlFor="slot-options" className="mt-3 block">
                Please Select a Slot Option
              </label>
              <select
                value={selectedSlot ? undefined : ''}
                id="slot-options"
                className="block w-full p-2 pr-7 my-3 text-sm text-black border border-black rounded-none bg-white focus:ring-gray-700 focus:border-black"
                onChange={(e) =>
                  setSelectedSlot(
                    slotsForTime[e.target.value as unknown as number].slotAvailability
                  )
                }
              >
                <option disabled selected value="">
                  Please Select
                </option>
                {slotsForTime.map((slotOption, index) => (
                  <option
                    key={index}
                    disabled={!slotOption.slotAvailability.bookable}
                    value={index}
                  >
                    {`${
                      slotOption.slotAvailability.slot?.location?.name ?? ''
                    } with ${
                      slotOption.slotAvailability.slot?.resource?.name ?? ''
                    }`.trim()}
                  </option>
                ))}
              </select>
            </>
          ) : selectedSlot ? (
            <>
              <div>{selectedSlot.slot?.resource?.name}</div>
              <div>{selectedSlot.slot?.location?.name}</div>
            </>
          ) : null}
        </section>
        <div className="mt-7">
          <button
            disabled={!selectedSlot}
            className="btn-main w-full hover:bg-highlight hover:bg-opacity-50"
            onClick={goToCheckout}
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
};

export default CalendarSidebar;