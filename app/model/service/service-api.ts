// src/services/service-api.ts
import { Service, ServiceInfoViewModel } from '@/types/service-types';
import { mapServiceInfo } from './service.mapper';
import { safeCall } from './utils';

// Mock data source - replace with your actual data source (API, database, etc.)
const mockServices: Service[] = [
  // Your service data here matching the Service interface
];

export const safeGetServices = async (
  options: {
    limit?: number;
    categoryId?: string;
    types?: string[];
  } = {}
): Promise<{ services: ServiceInfoViewModel[] }> => {
  return safeCall(
    () => getServices(options),
    { services: [] },
    'Query Services'
  );
};

export const getServices = async (
  {
    limit = 100,
    categoryId = '',
    types = undefined as string[] | undefined,
  } = {}
): Promise<{ services: ServiceInfoViewModel[] }> => {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let services = [...mockServices];
  
  if (categoryId) {
    services = services.filter(service => service.category.id === categoryId);
  }
  
  if (types) {
    services = services.filter(service => types.includes(service.type));
  }
  
  return {
    services: services.slice(0, limit).map(mapServiceInfo) as ServiceInfoViewModel[],
  };
};

export const getServiceBySlug = async (
  serviceSlug: string
): Promise<{
  data: ServiceInfoViewModel | null;
  hasError: boolean;
  errorMsg?: string;
}> => {
  return safeCall(
    () => {
      const service = mockServices.find(
        s => s.mainSlug.name === decodeURIComponent(serviceSlug)
      );
      return service ? mapServiceInfo(service) : null;
    },
    null,
    'Get Service By Slug'
  );
};

export const getServiceById = async (
  serviceId: string
): Promise<{
  data: ServiceInfoViewModel | null;
  hasError: boolean;
  errorMsg?: string;
}> => {
  return safeCall(
    () => {
      const service = mockServices.find(s => s.id === serviceId);
      return service ? mapServiceInfo(service) : null;
    },
    null,
    'Get Service By Id'
  );
};