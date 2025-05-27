// src/services/service-offered-as.mapper.ts
import { OfferedAsType } from '@/types/service-types';
import { Service } from '@/types/service-types';

export function determinePaymentOptionsBy(service: Service) {
  return [
    ...insertIf(!!service?.payment?.options?.pricingPlan, OfferedAsType.PRICING_PLAN),
    ...insertIf(!!service?.payment?.options?.inPerson, OfferedAsType.OFFLINE),
    ...insertIf(!!service?.payment?.options?.online, OfferedAsType.ONLINE),
  ];
}

export function mapServiceOfferedAsDto(service: Service) {
  return determinePaymentOptionsBy(service);
}

function insertIf(condition: boolean, ...elements: any) {
  return condition ? elements : [];
}