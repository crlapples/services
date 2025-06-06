// app/components/dropdownMenu.tsx
'use client';

import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';

import { Service, OfferedAsType } from 'lib/service-types';
import { Plan } from 'lib/plan-types';
import { formatPrice } from 'app/utils/price-formtter';

export interface DisplayOption {
  value: OfferedAsType | string;
  title: string;
  actionText: string;
  priceText: string;
}

export const buildDisplayOptions = (service: Service, plan?: Plan): DisplayOption[] => {
  const options: DisplayOption[] = [];

  if (service.offeredAs.includes(OfferedAsType.ONLINE) && service.price) {
    options.push({
      value: OfferedAsType.ONLINE,
      title: 'One-Time Payment',
      actionText: 'Pay Now',
      priceText: formatPrice(service.price),
    });
  }

  if (plan) {
    options.push({
      value: plan._id,
      title: 'Subscription',
      actionText: plan.name,
      priceText: `${formatPrice(plan.pricing.price)} / month`,
    });
  }

  return options;
};

export const getButtonDisplayText = (
  optionValue: OfferedAsType | string,
  options: DisplayOption[]
): string => {
  const selected = options.find(opt => opt.value === optionValue);
  if (!selected) return "Select payment method";
  return `${selected.title}: ${selected.actionText}`;
};


interface PaymentOptionDropdownProps {
  service: Service;
  plan?: Plan;
  selectedOption: OfferedAsType | string;
  onOptionSelect: (option: OfferedAsType | string) => void;
}

const CustomStyledPaymentDropdown: React.FC<PaymentOptionDropdownProps> = ({
  service,
  plan,
  selectedOption,
  onOptionSelect,
}) => {
  const displayOptions = buildDisplayOptions(service, plan);

  if (displayOptions.length === 0) {
    return <div className="text-gray-500">No payment options available.</div>;
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
              {getButtonDisplayText(selectedOption, displayOptions)}
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
              bottom-full mb-2 rounded-lg"
            >
              {displayOptions.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none p-3 group ${
                      // Use light gray for active/hover background
                      active ? 'bg-gray-100' : 'bg-white'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex flex-col">
                        {/* Line 1: Title - No color change on hover */}
                        <span className={`block text-xs font-semibold uppercase tracking-wider ${selected ? 'text-gray-800' : 'text-gray-500'}`}>
                          {option.title}
                        </span>
                        
                        <div className="pl-4 mt-1">
                          {/* Line 2: Action Text - Text color changes to black on hover */}
                          <span className={`block truncate font-medium text-gray-700 transition-colors duration-150 ${selected ? 'font-bold text-black' : ''} group-hover:text-black`}>
                            {option.actionText}
                          </span>
                          {/* Line 3: Price Text - Text color changes to black on hover */}
                          <span className={`block text-sm text-gray-600 transition-colors duration-150 ${selected ? 'font-bold text-black' : ''} group-hover:text-black`}>
                            {option.priceText}
                          </span>
                        </div>
                      </div>

                      {/* Checkmark for selected state */}
                      {selected ? (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-black">
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