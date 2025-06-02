'use client';

import { formatPrice } from 'app/utils/price-formtter';
import { Service, OfferedAsType, Money, ServiceType } from 'lib/service-types';
import { Image } from "lib/image-types"
import rawServicesData from 'lib/services.json';
import { notFound, useRouter } from 'next/navigation'; // Added useRouter
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'; // Import Link
import '.././globals.css';

// Transform raw service data (assuming this is correct from previous fixes)
const transformRawServiceData = (rawService: any): Service => {
  return {
    id: rawService.id || '',
    slug: rawService.slug || '',
    name: rawService.name || '',
    description: rawService.description || '',
    tagLine: rawService.tagLine || '',
    type: rawService.type as ServiceType || ServiceType.INDIVIDUAL,
    category: {
      id: rawService.category?.id || '',
      name: rawService.category?.name || '',
    },
    mainMedia: rawService.mainMedia
      ? {
          id: rawService.mainMedia.id || '',
          url: rawService.mainMedia.url || '',
          alt: rawService.mainMedia.altText || '',
        } as Image
      : undefined,
    otherMediaItems: rawService.otherMediaItems
      ? rawService.otherMediaItems.map((item: any) => ({
          id: item?.id || '',
          url: item?.url || '',
          alt: item?.altText || '',
        } as Image))
      : undefined,
    price: rawService.price
      ? {
          value: rawService.price.value || 0,
          currency: rawService.price.currency || 'USD',
        } as Money
      : undefined,
    duration: rawService.duration || 0,
    offeredAs: rawService.offeredAs
      ? rawService.offeredAs.map((oa: string) => oa as OfferedAsType)
      : [],
    payment: rawService.payment
      ? {
          rateType: rawService.payment.rateType as 'FIXED' | 'VARIED' | 'NO_FEE' | undefined,
          fixed: rawService.payment.fixed?.price
            ? { price: rawService.payment.fixed.price as Money }
            : undefined,
          varied: rawService.payment.varied
            ? {
                defaultPrice: rawService.payment.varied.defaultPrice
                  ? (rawService.payment.varied.defaultPrice as Money)
                  : undefined,
                deposit: rawService.payment.varied.deposit
                  ? (rawService.payment.varied.deposit as Money)
                  : undefined,
                minPrice: rawService.payment.varied.minPrice
                  ? (rawService.payment.varied.minPrice as Money)
                  : undefined,
                maxPrice: rawService.payment.varied.maxPrice
                  ? (rawService.payment.varied.maxPrice as Money)
                  : undefined,
              }
            : undefined,
          custom: rawService.payment.custom
            ? {
                description: rawService.payment.custom.description || '',
              }
            : undefined,
          options: rawService.payment.options
            ? {
                online: rawService.payment.options.online || false,
                inPerson: rawService.payment.options.inPerson || false,
                pricingPlan: rawService.payment.options.pricingPlan || false,
              }
            : undefined,
        }
      : undefined,
    schedule: rawService.schedule || null,
  };
};

const services: Service[] = (rawServicesData as any[]).map(transformRawServiceData);

const offeredAsToPaymentOptionsText = (offeredAs: OfferedAsType) =>
  offeredAs === OfferedAsType.OFFLINE
    ? 'In Person'
    : offeredAs === OfferedAsType.ONLINE
    ? 'Online'
    : offeredAs === OfferedAsType.PRICING_PLAN
    ? 'Paid Plans' // Or "Private Membership" as seen in the HTML
    : 'Other';

