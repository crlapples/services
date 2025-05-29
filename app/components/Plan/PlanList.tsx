// src/components/Plan/PlansList.tsx
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-3">
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
  const formattedPrice = formatPrice(plan.pricing.price);
  const subscription = plan.pricing.subscription
    ? `${plan.pricing.subscription.cycleDuration.count} ${plan.pricing.subscription.cycleDuration.unit.toLowerCase()}`
    : '';

  return (
    <div className="border-2 border-gray-c2 p-4 rounded-none text-white">
      {plan.images && plan.images[0] && (
        <MediaImage media={plan.images[0]} width={640} height={480} />
      )}
      <h2 className="text-xl font-bold mt-4">{plan.name}</h2>
      <p className="text-sm mt-2">{plan.description}</p>
      <p className="text-lg mt-2">{formattedPrice}{subscription ? ` / ${subscription}` : ''}</p>
      <ul className="mt-2 list-disc pl-5">
        {plan.perks.values.map((perk, index) => (
          <li key={index} className="text-sm">{perk}</li>
        ))}
      </ul>
      <a
        href={`/checkout/plan/${plan._id}${checkoutData ? `?data=${encodeURIComponent(checkoutData)}` : ''}`}
        className="block mt-4 bg-highlight text-white text-center p-2"
      >
        Purchase Plan
      </a>
    </div>
  );
}