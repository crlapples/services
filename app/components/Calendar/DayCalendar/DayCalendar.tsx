// DayCalendar.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { 
  addMonths,
  endOfDay,
  startOfDay,
  startOfMonth,
  isSameDay,
  format,
  formatISO,
} from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Spinner } from 'flowbite-react';
import CalendarSlots from 'app/components/Calendar/DayCalendar/DayCalendarSections/CalendarSlots';
import CalendarSidebar from 'app/components/Calendar/DayCalendar/DayCalendarSections/CalendarSidebar';
import { slotsToSortedSlotsViewModel } from 'app/components/Calendar/calendar.view-model';
import { useLocalAvailability } from 'app/hooks/useAvailability';
import { SlotViewModel } from 'app/components/Calendar/calendar.view-model';

type CalendarDateRange = { from: string; to: string };

const getCalendarMonthRangeForDate = (date: Date): CalendarDateRange => {
  return {
    from: formatISO(startOfMonth(date)),
    to: formatISO(startOfMonth(addMonths(date, 3))),
  };
};

export function CalendarView({ service }: { service: { id: string; name: string; duration: string; payment: any } }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [dateRange, setDateRange] = useState<CalendarDateRange>(
    getCalendarMonthRangeForDate(selectedDate!)
  );
  
  const { data: dayData, isLoading: isDayDataLoading } = useLocalAvailability();

  useEffect(() => {
    setDateRange(getCalendarMonthRangeForDate(selectedDate!));
    setSelectedTime('');
  }, [selectedDate]);

  const slotsMap: { [key: string]: SlotViewModel[] } = useMemo(() => {
    return (
      slotsToSortedSlotsViewModel(
        [{ id: service?.id, name: service?.name }],
        dayData?.availabilityEntries
      )?.reduce<{
        [key: string]: SlotViewModel[];
      }>((acc, curr) => {
        const slotsArr = acc[curr.formattedTime] ?? [];
        slotsArr[curr.slotAvailability.bookable ? 'unshift' : 'push'](curr);
        acc[curr.formattedTime] = slotsArr;
        return acc;
      }, {}) ?? {}
    );
  }, [dayData, service]);

  const showLoader = isDayDataLoading;

  return (
    <div className="flex flex-wrap">
      <div className="m-6 max-w-full flex-grow">
        <div className="border-b pb-2">
          <h2 className="text-2xl text-white">Select a Date and Time</h2>
        </div>
        <div className="flex flex-wrap gap-x-6 min-w-fit">
          <section className="mt-2">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date?: Date) => date && setSelectedDate(date)}
              onMonthChange={setSelectedDate}
              showOutsideDays
              fixedWeeks
              month={startOfMonth(selectedDate)}
            />
          </section>
          <section className="flex-1 w-60 max-w-full font-open-sans-condensed text-lg">
            <div className="mt-4">{format(selectedDate, 'EEEE, d MMMM')}</div>
            {showLoader ? (
              <div className="w-full h-36 flex items-center justify-center">
                <Spinner color="gray" />
              </div>
            ) : dayData?.availabilityEntries?.length ? (
              <div className="grid grid-cols-auto-sm gap-2 pt-4">
                <CalendarSlots
                  slots={Object.keys(slotsMap)
                    .map((slotTime) => slotsMap[slotTime][0])}
                  selectedTime={selectedTime}
                  onTimeSelected={setSelectedTime}
                />
              </div>
            ) : (
              <div className="pt-4">No availability</div>
            )}
          </section>
        </div>
      </div>
      <section className="m-6 w-52 flex-grow">
        <CalendarSidebar
          service={service}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          slotsForTime={slotsMap[selectedTime] ?? []}
        />
      </section>
    </div>
  );
}

export default function DayCalendar({
  service,
}: {
  service: { id: string; name: string; duration: string; payment: any };
}) {
  return (
    <div className="w-full h-36 flex items-center justify-center">
      <CalendarView service={service} />
    </div>
  );
}