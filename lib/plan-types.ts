// src/types/plan.ts
import { Image } from 'lib/image-types';

export interface Plan {
  _id: string;
  name: string;
  description: string;
  pricing: {
    price: {
      value: number;
      currency: string;
    };
    subscription?: {
      cycleDuration: {
        count: number;
        unit: 'DAY' | 'MONTH' | 'YEAR';
      };
    };
    singlePaymentUnlimited?: boolean;
    singlePaymentForDuration?: {
      count: number;
      unit: 'DAY' | 'MONTH' | 'YEAR';
    } | null;
  };
  perks: {
    values: string[];
  };
  images?: Image[];
}

export interface PlanOrder {
  _id: string;
  planId: string;
  memberId: string;
  status: 'ACTIVE' | 'CANCELED' | 'PENDING';
  createdAt: string;
}