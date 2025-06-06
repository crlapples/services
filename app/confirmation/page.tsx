// app/confirmation/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, notFound } from 'next/navigation';
import Link from 'next/link';

import { formatPrice } from 'app/utils/price-formtter';
import { Service, OfferedAsType, Money, ServiceType } from 'lib/service-types';
import { Image } from "lib/image-types";
import { Plan } from 'lib/plan-types';

import rawServicesData from 'lib/services.json';
import rawPlansData from 'lib/plans.json';

import CustomStyledPaymentDropdown, {
  buildDisplayOptions,
  DisplayOption, // Import DisplayOption type
} from '@app/components/dropdownMenu';
import StyledInput from "@app/components/styledInput";
import StyledTextarea from '@app/components/styledTextarea';

import '.././globals.css';

// --- Data Transformation (No changes here) ---
const transformRawServiceData = (rawService: any): Service => {
    const offeredAsValues = rawService.offeredAs
    ? rawService.offeredAs.map((oa: string) => {
    if (Object.values(OfferedAsType).includes(oa as OfferedAsType)) {
    return oa as OfferedAsType;
    }
    console.warn(`Unknown OfferedAsType value: ${oa} for service ${rawService.id}.`);
    return undefined;
    }).filter((oa: OfferedAsType | undefined): oa is OfferedAsType => oa !== undefined)
    : [];

    return {
    id: rawService.id || '',
    slug: rawService.slug || '',
    name: rawService.name || '',
    description: rawService.description || '',
    tagLine: rawService.tagLine || '',
    type: (rawService.type as ServiceType) || ServiceType.INDIVIDUAL,
    category: {
    id: rawService.category?.id || '',
    name: rawService.category?.name || '',
    },
    mainMedia: rawService.mainMedia
    ? ({
    id: rawService.mainMedia.id || '',
    url: rawService.mainMedia.url || '',
    alt: rawService.mainMedia.altText || '',
    } as Image)
    : undefined,
    otherMediaItems: rawService.otherMediaItems
    ? rawService.otherMediaItems.map((item: any) => ({
    id: item?.id || '',
    url: item?.url || '',
    alt: item?.altText || '',
    } as Image))
    : [],
    price: rawService.price
    ? ({
    value: rawService.price.value || 0,
    currency: rawService.price.currency || 'USD',
    } as Money)
    : undefined,
    duration: rawService.duration || 0,
    offeredAs: offeredAsValues,
    payment: rawService.payment
    ? {
    rateType: rawService.payment.rateType as 'FIXED' | 'VARIED' | 'NO_FEE' | undefined,
    }
    : undefined,
    schedule: rawService.schedule || null,
    };
};

const services: Service[] = (rawServicesData as any[]).map(transformRawServiceData);
const plans: Plan[] = rawPlansData as Plan[];

/**
 * NEW HELPER FUNCTION
 * Generates the specific display text for the Payment Details summary box.
 */
const getPaymentDetailsDisplayText = (
  selectedOptionValue: string | OfferedAsType,
  displayOptions: DisplayOption[]
): React.ReactNode => {
  const selectedOption = displayOptions.find(opt => opt.value === selectedOptionValue);

  if (!selectedOption) {
    return 'N/A';
  }

  // If it's a subscription, show only the plan name.
  if (selectedOption.title === 'Subscription') {
    return <span>Subscription - {selectedOption.actionText}</span>;
  }

  // If it's a one-time payment, show "Total" and the price with space between.
  if (selectedOption.title === 'One-Time Payment') {
    return (
      <div className="flex justify-between w-full">
        <span>Total</span>
        <span>{selectedOption.priceText}</span>
      </div>
    );
  }

  // Fallback for any other types
  return <span>{selectedOption.actionText}</span>;
};


