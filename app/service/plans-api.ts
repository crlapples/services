// src/services/plans-api.ts
import { Plan } from 'lib/plan-types';
import plansData from 'lib/plans.json';

export const getPlans = async ({
  planIds,
}: {
  planIds?: string[];
} = {}): Promise<{ data: Plan[] }> => {
  try {
    let plans: Plan[] = plansData as Plan[];

    if (planIds && planIds.length > 0) {
      plans = plans.filter((plan) => planIds.includes(plan._id));
    }

    return { data: plans };
  } catch (error) {
    console.error('Error fetching plans:', error);
    return { data: [] };
  }
};