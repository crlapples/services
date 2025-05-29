// src/app/account/my-plans/page.tsx
import MyAccountSection from 'app/components/MyAccount/MyAccountSection';
import getAuthSession from 'lib/auth';
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


  return (
    <>
      <h2 className="text-highlight text-4xl">My Plans</h2>
      <div className="text-sm font-open-sans-condensed py-2">
        <p className="pt-2">View and manage the subscriptions you have purchased</p>
      </div>
      <div className="border-t border-white border-opacity-[0.04] mt-14"></div>
        <div className="py-12 text-center font-open-sans-condensed">
          <div className="mb-3">
            {"You haven't purchased any subscriptions yet."}
          </div>
          <a href="/plans" className="text-sm text-highlight underline">
            View Plans & Pricing
          </a>
        </div>
        </>
  );
}