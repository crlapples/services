// src/services/service.mapper.ts
import { formatDuration, intervalToDuration } from 'date-fns';
import { Service, ServiceInfoViewModel, MediaItem, ServiceOfferedAs, ServicePaymentDetails } from 'lib/service-types';

export function mapServiceInfo(service?: Service): ServiceInfoViewModel | null {
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

export function mapServicePayment(service: Service): { offeredAs: ServiceOfferedAs; paymentDetails: ServicePaymentDetails } {
  return {
    offeredAs: mapServiceOfferedAsDto(service),
    paymentDetails: mapServicePaymentDto(service),
  };
}

export function mapServiceOfferedAsDto(service: Service): ServiceOfferedAs {
  return {
    online: service.payment?.options?.online ?? false,
    inPerson: service.payment?.options?.inPerson ?? false,
    pricingPlan: service.payment?.options?.pricingPlan ?? false,
  };
}

export function mapServicePaymentDto(service: Service): ServicePaymentDetails {
  return {
    rateType: service.payment?.rateType,
    price: service.payment?.fixed?.price,
    defaultPrice: service.payment?.varied?.defaultPrice,
    deposit: service.payment?.varied?.deposit,
    minPrice: service.payment?.varied?.minPrice,
    maxPrice: service.payment?.varied?.maxPrice,
    customDescription: service.payment?.custom?.description,
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