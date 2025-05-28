import { Plan } from 'lib/plan-types';
import plansData from 'lib/plans.json';

// Cache plans in memory with 1 hour TTL
let cachedPlans: Plan[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000;

export const getPaidPlans = async (
  { limit = 100, planIds = undefined as string[] | undefined } = {}
): Promise<Plan[]> => {
  const now = Date.now();
  
  if (!cachedPlans || now - cacheTimestamp > CACHE_TTL) {
    cachedPlans = plansData as Plan[];
    cacheTimestamp = now;
  }

  let plans = [...cachedPlans];
  
  if (planIds?.length) {
    plans = plans.filter(plan => planIds.includes(plan._id));
  }
  
  return plans.slice(0, limit);
};

export const getPlanById = async (planId: string): Promise<Plan | undefined> => {
  const plans = await getPaidPlans();
  return plans.find(plan => plan._id === planId);
};