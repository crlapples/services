// calendar.view-model.ts
import { format, startOfDay } from 'date-fns';
import type { SlotAvailability, CalendarAvailability } from 'lib/calendar-availability';

export type SlotViewModel = {
  slotDate: Date;
  formattedTime: string;
  slotAvailability: SlotAvailability;
  serviceName: string;
};

const TIME_FORMAT = 'hh:mm a';

const formatSlot = (slotAvailability: SlotAvailability) =>
  format(new Date(slotAvailability.slot.startDate), TIME_FORMAT);

export const slotsToSortedSlotsViewModel = (
  services: { id: string; name: string }[],
  slots?: SlotAvailability[]
): SlotViewModel[] | undefined => {
  const serviceNameMap = services.reduce((map, curr) => {
    map.set(curr.id, curr.name);
    return map;
  }, new Map<string, string>());
  
  return slots
    ?.sort(
      (dayDataA, dayDataB) =>
        new Date(dayDataA.slot.startDate).getTime() -
        new Date(dayDataB.slot.startDate).getTime()
    )
    .map((slotData) => ({
      slotDate: startOfDay(new Date(slotData.slot.startDate)),
      formattedTime: formatSlot(slotData),
      slotAvailability: slotData,
      serviceName: serviceNameMap.get(slotData.slot.serviceId || '') || 'Unknown Service',
    }));
};