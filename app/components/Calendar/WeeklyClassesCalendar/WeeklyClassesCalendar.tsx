'use client';
import { Dropdown, Checkbox, Spinner } from 'flowbite-react';
import { useMemo, useState } from 'react';
import {
  addDays,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import ClassSlot from './WeeklyCalendarSections/ClassSlot';
import { useLocalAvailability } from '@app/hooks/useAvailability';
import { slotsToSortedSlotsViewModel } from '../calendar.view-model';
import type { SlotAvailability, CalendarAvailability } from 'lib/calendar-availability';
import { SlotViewModel } from '../calendar.view-model';

type WeeklyCalendarProps = {
  classes: { id: string; name: string }[];
};

const formatRangeHeader = (date: Date): string => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  return isSameMonth(weekStart, weekEnd)
    ? format(date, 'MMMM yyyy')
    : `${format(weekStart, 'MMM')} - ${format(weekEnd, 'MMM yyyy')}`;
};

function WeeklyClassesCalendarView({ classes }: WeeklyCalendarProps) {
  const today = startOfToday();
  const [filteredServices, setFilteredServices] = useState<Set<{ id: string; name: string }>>(new Set());
  const [selectedDate, setSelectedDate] = useState(today);
  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);
  
  const { data: weekSlots, isLoading } = useLocalAvailability();
  const [redirecting, setRedirecting] = useState(false);

  const slotsPerDay: { currDate: Date; slotsForDay: SlotViewModel[] }[] = useMemo(() => {
    const slotsViewModelPerDay = slotsToSortedSlotsViewModel(
      classes,
      weekSlots?.availabilityEntries
    )?.reduce((map, currSlot) => {
      const slotDate = currSlot.slotDate.getTime();
      const slots = map.get(slotDate) ?? [];
      slots.push(currSlot);
      map.set(slotDate, slots);
      return map;
    }, new Map<number, SlotViewModel[]>());
    
    return new Array(7).fill(null).map((_, index) => {
      const currDate = addDays(weekStart, index);
      const slotsForDay = slotsViewModelPerDay?.get(currDate.getTime()) ?? [];
      return { currDate, slotsForDay };
    });
  }, [weekSlots, classes, weekStart]);

  const checkoutSlot = (slot: SlotAvailability) => {
    setRedirecting(true);
    // Implement your checkout logic here
    console.log('Proceeding to checkout with slot:', slot);
    // Simulate redirect
    setTimeout(() => setRedirecting(false), 2000);
  };

  return (
    <div className="flex flex-col items-center font-open-sans-condensed text-stone-300">
      <Dropdown
        label={
          <>
            <span className="text-sm">Filter by:</span>
            <span className="text-base ml-6">
              Service (
              {filteredServices.size === 0
                ? 'All'
                : filteredServices.size === 1
                ? filteredServices.values().next().value?.name
                : filteredServices.size}
              )
            </span>
          </>
        }
        inline
        trigger="click"
      >
        <section className="p-4 min-w-fit">
          {classes.map((classSrv) => {
            const { id, name } = classSrv;
            return (
              <div className="flex items-center gap-2" key={id}>
                <Checkbox
                  checked={filteredServices.has(classSrv)}
                  id={id}
                  onChange={() => {
                    const newFilter = new Set(filteredServices);
                    if (newFilter.has(classSrv)) {
                      newFilter.delete(classSrv);
                    } else {
                      newFilter.add(classSrv);
                    }
                    setFilteredServices(newFilter);
                  }}
                />
                <label
                  htmlFor={id}
                  className="font-open-sans-condensed text-white text-lg"
                >
                  {name}
                </label>
              </div>
            );
          })}
        </section>
      </Dropdown>
      
      <section className="pt-12 flex gap-8 justify-between sm:justify-center w-full px-2">
        <button
          aria-label="previous week"
          onClick={() => setSelectedDate(addDays(selectedDate, -7))}
        >
          {'〱'}
        </button>
        <div className="w-36 text-center text-sm">
          {formatRangeHeader(selectedDate)}
        </div>
        <button
          className="rotate-180"
          aria-label="next week"
          onClick={() => setSelectedDate(addDays(selectedDate, 7))}
        >
          {'〱'}
        </button>
      </section>
      
      <section className="w-full grid grid-cols-7 pt-4 mb-4 sm:mb-0">
        {slotsPerDay.map(({ currDate, slotsForDay }, index) => (
          <div className="text-center w-full relative" key={index}>
            <button
              type="button"
              className={`w-full ${
                isSameDay(today, currDate) ? 'text-highlight' : ''
              }`}
              onClick={() => setSelectedDate(currDate)}
            >
              <div className="text-lg sm:text-xs mb-4 sm:mb-0">
                {format(currDate, 'EEE')}
              </div>
              <div
                className={`text-lg sm:text-sm relative sm:before:hidden w-10 h-10 sm:h-8 leading-10 sm:leading-6 mx-auto ${
                  slotsForDay?.length
                    ? 'before:absolute before:bg-highlight before:dot-md-center'
                    : ''
                } ${
                  isSameDay(selectedDate, currDate)
                    ? 'max-sm:bg-highlight max-sm:text-white'
                    : ''
                }`}
              >
                {format(currDate, 'dd')}
              </div>
            </button>
          </div>
        ))}
      </section>
      
      <section className="w-full sm:grid sm:grid-cols-7 mb-8">
        <div className="sm:hidden pb-4">
          <span>{format(selectedDate, 'EEEE, MMMM dd')}</span>
        </div>
        {slotsPerDay.map(({ currDate, slotsForDay }, index) => {
          return isLoading || redirecting ? null : (
            <div
              key={index}
              className={`outline outline-1 outline-stone-400/[.5] ml-px animate-pulse-once ${
                isSameDay(selectedDate, currDate)
                  ? 'w-full min-h-[220px]'
                  : 'max-sm:hidden'
              }`}
            >
              {slotsForDay?.length ? (
                slotsForDay.map((slot, index) => (
                  <div
                    key={index}
                    className="w-full border-b border-stone-400/[.5] box-border -mb-px"
                  >
                    <ClassSlot
                      slot={slot}
                      onSelect={(slot) => checkoutSlot(slot.slotAvailability)}
                    />
                  </div>
                ))
              ) : (
                <div className="h-52 sm:h-full bg-gray-c2 flex justify-center items-center text-stone-400">
                  No classes
                </div>
              )}
            </div>
          );
        })}
      </section>
      
      <section>
        {isLoading ? (
          <div className="w-full flex items-center justify-center h-24">
            <Spinner color="gray" />
          </div>
        ) : redirecting ? (
          <div className="animate-pulse w-full flex items-center justify-center h-24">
            Redirecting to Checkout
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default function WeeklyClassesCalendar(props: WeeklyCalendarProps) {
  return <WeeklyClassesCalendarView {...props} />;
}