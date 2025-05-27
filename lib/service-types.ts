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