// --- BookingFormPage Component ---
export default function BookingFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  const service = services.find((s) => s.id === serviceId);
  const firstMonthlyPlan = plans.find(p => p._id === "web_basic_monthly_001");

  const [formData, setFormData] = useState({
    name: decodeURIComponent(searchParams.get('name') || ''),
    email: decodeURIComponent(searchParams.get('email') || ''),
    phone: decodeURIComponent(searchParams.get('phone') || ''),
    message: '',
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlanDetailsOpen, setIsPlanDetailsOpen] = useState(true);

  const [selectedPaymentOption, setSelectedPaymentOption] = useState<OfferedAsType | string>(() => {
    if (!service) return OfferedAsType.ONLINE;
    return service.offeredAs.includes(OfferedAsType.ONLINE) ? OfferedAsType.ONLINE : service.offeredAs[0] || OfferedAsType.ONLINE;
  });

  useEffect(() => {
    if (service) {
      const initialOption = service.offeredAs.includes(OfferedAsType.ONLINE) ? OfferedAsType.ONLINE : service.offeredAs[0] || OfferedAsType.ONLINE;
      setSelectedPaymentOption(initialOption);
    }
  }, [service]);

  if (!service) {
    notFound();
    return null;
  }

  const handleFormInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentOptionChange = (option: OfferedAsType | string) => {
    setSelectedPaymentOption(option);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isPlanSelected = firstMonthlyPlan && selectedPaymentOption === firstMonthlyPlan._id;

    if (isPlanSelected) {
      router.push(`/subscription?planId=${firstMonthlyPlan._id}`);
    } else {
      const queryParams = new URLSearchParams({
        serviceId: service.id,
        name: encodeURIComponent(formData.name),
        email: encodeURIComponent(formData.email),
        phone: encodeURIComponent(formData.phone),
        message: encodeURIComponent(formData.message),
        paymentMethod: selectedPaymentOption.toString(),
      });
      router.push(`/payment?${queryParams.toString()}`);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const togglePlanDetails = () => setIsPlanDetailsOpen(!isPlanDetailsOpen);

  const formattedPrice = service.price ? formatPrice(service.price) : 'Price not available';
  const formattedDuration = service.duration ? (service.duration >= 60 ? `${Math.floor(service.duration / 60)}hr ${service.duration % 60 > 0 ? `${service.duration % 60}min` : ''}`.trim() : `${service.duration} min`) : 'N/A';
  const formattedDate = searchParams.get('date') || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = searchParams.get('time') || 'Time not specified';
  
  const displayOptions = buildDisplayOptions(service, firstMonthlyPlan);
  const isPlanSelected = firstMonthlyPlan && selectedPaymentOption === firstMonthlyPlan._id;

  return (
    <div className="text-gray-800 bg-white min-h-screen">
      <main id="main-content" className="p-2 md:p-4" tabIndex={-1}>
        <div className="max-w-5xl mx-auto bg-white p-2 md:p-4">
          <div className="mb-8">
            <button
              className="text-gray-700 flex items-center gap-1.5 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              onClick={() => router.back()}
              type="button"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Back</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            <div className="flex-grow mb-20 lg:w-3/5">
              <div className="mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">Client Details</h1>
                <hr className="border-gray-200" />
                <p className="mt-3 text-gray-600">Tell us a bit about yourself to complete the transaction.</p>
              </div>

              <div className="mb-8 p-2 w-full bg-gray-100 text-sm text-gray-600">
                <span>Already have an account? </span>
                <button
                  className="text-gray-600 hover:text-black underline font-semibold focus:outline-none rounded"
                  type="button"
                  onClick={toggleMobileMenu}
                >
                  Log In
                </button>
                <span> for a faster experience.</span>
              </div>

              <form onSubmit={handleSubmit} id="client-details-form" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StyledInput
                    label="Full Name"
                    id="client-name-form"
                    name="name"
                    maxLength={100}
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormInputChange(e.target.name, e.target.value)}
                    showCharCount
                  />
                  <StyledInput
                    label="Email Address"
                    id="client-email-form"
                    name="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormInputChange(e.target.name, e.target.value)}
                  />
                </div>

                <StyledInput
                  label="Phone Number (Optional)"
                  id="client-phone-form"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormInputChange(e.target.name, e.target.value)}
                />

                <StyledTextarea
                  label="Add a Message (Optional)"
                  id="client-message-form"
                  name="message"
                  value={formData.message}
                  onChange={(e) => handleFormInputChange(e.target.name, e.target.value)}
                  rows={2}
                />

                <fieldset className="mt-8 pt-1">
                  <hr className="text-gray-300 mb-2" />
                  <legend className="text-2xl font-semibold text-gray-900 mb-4">Payment Option</legend>
                  <div className="bg-white rounded-xl space-y-3">
                    <p className="font-semibold text-lg text-gray-800">{service.name}</p>
                    <CustomStyledPaymentDropdown
                      service={service}
                      plan={firstMonthlyPlan}
                      selectedOption={selectedPaymentOption}
                      onOptionSelect={handlePaymentOptionChange}
                    />
                  </div>
                </fieldset>
              </form>
            </div>

            <aside className="lg:w-1/4 space-y-8 sticky top-8 self-start">
              <div className="bg-white rounded-lg">
                <button
                  id="booking-details-header"
                  onClick={togglePlanDetails}
                  aria-expanded={isPlanDetailsOpen}
                  aria-controls="booking-details-content"
                  className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t-lg"
                >
                  <h2 className="text-xl font-semibold text-gray-800">Plan Details</h2>
                  <div aria-hidden="true">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="20"
                      height="20"
                      className={`text-gray-500 transform transition-transform duration-200 ${
                        isPlanDetailsOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                <div
                  id="booking-details-content"
                  className={`overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-200 ${
                    isPlanDetailsOpen ? 'max-h-[1000px] opacity-100 p-4' : 'max-h-0 opacity-0 p-0'
                  }`}
                  role="region"
                  aria-labelledby="booking-details-header"
                >
                  {isPlanDetailsOpen && (
                    <div className="text-sm space-y-2 text-gray-700">
                      <div className="flex">
                        <span className="font-semibold text-left">{service.name}</span>
                      </div>
                      <div className="flex">
                        <span className="text-left">{`${formattedDate}`}</span>
                      </div>
                      <div className="flex">
                        <span className="text-left">Las Vegas, NV</span>
                      </div>
                      <div className="flex">
                        <span className="text-left">Code Mage</span>
                      </div>
                      <div className="flex">
                        <span className="text-left">{formattedPrice}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border-t border-b border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Details</h3>
                <div className="text-sm text-gray-700 font-medium">
                  {/* --- UPDATED TO USE THE NEW HELPER FUNCTION --- */}
                  {getPaymentDetailsDisplayText(selectedPaymentOption, displayOptions)}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  form="client-details-form"
                  className="w-full p-3.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                >
                  {isPlanSelected ? 'Proceed to Subscription' : 'Confirm & Pay'}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-[1000] transition-opacity duration-300"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          ></div>
          <div
            className={`fixed top-0 w-[280px] h-full bg-white p-6 shadow-xl transition-transform duration-300 z-[1001] ${ isMobileMenuOpen ? 'translate-x-0 right-0' : 'translate-x-full right-0' }`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Menu"
          >
            <div className="flex justify-end mb-6">
              <button
                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 rounded-full"
                onClick={toggleMobileMenu}
                aria-label="Close site navigation"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav aria-label="Site Navigation">
              <ul className="list-none p-0 space-y-2">
                <li><Link href="/" className="block py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium no-underline">Home</Link></li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}