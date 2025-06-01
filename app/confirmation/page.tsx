'use client';

import { formatPrice } from 'app/utils/price-formtter';
// Import ServiceType here
import { Service, OfferedAsType, Money, ServiceType } from 'lib/service-types';
import { Image } from 'lib/image-types';
import rawServicesData from 'lib/services.json';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Transform raw service data
const transformRawService = (rawService: any): Service => {
  return {
    id: rawService.id,
    slug: rawService.slug,
    name: rawService.name,
    description: rawService.description,
    tagLine: rawService.tagLine,
    type: rawService.type as ServiceType, // ServiceType is now imported
    category: {
      id: rawService.category.id,
      name: rawService.category.name,
    },
    mainMedia: rawService.mainMedia
      ? {
          id: rawService.mainMedia.id,
          url: rawService.mainMedia.url,
          altText: rawService.mainMedia.altText, // Changed 'alt' to 'altText' to match common patterns and JSON
          // Removed 'type' property as it's not in the 'Image' type
        } as Image // Explicitly cast to Image
      : undefined,
    otherMediaItems: rawService.otherMediaItems
      ? rawService.otherMediaItems.map((item: any) => ({
          id: item.id,
          url: item.url,
          altText: item.altText,
          // Removed 'type' property as it's not in the 'Image' type
        } as Image)) // Explicitly cast each item to Image
      : undefined,
    price: rawService.price
      ? {
          value: rawService.price.value,
          currency: rawService.price.currency,
        } as Money // Cast to Money
      : undefined,
    duration: rawService.duration,
    offeredAs: rawService.offeredAs.map((oa: string) => oa as OfferedAsType),
    payment: rawService.payment
      ? {
          rateType: rawService.payment.rateType as 'FIXED' | 'VARIED' | 'NO_FEE' | undefined,
          fixed: rawService.payment.fixed?.price
            ? { price: rawService.payment.fixed.price as Money }
            : undefined,
          varied: rawService.payment.varied
            ? {
                defaultPrice: rawService.payment.varied.defaultPrice
                  ? (rawService.payment.varied.defaultPrice as Money) // Added 'as Money' cast
                  : undefined,
                deposit: rawService.payment.varied.deposit
                  ? (rawService.payment.varied.deposit as Money) // Added 'as Money' cast
                  : undefined,
                minPrice: rawService.payment.varied.minPrice
                  ? (rawService.payment.varied.minPrice as Money) // Added 'as Money' cast
                  : undefined,
                maxPrice: rawService.payment.varied.maxPrice
                  ? (rawService.payment.varied.maxPrice as Money) // Added 'as Money' cast
                  : undefined,
              }
            : undefined,
          custom: rawService.payment.custom
            ? {
                description: rawService.payment.custom.description,
              }
            : undefined,
          options: rawService.payment.options
            ? {
                online: rawService.payment.options.online,
                inPerson: rawService.payment.options.inPerson,
                pricingPlan: rawService.payment.options.pricingPlan,
              }
            : undefined,
        }
      : undefined,
    schedule: rawService.schedule,
  };
};

// Transform services data
const services: Service[] = (rawServicesData as any[]).map(transformRawService);

