// src/app/account/my-plans/page.tsx
import MyAccountSection from 'app/components/MyAccount/MyAccountSection';
import getAuthSession from 'lib/auth';
import { getMyPlanOrders } from 'app/model/paid-plans/paid-plans-api';
import { format } from 'date-fns';
import PlanOrderActions from 'app/components/MyAccount/PricingPlans/PlanOrderActions';
import { getCurrentMember } from 'app/model/members/members-api';
import { redirect } from 'next/navigation';

const DATE_FORMAT = 'MMM dd, yyyy';

const formatDate = (date: Date) => format(new Date(date), DATE_FORMAT);

export default async function MyPlansPage() {
  const session = await getAuthSession();
  if (!session?.userId) {
    redirect('/auth/signin');
  }

  const [{ data: planOrders }, { member }] = await Promise.all([
    getMyPlanOrders(session),
    getCurrentMember(session),
  ]);

  return (
    <MyAccountSection member={member}>
      <h2 className="text-highlight text-4xl">My Plans</h2>
      <div className="text-sm font-open-sans-condensed py-2">
        <p className="pt-2">View and manage the subscriptions you have purchased</p>
      </div>
      <div className="border-t border-white border-opacity-[0.04] mt-14"></div>
      {planOrders?.length ? (
        planOrders?.map((order, index) => (
          <div
            key={order.id}
            className="flex flex-wrap gap-5 py-6 border-b border-white border-opacity-30 hover:border-opacity-80 font-open-sans-condensed text-sm"
          >
            <div key={order.id}>{order.planName}</div>
            <div>
              <span>Valid: {formatDate(new Date(order!.startDate!))}</span>
              {order!.endDate ? (
                <span> - {formatDate(new Date(order!.endDate))}</span>
              ) : null}
            </div>
            <div>{order.status}</div>
            <div className="ml-auto">
              <PlanOrderActions planOrder={{ id: order.id }} />
            </div>
          </div>
      ))): (
        <div className="py-12 text-center font-open-sans-condensed">
          <div className="mb-3">
            {"You haven't purchased any subscriptions yet."}
          </div>
          <a href="/plans" className="text-sm text-highlight underline">
            View Plans & Pricing
          </a>
        </div>
      )}
    </MyAccountSection>
  );
}