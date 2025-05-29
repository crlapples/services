// src/services/plans-api.ts
import { Plan } from 'lib/plan-types';
import plansData from 'lib/plans.json';

export const getPlans = async ({
  limit: maxResults = 10,
  planIds,
}: { limit?: number; planIds?: string[] } = {}): Promise<{ data: Plan[] }> => {
  try {
    let plans: Plan[] = plansData as Plan[];

    // Filter by planIds if provided
    if (planIds && planIds.length > 0) {
      plans = plans.filter((plan) => planIds.includes(plan._id));
    }

    // Apply limit
    plans = plans.slice(0, maxResults);

    return { data: plans };
  } catch (error) {
    console.error('Error fetching plans:', error);
    return { data: [] };
  }
};