export default function BookingFormPage() { // Renamed component for clarity
  const searchParams = useSearchParams();
  const router = useRouter(); // For navigation
  const serviceId = searchParams.get('serviceId');
  
  // Get initial values from URL, decode them
  const nameParam = searchParams.get('name');
  const emailParam = searchParams.get('email');
  const phoneParam = searchParams.get('phone');

  const initialName = nameParam ? decodeURIComponent(nameParam) : '';
  const initialEmail = emailParam ? decodeURIComponent(emailParam) : '';
  const initialPhone = phoneParam ? decodeURIComponent(phoneParam) : '';

  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    notFound();
  }

  const [formData, setFormData] = useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    message: '',
    // participants: 1, // This seems to be handled by the dropdown in the HTML, not part of this form
    // paymentMethod: 'Private Membership', // This is also from a dropdown in the HTML
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState(1); // For the participants dropdown
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(
    service.offeredAs.includes(OfferedAsType.PRICING_PLAN) ? OfferedAsType.PRICING_PLAN : service.offeredAs[0] || OfferedAsType.ONLINE
  );
  const [isOpen, setIsOpen] = useState(true); // Start closed by default, as in your example

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', {
        ...formData,
        serviceId: service.id,
        participants: selectedParticipants,
        paymentChoice: selectedPaymentOption,
    });
    // Navigate to payment page or next step
    const queryParams = new URLSearchParams({
        serviceId: service.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        participants: selectedParticipants.toString(),
        paymentMethod: selectedPaymentOption, // Pass the chosen payment method
    });
    router.push(`/payment?${queryParams.toString()}`);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const formattedPrice = service.price ? formatPrice(service.price) : 'Price not available';
  const formattedDuration = service.duration
    ? service.duration >= 60
      ? `${Math.floor(service.duration / 60)} hr${service.duration % 60 > 0 ? ` ${service.duration % 60} min` : ''}`
      : `${service.duration} min`
    : '';
  const formattedDate = searchParams.get('date') || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = searchParams.get('time') || '7:30 am'; // Example, make dynamic

  return (
    <div className="text-gray-800">
      <main id="main-content" className="p-5 bg-white" tabIndex={-1}>
        <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 md:p-8 rounded-md">
          <div className="mb-6">
            <button
              className="text-black text-lg hover:text-blue-800 flex items-center gap-1 text-sm"
              onClick={() => window.history.back()}
              type="button"
            >
              <svg viewBox="0 0 20 20" fill="black" width="16" height="16" aria-hidden="true">
                <path d="M12.2929466,3.99983983 L13.0000534,4.70694661 L7.7015668,10.0028398 L13,15.293 L12.2928932,16.0001068 L6.2895668,10.0061485 L6.2925668,10.0028398 L6.29036026,10 L12.2929466,3.99983983 Z" />
              </svg>
              <span>Back</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Form */}
            <div className="flex-grow md:w-3/5">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">Client Details</h1>
                <hr className="border-gray-300" />
                <p className="mt-2 text-gray-600">Tell us a bit about yourself</p>
              </div>

              <div className="mb-6 px-3 text-sm text-gray-600">
                <span>Already have an account? </span>
                <button
                  className="text-gray-600 underline font-semibold"
                  type="button"
                  onClick={toggleMobileMenu} // Or a login modal
                >
                  Log In
                </button>
                <span> for faster booking.</span>
              </div>

              <form onSubmit={handleSubmit} id="client-details-form">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:gap-4">
                    <div className="md:w-1/2 mb-4 md:mb-0">
                      <label htmlFor="client-name-form" className="block text-sm font-medium text-gray-700 mb-1">
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                          id="client-name-form"
                        name="name"
                        maxLength={100}
                        required
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="text-xs text-gray-500 text-right mt-1">{formData.name.length}/100</div>
                    </div>

                    <div className="md:w-1/2">
                      <label htmlFor="client-email-form" className="block text-sm font-medium text-gray-700 mb-1">
                        Email<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="client-email-form"
                        name="email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="client-phone-form" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="client-phone-form"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="client-message-form" className="block text-sm font-medium text-gray-700 mb-1">
                      Add Your Message
                    </label>
                    <textarea
                      id="client-message-form"
                      name="message"
                      aria-label="Add Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-4 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <fieldset className="mt-6 pt-4 border-gray-300">
                  <legend className="text-xl font-semibold mb-2">Payment</legend>
                  <hr className="text-gray-300 my-3" />
                  <div className="bg-gray-50 py-4 rounded-full">
                    <p className="font-medium text-gray-700">{service.name}</p>
                    <div className="mt-2">
                      <label htmlFor="payment-option-dropdown" className="sr-only">Payment Option</label>
                      <div className="relative inline-block border border-gray-300 rounded-full shadow-sm w-full">
                        <select
                          id="payment-option-dropdown"
                          name="paymentOption"
                          value={selectedPaymentOption}
                          onChange={(e) => setSelectedPaymentOption(e.target.value as OfferedAsType)}
                          className="w-full p-2.5 bg-white appearance-none pr-8 rounded-full focus:ring-blue-500 focus:border-blue-500"
                        >
                          {service.offeredAs.map((option) => (
                            <option key={option} value={option}>
                              {offeredAsToPaymentOptionsText(option)}
                            </option>
                          ))}
                           {/* Example if service.offeredAs is empty or doesn't include a default */}
                          {!service.offeredAs.length && <option value="Pay now">Pay now</option>}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.2546728,8.18171329 L18.9617796,8.88882007 L12.5952867,15.2537133 L12.5978964,15.2558012 L11.8907896,15.962908 L11.8882867,15.9607133 L11.8874628,15.9617796 L11.180356,15.2546728 L11.1812867,15.2527133 L4.81828671,8.88882007 L5.52539349,8.18171329 L11.8882867,14.5457133 L18.2546728,8.18171329 Z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>

            {/* Right Column: Summary */}
            <aside className="md:w-2/5 space-y-6">
              <div className="rounded-md overflow-hidden"> {/* Outer container for border */}
                {/* Header Button */}
                <button
                  id="booking-details-header"
                  onClick={toggleOpen}
                  aria-expanded={isOpen}
                  aria-controls="booking-details-content"
                  className="w-full flex justify-between items-center py-3 text-left"
                  // Removed sKFHfHm, using Tailwind for styling
                >
                  <h3 className="text-lg font-semibold text-gray-800" data-hook="title"> {/* Adjusted font size/weight */}
                    Plan Details
                  </h3>
                  <div aria-hidden="true"> {/* sgrK0VB equivalent */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="20" // Adjusted size slightly for better fit
                      height="20"
                      className={`text-gray-600 transform transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`} // slESM_B equivalent for rotation
                      data-hook="expandIcon"
                      // data-label="Expand-ChevronDown" // data-label is not standard HTML
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.2546728,8.18171329 L18.9617796,8.88882007 L12.5952867,15.2537133 L12.5978964,15.2558012 L11.8907896,15.962908 L11.8882867,15.9607133 L11.8874628,15.9617796 L11.180356,15.2546728 L11.1812867,15.2527133 L4.81828671,8.88882007 L5.52539349,8.18171329 L11.8882867,14.5457133 L18.2546728,8.18171329 Z"
                      />
                    </svg>
                  </div>
                </button>

                {/* Collapsible Content Area */}
                {/* Simulating rah-static rah-static--height-zero */}
                <div
                  id="booking-details-content"
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0' // Adjust max-h if content is taller
                  }`}
                  // style={isOpen ? {} : { height: '0px' }} // Alternative for direct height control
                  role="group"
                  aria-labelledby="booking-details-header"
                  aria-hidden={!isOpen}
                >
                  {/* The inner div for padding and content, only rendered when open for transition */}
                  {isOpen && (
                    <div className="py-3 border-t border-gray-200"> {/* soTz_2r equivalent for padding */}
                      <div className="text-sm space-y-1 text-gray-700"> {/* szBA5Bn equivalent */}
                        <p className="font-medium" data-hook="single-slot-details-service-name">
                          {service.name}
                        </p>
                        <div data-hook="booking-details-slot-date-and-time"> {/* sYrZmpS equivalent */}
                          <p>{`${formattedDate} at ${formattedTime}`}</p>
                        </div>
                        <p className="text-gray-600" data-hook="booking-details-location"> {/* otLy4uS---type-9-secondary equivalent */}
                          Las Vegas, NV
                        </p>
                        <p className="text-gray-600" data-hook="booking-details-staff-member">
                          Code Mage
                        </p>
                        <p className="text-gray-600" data-hook="booking-details-duration">
                          {formattedDuration}
                        </p>
                        {/* For accessibility, if the visual duration is like "1 hr", provide a more descriptive version for screen readers */}
                        <div className="sr-only" data-hook="booking-details-duration-aria">
                          {formattedDuration.replace("hr", "hour").replace("min", "minutes")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-3">Payment Details</h3>
                <div className="text-sm space-y-1 text-gray-700">
                  <p>{offeredAsToPaymentOptionsText(selectedPaymentOption)}</p>
                  {/* Add more payment details if needed, e.g., price if not part of a plan */}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  form="client-details-form" // Links to the form
                  className="w-full p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {selectedPaymentOption === OfferedAsType.PRICING_PLAN ? 'Buy a plan' : 'Next'}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile Menu Overlay & Panel (same as before) */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[1000] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      ></div>
      <div
        className={`fixed top-0 w-[280px] h-full bg-white p-5 shadow-lg transition-transform duration-300 z-[1001] ${
          isMobileMenuOpen ? 'translate-x-0 right-0' : 'translate-x-full right-0' 
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Menu"
        hidden={!isMobileMenuOpen}
      >
        <button
          className="float-right bg-transparent border-none cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label="Close site navigation"
        >
          <svg viewBox="65.35 65.35 69.3 69.3" width="24" height="24" aria-hidden="true">
            <path d="M134.65 128.99L105.66 100l28.99-28.99-5.66-5.66L100 94.34 71.01 65.35l-5.66 5.66L94.34 100l-28.99 28.99 5.66 5.66L100 105.66l28.99 28.99 5.66-5.66z" />
          </svg>
        </button>
        <nav aria-label="Site" className="mt-10">
          <ul className="list-none p-0">
            <li><Link href="/" className="block p-2 text-gray-800 no-underline hover:bg-gray-100">Home</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}