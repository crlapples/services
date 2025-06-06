// app/components/dropdownMenu.tsx
'use client';

import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';

// Import the canonical types
import { Service, OfferedAsType } from 'lib/service-types'; // Adjust path if necessary
import { Plan } from 'lib/plan-types'; // Adjust path if necessary
import { formatPrice } from 'app/utils/price-formtter'; // Adjust path if necessary

// This function now handles enums, plan objects, and fallback strings.
export const getOptionDisplayText = (
  option: OfferedAsType | string | undefined,
  plan?: Plan
): string => {
  if (!option) return "Select payment method";

  // Handle the specific plan option
  if (plan && option === plan._id) {
    const price = formatPrice(plan.pricing.price);
    return `${plan.name} (${price}/month)`;
  }

  // Handle enum members
  switch (option) {
    case OfferedAsType.ONLINE:
      return "One-Time Payment"; // Changed for clarity
    case OfferedAsType.OFFLINE:
      return "Pay In Person";
    case OfferedAsType.PRICING_PLAN:
      // This might refer to other plans associated with the service, not the one we inject
      return "Paid Plan / Membership";
    default:
      // Fallback for any other unmapped string values
      const s = String(option);
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, ' ');
  }
};

interface PaymentOptionDropdownProps {
  service: Service;
  // The specific plan to offer as an additional option
  plan?: Plan;
  // Controlled component props
  selectedOption: OfferedAsType | string;
  onOptionSelect: (option: OfferedAsType | string) => void;
}

const CustomStyledPaymentDropdown: React.FC<PaymentOptionDropdownProps> = ({
  service,
  plan,
  selectedOption,
  onOptionSelect,
}) => {
  // Combine service payment options with the injected plan
  const availableOptions: (OfferedAsType | string)[] = [...service.offeredAs];
  if (plan) {
    // Add the plan ID as a unique option value
    availableOptions.push(plan._id);
  }

  // If there are no options, provide a default
  if (availableOptions.length === 0) {
    availableOptions.push(OfferedAsType.ONLINE);
  }

  return (
    <div className="w-full">
      <Listbox value={selectedOption} onChange={onOptionSelect}>
        <div className="relative">
          <Listbox.Button
            className="relative w-full cursor-default bg-white text-gray-900
            py-2.5 pl-4 pr-10 text-left shadow-sm
            border border-gray-600 rounded-full sm:text-sm focus:outline-none"
          >
            <span className="block truncate">
              {getOptionDisplayText(selectedOption, plan)}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-10 w-full overflow-auto bg-white
              py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
              focus:outline-none sm:text-sm
              bottom-full mb-2 rounded-full max-h-60"
            >
              {availableOptions.map((optionValue, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-gray-100 text-black' : 'text-gray-900'
                    } ${
                      availableOptions.length === 1
                        ? 'rounded-full'
                        : optionIdx === 0
                        ? 'rounded-t-full'
                        : ''
                    }${
                      optionIdx === availableOptions.length - 1
                        ? ' rounded-b-full'
                        : ''
                    }`
                  }
                  value={optionValue}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block ${
                          selected ? 'font-medium' : 'font-normal'
                        } whitespace-normal`}
                      >
                        {getOptionDisplayText(optionValue, plan)}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomStyledPaymentDropdown;