// src/services/service.mapper.ts
import { formatDuration, intervalToDuration } from 'date-fns';
import { Service, MediaItem, ServicePayment } from '@/types/service-types';
import { mapServiceOfferedAsDto } from './service-offered-as.mapper';
import { mapServicePaymentDto } from './service-payment.mapper';

export type ServiceInfoViewModel = NonNullable<
  ReturnType<typeof mapServiceInfo>
>;

export function mapServiceInfo(service?: Service) {
  if (!service) {
    return null;
  }
  
  let mainMedia = service?.media?.mainMedia ?? service?.media?.items?.[0];
  let coverMedia = service?.media?.coverMedia ?? service?.media?.items?.[0];
  let otherMediaItems = service?.media?.items?.filter((item) => !!item) as
    | MediaItem[]
    | undefined;
  
  const { name, description, tagLine, id } = service;
  const serviceDuration = getDuration(service);

  return {
    id,
    scheduleId: service?.schedule?.id,
    info: {
      name,
      description,
      tagLine,
      media: {
        mainMedia,
        otherMediaItems,
        coverMedia,
      },
      formattedDuration: serviceDuration ? formatDuration(serviceDuration) : '',
    },
    slug: service.mainSlug.name,
    type: service.type,
    categoryId: service.category.id,
    categoryName: service.category.name,
    payment: mapServicePayment(service),
  };
}

export function mapServicePayment(service: Service) {
  return {
    offeredAs: mapServiceOfferedAsDto(service),
    paymentDetails: mapServicePaymentDto(service),
  };
}

function getDuration(service?: Service) {
  return service?.schedule?.availabilityConstraints?.sessionDurations?.length
    ? intervalToDuration({
        start: 0,
        end: service.schedule.availabilityConstraints.sessionDurations[0] * 60 * 1000,
      })
    : undefined;
}