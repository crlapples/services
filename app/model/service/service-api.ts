// src/services/service-api.ts
import { Service, ServiceInfoViewModel, ServiceType } from 'lib/service-types';
import { mapServiceInfo } from './service.mapper';
import { safeCall } from 'app/model/utils';

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Sample Service',
    type: ServiceType.INDIVIDUAL,
    category: { id: 'cat1', name: 'Category 1' },
    mainSlug: { name: 'sample-service' },
    media: {
      mainMedia: { id: 'm1', url: 'https://example.com/image.jpg' },
      items: [{ id: 'm1', url: 'https://example.com/image.jpg' }],
    },
    schedule: { id: 's1', availabilityConstraints: { sessionDurations: [30] } },
    payment: { rateType: 'FIXED', fixed: { price: { value: '100', currency: 'USD' } } },
  },
];

export const safeGetServices = async (
  options: {
    limit?: number;
    categoryId?: string;
    types?: string[];
  } = {}
): Promise<{ services: ServiceInfoViewModel[] }> => {
  const result = await safeCall<{ services: ServiceInfoViewModel[] }>(
    () => getServices(options),
    { services: [] },
    'Query Services'
  );
  return result.data || { services: [] };
};

export const getServices = async (
  {
    limit = 100,
    categoryId = '',
    types = undefined as string[] | undefined,
  } = {}
): Promise<{ services: ServiceInfoViewModel[] }> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  let services = [...mockServices];
  if (categoryId) {
    services = services.filter(service => service.category.id === categoryId);
  }
  if (types) {
    services = services.filter(service => types.includes(service.type));
  }
  return {
    services: services
      .slice(0, limit)
      .map(mapServiceInfo)
      .filter((item): item is ServiceInfoViewModel => item !== null),
  };
};

export const getServiceBySlug = async (
  serviceSlug: string
): Promise<{
  data: ServiceInfoViewModel | null;
  hasError: boolean;
  errorMsg?: string;
}> => {
  const result = await safeCall<ServiceInfoViewModel | null>(
    async () => {
      const service = mockServices.find(
        s => s.mainSlug.name === decodeURIComponent(serviceSlug)
      );
      return mapServiceInfo(service);
    },
    null,
    'Get Service By Slug'
  );
  return {
    data: result.data,
    hasError: result.hasError,
    errorMsg: result.errorMsg,
  };
};

export const getServiceById = async (
  serviceId: string
): Promise<{
  data: ServiceInfoViewModel | null;
  hasError: boolean;
  errorMsg?: string;
}> => {
  const result = await safeCall<ServiceInfoViewModel | null>(
    async () => {
      const service = mockServices.find(s => s.id === serviceId);
      return mapServiceInfo(service);
    },
    null,
    'Get Service By Id'
  );
  return {
    data: result.data,
    hasError: result.hasError,
    errorMsg: result.errorMsg,
  };
};