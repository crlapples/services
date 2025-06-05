// app/components/dropdownMenu.tsx
'use client'; // Keep this if it's a client component

import React, { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';

// Import the canonical types from your lib
import { Service, OfferedAsType } from 'lib/service-types'; // Adjust path if necessary

// This function now needs to handle the enum members from lib/service-types
// and potentially any other string values if your service.offeredAs can contain them.
// For now, let's assume service.offeredAs will strictly contain OfferedAsType enum members
// or we need a more robust mapping.
export const offeredAsToPaymentOptionsText = (option: OfferedAsType | string | undefined): string => {
  if (!option) return "Select payment method";

  // Handle enum members first
  switch (option) {
    case OfferedAsType.ONLINE:
      return "Online Payment";
    case OfferedAsType.OFFLINE:
      return "In Person";
    case OfferedAsType.PRICING_PLAN:
      return "Paid Plan / Membership"; // Or "Private Membership"
    // Add cases for any other string literals you might still have in offeredAs arrays
    // For example, if you had "PAY_NOW_FULL" directly in an offeredAs array:
    // case "PAY_NOW_FULL":
    //   return "Pay now in full";
    default:
      // Fallback for unmapped string values (if any)
      const s = String(option);
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, ' ');
  }
};


interface PaymentOptionDropdownProps {
  service: Service; // Now uses Service from lib/service-types
  // Optional: if you want to control selected option from parent
  // selectedOption?: OfferedAsType;
  // onOptionSelect?: (option: OfferedAsType) => void;
}

const CustomStyledPaymentDropdown: React.FC<PaymentOptionDropdownProps> = ({
  service,
  // selectedOption: parentSelectedOption,
  // onOptionSelect
}) => {
  // Determine initial selected option and available options
  // The service.offeredAs array should contain members of the OfferedAsType enum
  const availableOptions = service.offeredAs.length > 0
    ? service.offeredAs
    : [OfferedAsType.ONLINE]; // Default to ONLINE if empty, or choose another sensible default

  // Determine initial selected option
  // If a parentSelectedOption is provided and valid, use it.
  // Otherwise, check if PRICING_PLAN is available, then the first available, then default.
  let initialOption: OfferedAsType;
  // if (parentSelectedOption && availableOptions.includes(parentSelectedOption)) {
  //   initialOption = parentSelectedOption;
  // } else
  if (availableOptions.includes(OfferedAsType.PRICING_PLAN)) {
    initialOption = OfferedAsType.PRICING_PLAN;
  } else {
    initialOption = availableOptions[0] || OfferedAsType.ONLINE; // Fallback
  }


  const [selectedPaymentOption, setSelectedPaymentOption] = useState<OfferedAsType>(initialOption);

  const handleSelectionChange = (value: OfferedAsType) => {
    setSelectedPaymentOption(value);
    // if (onOptionSelect) {
    //   onOptionSelect(value);
    // }
    console.log("Selected payment option (dropdown):", value);
  };

  // Effect to update local state if parentSelectedOption changes
  // useEffect(() => {
  //   if (parentSelectedOption && availableOptions.includes(parentSelectedOption)) {
  //     setSelectedPaymentOption(parentSelectedOption);
  //   }
  // }, [parentSelectedOption, availableOptions]);

  return (
    <div className="w-full">
      <Listbox value={selectedPaymentOption} onChange={handleSelectionChange}>
        <div className="relative">
          <Listbox.Button
            className="relative w-full cursor-default bg-white text-gray-900
                       py-2.5 pl-4 pr-10 text-left shadow-sm
                       border border-gray-600 rounded-full sm:text-sm focus:outline-none"
          >
            <span className="block truncate">
              {offeredAsToPaymentOptionsText(selectedPaymentOption)}
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
                  key={optionIdx} // Using index is okay if options don't reorder/change
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4
                     ${active ? 'bg-gray-100 text-black' : 'text-gray-900'}
                     ${availableOptions.length === 1 ? 'rounded-full' :
                       (optionIdx === 0 ? 'rounded-t-full' : '') +
                       (optionIdx === availableOptions.length - 1 ? ' rounded-b-full' : '')
                     }`
                  }
                  value={optionValue}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block ${selected ? 'font-medium' : 'font-normal'} whitespace-normal`}
                      >
                        {offeredAsToPaymentOptionsText(optionValue)}
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