// Utility to map offeredAs to payment options
const offeredAsToPaymentOptions = (offeredAs: OfferedAsType) =>
  offeredAs === OfferedAsType.OFFLINE
    ? 'In Person'
    : offeredAs === OfferedAsType.ONLINE
    ? 'Online'
    : offeredAs === OfferedAsType.PRICING_PLAN
    ? 'Paid Plans'
    : 'Other';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('serviceId');
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    notFound();
  }

  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    participants: 1,
    paymentMethod: 'Pay now',
  });

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct query parameters
    const queryParams = new URLSearchParams({
      serviceId: serviceId || '',
      name: encodeURIComponent(formData.name),
      email: encodeURIComponent(formData.email),
      phone: encodeURIComponent(formData.phone),
      message: encodeURIComponent(formData.message),
      participants: formData.participants.toString(),
      paymentMethod: encodeURIComponent(formData.paymentMethod),
    }).toString();
    // Redirect to payment page with query parameters
    router.push(`/payment?${queryParams}`);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Format price and duration
  const formattedPrice = service.price ? formatPrice(service.price) : 'Price not available';
  const formattedDuration = service.duration ? `${service.duration} minutes` : '';
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = '1:30 pm'; // Placeholder; could be dynamic based on schedule

  return (
    <div className="max-w-7xl mx-auto font-sans text-gray-800">
      <button
        className="absolute -left-[9999px] focus:static focus:w-auto focus:h-auto focus:p-2 focus:bg-gray-200 focus:border focus:border-gray-300"
        onClick={() => document.getElementById('main-content')?.focus()}
      >
        Skip to Main Content
      </button>

      <header className="bg-gray-100 p-5 text-center">
        <div className="flex justify-between items-center">
          <div>{/* Logo or site title placeholder */}</div>
          <div>
            <button
              className="p-2 m-1 border border-gray-300 bg-gray-200 hover:bg-gray-300 flex items-center gap-2"
              onClick={toggleMobileMenu} // Assuming login button also toggles mobile menu or is a placeholder
              aria-label="Log In"
            >
              <svg viewBox="0 0 50 50" width="24" height="24" aria-hidden="true">
                <path d="M25 48.077c-5.924 0-11.31-2.252-15.396-5.921 2.254-5.362 7.492-8.267 15.373-8.267 7.889 0 13.139 3.044 15.408 8.418-4.084 3.659-9.471 5.77-15.385 5.77m.278-35.3c4.927 0 8.611 3.812 8.611 8.878 0 5.21-3.875 9.456-8.611 9.456s-8.611-4.246-8.611-9.456c0-5.066 3.684-8.878 8.611-8.878M25 0C11.193 0 0 11.193 0 25c0 .915.056 1.816.152 2.705.032.295.091.581.133.873.085.589.173 1.176.298 1.751.073.338.169.665.256.996.135.515.273 1.027.439 1.529.114.342.243.675.37 1.01.18.476.369.945.577 1.406.149.331.308.657.472.98.225.446.463.883.714 1.313.182.312.365.619.56.922.272.423.56.832.856 1.237.207.284.41.568.629.841.325.408.671.796 1.02 1.182.22.244.432.494.662.728.405.415.833.801 1.265 1.186.173.154.329.325.507.475l.004-.011A24.886 24.886 0 0 0 25 50a24.881 24.881 0 0 0 16.069-5.861.126.126 0 0 1 .003.01c.172-.144.324-.309.49-.458.442-.392.88-.787 1.293-1.209.228-.232.437-.479.655-.72.352-.389.701-.78 1.028-1.191.218-.272.421-.556.627-.838.297-.405.587-.816.859-1.24a26.104 26.104 0 0 0 1.748-3.216c.208-.461.398-.93.579-1.406.127-.336.256-.669.369-1.012.167-.502.305-1.014.44-1.53.087-.332.183-.659.256-.996.126-.576.214-1.164.299-1.754.042-.292.101-.577.133-.872.095-.89.152-1.791.152-2.707C50 11.193 38.807 0 25 0" />
              </svg>
              <span>Log In</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="p-5" tabIndex={-1}>
        <section>
          <div>
            <div className="mb-5">
              <button
                className="p-2 border border-gray-300 bg-gray-200 hover:bg-gray-300 flex items-center gap-2"
                onClick={() => window.history.back()}
                type="button"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
                  <path d="M12.2929466,3.99983983 L13.0000534,4.70694661 L7.7015668,10.0028398 L13,15.293 L12.2928932,16.0001068 L6.2895668,10.0061485 L6.2925668,10.0028398 L6.29036026,10 L12.2929466,3.99983983 Z" />
                </svg>
                <span>Back</span>
              </button>
            </div>

            <div className="mb-5">
              <h1 className="text-2xl font-bold mb-2">Client Details</h1>
              <hr className="border-gray-200" />
              <p className="mt-2">Tell us a bit about yourself</p>
            </div>

            <div className="mb-5">
              <span>
                Already have an account?{' '}
                <button
                  className="text-blue-600 hover:underline bg-none border-none p-0"
                  type="button"
                  onClick={toggleMobileMenu} // Example: login might also open a modal or menu
                >
                  Log In
                </button>{' '}
                for faster booking.
              </span>
            </div>

            <div className="flex flex-wrap gap-5">
              <form className="flex-2 min-w-[300px]" onSubmit={handleSubmit} id="booking-form">
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="client-name" className="block font-bold mb-1">
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="client-name"
                      name="name"
                      maxLength={100}
                      required
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <div className="text-sm text-gray-500 text-right">{formData.name.length}/100</div>
                  </div>

                  <div>
                    <label htmlFor="client-email" className="block font-bold mb-1">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="client-email"
                      name="email"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label htmlFor="client-phone" className="block font-bold mb-1">
                      Phone Number
                    </label>
                    <input
                      id="client-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label htmlFor="client-message" className="block font-bold mb-1">
                      Add Your Message
                    </label>
                    <textarea
                      id="client-message"
                      name="message"
                      aria-label="Add Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="participants-dropdown" className="block font-bold mb-1">
                    Number of Participants
                  </label>
                  <div className="relative inline-block border border-gray-300 p-2 bg-white min-w-[150px]">
                    <select
                      id="participants-dropdown"
                      name="participants"
                      value={formData.participants}
                      onChange={handleInputChange}
                      className="w-full bg-transparent appearance-none pr-8"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.2546728,8.18171329 L18.9617796,8.88882007 L12.5952867,15.2537133 L12.5978964,15.2558012 L11.8907896,15.962908 L11.8882867,15.9607133 L11.8874628,15.9617796 L11.180356,15.2546728 L11.1812867,15.2527133 L4.81828671,8.88882007 L5.52539349,8.18171329 L11.8882867,14.5457133 L18.2546728,8.18171329 Z" />
                    </svg>
                  </div>
                </div>

                <fieldset className="mt-5">
                  <legend className="font-bold">Payment</legend>
                  <hr className="border-gray-200 my-2" />
                  <div>
                    <p>{service.name}</p>
                    <div className="relative inline-block border border-gray-300 p-2 bg-white min-w-[150px]">
                       <select
                        id="payment-method-dropdown"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full bg-transparent appearance-none pr-8"
                      >
                        {service.payment?.options
                          ? Object.entries(service.payment.options)
                              .filter(([_, value]) => value) // Filter for true options
                              .map(([key]) => (
                                <option key={key} value={key}>
                                  {offeredAsToPaymentOptions(key as OfferedAsType)}
                                </option>
                              ))
                          : <option value="Pay now">Pay now</option>}
                      </select>
                      <svg
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.2546728,8.18171329 L18.9617796,8.88882007 L12.5952867,15.2537133 L12.5978964,15.2558012 L11.8907896,15.962908 L11.8882867,15.9607133 L11.8874628,15.9617796 L11.180356,15.2546728 L11.1812867,15.2527133 L4.81828671,8.88882007 L5.52539349,8.18171329 L11.8882867,14.5457133 L18.2546728,8.18171329 Z" />
                      </svg>
                    </div>
                  </div>
                </fieldset>
              </form>

              <aside className="flex-1 min-w-[250px] border border-gray-200 p-4 bg-gray-50">
                <div>
                  <button
                    className="w-full flex justify-between items-center text-left"
                    aria-expanded="true" // Assuming it's expanded by default
                    aria-controls="booking-details-content"
                  >
                    <h3 className="text-lg font-bold">Booking Details</h3>
                    <svg
                      className="w-6 h-6 transform rotate-180" // Icon points up for expanded
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M11.8833796,8.18133292 L11.8872867,8.18433292 L11.8900332,8.1824613 L12.5971399,8.88956809 L12.5942867,8.89133292 L18.9617796,15.2535291 L18.2546728,15.9606359 L11.8862867,9.59933292 L5.52539349,15.9606359 L4.81828671,15.2535291 L11.1792867,8.89233292 L11.1762728,8.8884397 L11.8833796,8.18133292 Z" />
                    </svg>
                  </button>
                  <div id="booking-details-content" role="group" className="mt-2">
                    <p>{service.name}</p>
                    <p>{`${formattedDate} at ${formattedTime}`}</p>
                    <p>Joey Dixon</p> {/* Placeholder staff member */}
                    <p>{formattedDuration}</p>
                    <div className="sr-only">{formattedDuration}</div> {/* For screen readers */}
                  </div>
                </div>
                <hr className="border-gray-200 my-4" />
                <div>
                  <h3 className="text-lg font-bold">Payment Details</h3>
                  <div className="flex justify-between mb-2">
                    <div>
                      <p>Subtotal</p>
                      <p>{`${formData.participants} participant${formData.participants > 1 ? 's' : ''} × ${formattedPrice}`}</p>
                    </div>
                    <span>{service.price ? `$${(service.price.value * formData.participants).toFixed(2)}` : 'N/A'}</span>
                  </div>
                  <hr className="border-gray-200 my-2" />
                  <div className="flex justify-between">
                    <p className="font-bold">Total</p>
                    <strong>{service.price ? `$${(service.price.value * formData.participants).toFixed(2)}` : 'N/A'}</strong>
                  </div>
                </div>
                <hr className="border-gray-200 my-4" />
                <div className="text-center">
                  <button
                    className="p-2 border border-gray-300 bg-green-500 text-white hover:bg-green-600 rounded"
                    type="submit"
                    form="booking-form"
                  >
                    Book Now
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 p-5 text-center">
        <p>© 2025 Fitness Demo. All rights reserved.</p>
      </footer>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[1000] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleMobileMenu}
      ></div>
      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 w-[280px] h-full bg-white p-5 shadow-lg transition-transform duration-300 z-[1001] ${
          isMobileMenuOpen ? 'translate-x-0 right-0' : 'translate-x-full right-0' 
        }`}
        aria-hidden={!isMobileMenuOpen}
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
            <li><a href="/" className="block p-2 text-gray-800 no-underline hover:bg-gray-100">Home</a></li>
            {/* Add other navigation items here */}
          </ul>
        </nav>
      </div>
    </div>
  );
}