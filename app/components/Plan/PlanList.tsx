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
  const formattedPrice = formatPrice(
    plan.pricing.price,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );

  return (
    // The background color is now hard-coded to a single color for all cards.
    <div className="border-2 border-gray-c2 p-6 rounded-none text-black flex flex-col w-full md:w-1/3 bg-red-300">
      {plan.images && plan.images[0] && (
        <MediaImage media={plan.images[0]} width={640} height={480} />
      )}
      
      {/* Section 1: Title */}
      <div className="text-center h-1/7 pt-4">
        <h2 className="text-3xl font-bold">{plan.name}</h2>
      </div>

      {/* Section 2: Price */}
      <div className="text-center h-1/5 py-6">
        <p className="text-6xl font-bold">{formattedPrice}</p>
      </div>
      
      {/* Section 3: Description */}
      <p className="text-sm h-1/5 text-center">
        {plan.description} This is a monthly subscription.
      </p>
      
      {/* Section 4: Perks List */}
      <ul className="list-disc pl-5 py-8 flex-grow">
        {plan.perks.values.map((perk, index) => (
          <li key={index} className="text-sm">{perk}</li>
        ))}
      </ul>
      
      {/* Section 5: Button */}
      <Link
        href={`/subscription?planId=${plan._id}`}
        className="
          block text-center p-3 no-underline 
          bg-gray-c1 text-highlight          
          hover:bg-highlight hover:text-black
          transition-colors duration-300
        "
      >
        Select Plan
      </Link>
    </div>
  );
}