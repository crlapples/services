// src/components/Plan/PlanList.tsx
import Link from 'next/link';
import { Plan } from 'lib/plan-types';
import MediaImage from 'app/components/Image/MediaImage';
import { formatPrice } from 'app/utils/price-formtter';

export default function PlansList({
  plans,
  checkoutData,
}: {
  plans: Plan[];
  checkoutData?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 px-3">
      {plans.map((plan) => (
        <PlanCard key={plan._id} plan={plan} checkoutData={checkoutData} />
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  checkoutData,
}: {
  plan: Plan;
  checkoutData?: string;
}) {
  // This call is now valid because formatPrice accepts an options object
  const formattedPrice = formatPrice(plan.pricing.price, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="border-2 border-gray-c2 p-6 rounded-none text-white flex flex-col w-full md:w-1/3">
      {plan.images && plan.images[0] && (
        <MediaImage media={plan.images[0]} width={640} height={480} />
      )}
      
      <div className="text-center my-4">
        <p className="text-6xl font-bold">{formattedPrice}</p>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-4xl font-bold">{plan.name}</h2>
      </div>
      
      <p className="text-sm text-center mb-6">
        {plan.description} This is a monthly subscription.
      </p>
      
      <ul className="list-disc pl-5 space-y-2 mb-6 flex-grow">
        {plan.perks.values.map((perk, index) => (
          <li key={index} className="text-sm">{perk}</li>
        ))}
      </ul>
      
      <Link
        href={`/subscription?planId=${plan._id}`}
        className="block bg-highlight text-white text-center p-3 no-underline"
      >
        Select Plan
      </Link>
    </div>
  );
}