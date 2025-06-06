// src/components/Plan/PlanList.tsx
import Link from 'next/link';
import { Plan } from 'lib/plan-types';
import MediaImage from 'app/components/Image/MediaImage';
import { formatPrice } from 'app/utils/price-formtter';

// Define an array of background colors to cycle through
const cardBackgroundColors = [
  'bg-gray-800', // Dark gray
  'bg-slate-800', // Slate
  'bg-zinc-800',  // Zinc
];

export default function PlansList({
  plans,
  checkoutData,
}: {
  plans: Plan[];
  checkoutData?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 px-3">
      {plans.map((plan, index) => (
        <PlanCard
          key={plan._id}
          plan={plan}
          checkoutData={checkoutData}
          // Use the modulo operator to cycle through the background colors
          bgColor={cardBackgroundColors[index % cardBackgroundColors.length]}
        />
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  checkoutData,
  bgColor,
}: {
  plan: Plan;
  checkoutData?: string;
  bgColor: string;
}) {
  const formattedPrice = formatPrice(
    plan.pricing.price,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );

  return (
    // The dynamic background color is applied here
    <div className={`border-2 border-gray-c2 p-6 rounded-none text-white flex flex-col w-full md:w-1/3 ${bgColor}`}>
      {plan.images && plan.images[0] && (
        <MediaImage media={plan.images[0]} width={640} height={480} />
      )}
      
      {/* Section 1: Title (Now on top) */}
      <div className="text-center pt-4">
        <h2 className="text-3xl font-bold">{plan.name}</h2>
      </div>

      {/* Section 2: Price */}
      <div className="text-center py-6">
        <p className="text-6xl font-bold">{formattedPrice}</p>
      </div>
      
      {/* Section 3: Description */}
      <p className="text-sm text-center">
        {plan.description} This is a monthly subscription.
      </p>
      
      {/* Section 4: Perks List */}
      {/* The `flex-grow` here pushes the button down, ensuring alignment */}
      {/* `py-8` adds significant vertical space to help align content across cards */}
      <ul className="list-disc pl-5 py-8 flex-grow">
        {plan.perks.values.map((perk, index) => (
          // Removed space-y from parent, so no extra space between bullet points
          <li key={index} className="text-sm">{perk}</li>
        ))}
      </ul>
      
      {/* Section 5: Button */}
      <Link
        href={`/subscription?planId=${plan._id}`}
        className="block bg-highlight text-white text-center p-3 no-underline"
      >
        Select Plan
      </Link>
    </div>
  );
}