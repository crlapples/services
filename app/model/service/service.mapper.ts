// src/services/service.mapper.ts
import { formatDuration, intervalToDuration } from 'date-fns';
import { Service, OfferedAsType } from 'lib/service-types';
import { Image } from 'lib/image-types';
import { mapServicePaymentDto, ServicePaymentDto } from './service-payment.mapper';
import { mapServiceOfferedAsDto } from './service-offered-as.mapper';

export interface ServiceInfoViewModel {
  id: string;
  scheduleId?: string;
  info: {
    name: string;
    description?: string;
    tagLine?: string;
    media: {
      mainMedia?: Image;
      coverMedia?: Image;
      otherMediaItems?: Image[];
    };
    formattedDuration?: string;
  };
  slug: string;
  type: string;
  categoryId: string;
  categoryName: string;
  payment: {
    offeredAs: OfferedAsType[];
    paymentDetails: ServicePaymentDto;
  };
}

export function mapServiceInfo(service?: Service): ServiceInfoViewModel | null {
  if (!service) {
    return null;
  }

  const mainMedia = service.mainMedia ?? service.otherMediaItems?.[0];
  const coverMedia = service.mainMedia ?? service.otherMediaItems?.[0];
  const otherMediaItems = service.otherMediaItems?.filter((item) => !!item);
  const serviceDuration = getDuration(service);

  return {
    id: service.id,
    scheduleId: service.schedule?.id,
    info: {
      name: service.name,
      description: service.description,
      tagLine: service.tagLine,
      media: {
        mainMedia,
        coverMedia,
        otherMediaItems,
      },
      formattedDuration: serviceDuration ? formatDuration(serviceDuration) : '',
    },
    slug: service.slug,
    type: service.type,
    categoryId: service.category.id,
    categoryName: service.category.name,
    payment: {
      offeredAs: mapServiceOfferedAsDto(service),
      paymentDetails: mapServicePaymentDto(service),
    },
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