import PlansList from 'app/components/Plan/PlanList';
import { getPlans } from '../service/plans-api';
import testIds from 'app/utils/test-ids';

// Manually opt out static rendering
export const dynamic = 'force-dynamic';

export default async function PlansPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const { planIds, checkoutData } = searchParams ?? {};
  const { data: plans } = await getPlans({
    planIds: planIds ? planIds.split(',') : undefined,
  });

  return (
    <div className="max-w-full-content mx-auto pb-8">
      <div className="px-3 py-12" data-testid={testIds.PLANS_PAGE.HEADER}>
        <h1 className="text-center">Plans & Pricing</h1>
      </div>
      <PlansList plans={plans} checkoutData={checkoutData} />
    </div>
  );
}