// src/types/service-types.ts
export interface Service {
  id: string;
  name: string;
  description?: string;
  tagLine?: string;
  type: ServiceType;
  category: {
    id: string;
    name: string;
  };
  mainSlug: {
    name: string;
  };
  media?: {
    mainMedia?: MediaItem;
    coverMedia?: MediaItem;
    items?: MediaItem[];
  };
  schedule?: {
    id: string;
    availabilityConstraints?: {
      sessionDurations?: number[];
    };
  };
  payment?: ServicePayment;
}

export interface MediaItem {
  id: string;
  url: string;
  altText?: string;
  type?: 'image' | 'video';
}

export interface ServicePayment {
  rateType?: 'FIXED' | 'VARIED' | 'NO_FEE';
  fixed?: {
    price?: Money;
  };
  varied?: {
    defaultPrice?: Money;
    deposit?: Money;
    minPrice?: Money;
    maxPrice?: Money;
  };
  custom?: {
    description?: string;
  };
  options?: {
    pricingPlan?: boolean;
    inPerson?: boolean;
    online?: boolean;
  };
}

export interface Money {
  value: string;
  currency: string;
}

export enum ServiceType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
  COURSE = 'COURSE',
}

export enum OfferedAsType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PRICING_PLAN = 'PRICING_PLAN',
}

// Define interfaces for mapper return types
export interface ServiceOfferedAs {
  online?: boolean;
  inPerson?: boolean;
  pricingPlan?: boolean;
}

export interface ServicePaymentDetails {
  rateType?: 'FIXED' | 'VARIED' | 'NO_FEE';
  price?: Money;
  defaultPrice?: Money;
  deposit?: Money;
  minPrice?: Money;
  maxPrice?: Money;
  customDescription?: string;
}

export interface ServiceInfoViewModel {
  id: string;
  scheduleId?: string;
  info: {
    name: string;
    description?: string;
    tagLine?: string;
    media: {
      mainMedia?: MediaItem;
      otherMediaItems?: MediaItem[];
      coverMedia?: MediaItem;
    };
    formattedDuration: string;
  };
  slug: string;
  type: ServiceType;
  categoryId: string;
  categoryName: string;
  payment: {
    offeredAs: ServiceOfferedAs;
    paymentDetails: ServicePaymentDetails;
  };
}