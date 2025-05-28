// src/services/plans.ts (abridged)
import { Plan } from 'lib/plan-types';
import plansData from 'lib/plans.json';

const isValidImage = (data: any): boolean => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.url === 'string' &&
    (typeof data.alt === 'string' || data.alt === undefined) &&
    (typeof data.id === 'string' || data.id === undefined) &&
    (typeof data.width === 'number' || data.width === undefined) &&
    (typeof data.height === 'number' || data.height === undefined)
  );
};

const isValidPlan = (data: any): data is Plan => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data._id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.description === 'string' &&
    typeof data.pricing === 'object' &&
    typeof data.pricing.price === 'object' &&
    typeof data.pricing.price.value === 'number' &&
    typeof data.pricing.price.currency === 'string' &&
    typeof data.perks === 'object' &&
    Array.isArray(data.perks.values) &&
    (data.images === undefined ||
      (Array.isArray(data.images) && data.images.every(isValidImage)))
  );
};

const validatePlans = (data: any): Plan[] => {
  if (!Array.isArray(data)) {
    console.error('plans.json is not an array');
    return [];
  }
  const validPlans = data.filter(isValidPlan);
  if (validPlans.length !== data.length) {
    console.warn('Some plans in plans.json are invalid');
  }
  return validPlans;
};

let cachedPlans: Plan[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000;

export const getPaidPlans = async (
  { limit = 100, planIds = undefined as string[] | undefined } = {}
): Promise<{ data: Plan[]; hasError: boolean }> => {
  const now = Date.now();
  if (!cachedPlans || now - cacheTimestamp >= CACHE_TTL) {
    cachedPlans = validatePlans(plansData);
    cacheTimestamp = now;
  }
  let plans = [...cachedPlans];
  if (planIds?.length) {
    plans = plans.filter((plan) => planIds.includes(plan._id));
  }
  return {
    data: plans.slice(0, limit),
    hasError: false,
  };
};

export const getPlanById = async (
  planId: string
): Promise<{ data: Plan | undefined; hasError: boolean }> => {
  const { data: plans } = await getPaidPlans();
  const plan = plans.find((plan) => plan._id === planId);
  return {
    data: plan,
    hasError: !plan,
  };
};

export const getCheckoutUrl = (plan: Plan): string => {
  return `/checkout/${plan._id}`;
};