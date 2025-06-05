'use client';

import { formatPrice } from 'app/utils/price-formtter';
import { Service, OfferedAsType, Money, ServiceType } from 'lib/service-types';
import { Image } from 'lib/image-types'
import rawServicesData from 'lib/services.json';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
// @ts-ignore
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import '.././globals.css'

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
    ? 'Paid Plans'
    : 'Other';


export default function PaymentPage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  // Decode parameters after getting them
  const nameParam = searchParams.get('name');
  const emailParam = searchParams.get('email');
  const phoneParam = searchParams.get('phone');

  const nameFromParams = nameParam ? decodeURIComponent(nameParam) : '';
  const emailFromParams = emailParam ? decodeURIComponent(emailParam) : '';
  const phoneFromParams = phoneParam ? decodeURIComponent(phoneParam) : '';
  
  const participants = parseInt(searchParams.get('participants') || '1', 10);
  const paymentMethodFromUrl = searchParams.get('paymentMethod') || 'Pay now';

  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    notFound();
  }

  const [formData, setFormData] = useState({
    firstName: nameFromParams.split(' ')[0] || 'Christopher',
    lastName: nameFromParams.split(' ').slice(1).join(' ') || 'Lee',
    email: emailFromParams,
    phone: phoneFromParams,
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    formPaymentChoice: service.payment?.options
        ? Object.keys(service.payment.options).find(key => service.payment!.options![key as keyof typeof service.payment.options]) || 'Pay now'
        : 'Pay now',
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPaymentStepVisible, setIsPaymentStepVisible] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const { firstName, lastName, email, phone } = formData;
    setIsFormValid(
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.includes('@') &&
      phone.trim() !== ''
    );
  }, [formData]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleContinueToPayment = () => {
    if (isFormValid) {
      setIsPaymentStepVisible(true);
    } else {
      alert('Please fill in all required customer details.');
    }
  };

  const formattedPrice = service.price ? formatPrice(service.price) : 'Price not available';
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = '1:30 pm';
  const totalAmount = service.price ? (service.price.value * participants).toFixed(2) : '0.00';

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
        currency: 'USD',
      }}
    >
      <div className="max-w-7xl text-gray-800 bg-white">
        <button
          className="absolute -left-[9999px] focus:static focus:w-auto focus:h-auto focus:p-2 focus:bg-gray-200 focus:border focus:border-gray-300"
          onClick={() => document.getElementById('main-content')?.focus()}
        >
          Skip to Main Content
        </button>

        <main id="main-content" className="p-5" tabIndex={-1}>
          <section>
            <div className="flex justify-between items-center mx-20 mb-5">
              <div className="flex gap-2">
                <Link href="/" className="text-2xl mt-2 font-bold no-underline uppercase">fitness-demo</Link>
                <h1 className="text-2xl mt-2" aria-label="CHECKOUT">CHECKOUT</h1>
              </div>
              <Link href="/" className="text-black hover:underline">Continue Browsing</Link>
            </div>
            <hr className="border-gray-200 mb-5" />

            <div className="flex flex-wrap gap-8 mx-20">
              <section className="flex-[3_1_0%] min-w-[320px] bg-white p-5 rounded shadow-sm" aria-label="Checkout form section">
                <div className="bg-gray-100 p-2 mb-5">
                  <span>
                    Have an account?{' '}
                    <button
                      className="text-black underline bg-none border-none p-0"
                      type="button"
                      onClick={toggleMobileMenu}
                    >
                      Log in
                    </button>
                  </span>
                </div>

                {!isPaymentStepVisible && (
                  <div>
                    <div className="border-b border-gray-200 pb-2 mb-5">
                      <h2 className="text-lg font-bold">Customer details</h2>
                    </div>
                    <form aria-label="Customer Details Form" onSubmit={(e) => e.preventDefault()}>
                      <fieldset>
                        <div className="mb-4">
                          <label htmlFor="checkout-email" className="block font-bold text-sm text-gray-600 mb-1">
                            Email<span className="text-black">*</span>
                          </label>
                          <input id="checkout-email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="checkout-first-name" className="block font-bold text-sm text-gray-600 mb-1">
                              First name<span className="text-black">*</span>
                            </label>
                            <input id="checkout-first-name" name="firstName" type="text" required value={formData.firstName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded"/>
                          </div>
                          <div>
                            <label htmlFor="checkout-last-name" className="block font-bold text-sm text-gray-600 mb-1">
                              Last name<span className="text-black">*</span>
                            </label>
                            <input id="checkout-last-name" name="lastName" type="text" required value={formData.lastName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded"/>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="checkout-phone" className="block font-bold text-sm text-gray-600 mb-1">
                            Phone<span className="text-black">*</span>
                          </label>
                          <input id="checkout-phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded"/>
                        </div>
                      </fieldset>
                      <div className="text-right mt-5">
                        <button
                          type="button"
                          className="p-3 w-full bg-black text-white"
                          disabled={!isFormValid}
                          onClick={handleContinueToPayment}
                        >
                          Continue
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {isPaymentStepVisible && (
                  <div className="mt-5">
                    <div className="border-b border-gray-200 pb-2 mb-5">
                      <h2 className="text-lg font-bold">Payment</h2>
                    </div>
                    <div>
                      <PayPalButtons
                        style={{ layout: 'vertical' }}
                        disabled={!isFormValid}
                        createOrder={(data: any, actions: any) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: 'USD',
                                  value: totalAmount,
                                  breakdown: {
                                    item_total: { currency_code: 'USD', value: totalAmount },
                                  },
                                },
                                items: [
                                  {
                                    name: service.name,
                                    quantity: participants.toString(),
                                    unit_amount: {
                                      currency_code: 'USD',
                                      value: service.price ? service.price.value.toFixed(2) : '0.00',
                                    },
                                  },
                                ],
                              },
                            ],
                          });
                        }}
                        onApprove={async (data: any, actions: any) => {
                          if (actions.order) {
                            const details = await actions.order.capture();
                            console.log('Payment successful:', {
                              ...formData,
                              serviceId,
                              participants,
                              paymentMethodFromUrl,
                              paypalOrderId: data.orderID,
                              details,
                            });
                            alert('Payment successful!');
                          }
                        }}
                        onError={(err: any) => {
                          console.error('PayPal error:', err);
                          alert('An error occurred with the payment. Please try again.');
                        }}
                      />
                    </div>
                  </div>
                )}
              </section>

              <aside className="flex-[2_1_0%] h-full min-w-[280px] bg-gray-100" aria-labelledby="summary-section-title">
                <div className="flex justify-between items-center mx-5 mt-5 mb-4">
                  <h2 id="summary-section-title" className="text-lg font-bold">Order summary</h2>
                  <hr className="text-gray-600" />
                  <span>({participants})<span className="sr-only"> item{participants > 1 ? 's' : ''}</span></span>
                </div>

                <ul className="list-none mx-5" aria-label="Items in your order">
                  <li className="flex gap-4 mb-4 pb-4 border-b border-gray-600">
                    <div className="w-[60px]">
                      <img
                        src={service.mainMedia?.url || 'https://via.placeholder.com/60x34.png?text=Service'}
                        alt={service.mainMedia?.alt || service.name}
                        className="w-full h-auto rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="font-bold">{service.name}</span>
                        <span className="font-bold">{service.price ? `$${(service.price.value * participants).toFixed(2)}` : 'N/A'}</span>
                      </div>
                      <div className="text-sm text-black mt-1">
                        <span>{`${formattedDate} at ${formattedTime}`}</span>
                      </div>
                      <button
                        type="button"
                        className="text-black hover:underline bg-none border-none p-0 text-sm mt-1 flex items-center gap-1"
                      >
                        More Details
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.2546728,8.18171329 L18.9617796,8.88882007 L12.5952867,15.2537133 L12.5978964,15.2558012 L11.8907896,15.962908 L11.8882867,15.9607133 L11.8874628,15.9617796 L11.180356,15.2546728 L11.1812867,15.2527133 L4.81828671,8.88882007 L5.52539349,8.18171329 L11.8882867,14.5457133 L18.2546728,8.18171329 Z" />
                        </svg>
                      </button>
                    </div>
                  </li>
                </ul>

                <div>
                  <button
                    type="button"
                    className="text-black hover:underline flex items-center mx-5 gap-1"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M14.5,3.9997 C15.327,3.9997 16,4.6727 16,5.4997 L16,5.4997 L16,9.6577 C16,10.1847 15.787,10.6997 15.414,11.0727 L15.414,11.0727 L9.925,16.5607 C9.643,16.8437 9.266,16.9997 8.865,16.9997 C8.464,16.9997 8.087,16.8437 7.804,16.5607 L7.804,16.5607 L3.439,12.1957 C2.854,11.6107 2.854,10.6597 3.439,10.0747 L3.439,10.0747 L8.928,4.5857 C9.306,4.2077 9.808,3.9997 10.342,3.9997 L10.342,3.9997 Z M14.5,4.9997 L10.342,4.9997 C10.075,4.9997 9.824,5.1037 9.635,5.2927 L9.635,5.2927 L4.146,10.7817 C3.952,10.9767 3.952,11.2937 4.146,11.4887 L4.146,11.4887 L8.511,15.8537 C8.701,16.0427 9.031,16.0427 9.218,15.8537 L9.218,15.8537 L14.707,10.3657 C14.893,10.1787 15,9.9207 15,9.6577 L15,9.6577 L15,5.4997 C15,5.2237 14.776,4.9997 14.5,4.9997 Z M11.293,7.293 C11.684,6.902 12.316,6.902 12.707,7.293 C13.098,7.684 13.098,8.316 12.707,8.707 C12.316,9.098 11.684,9.098 11.293,8.707 C10.902,8.316 10.902,7.684 11.293,7.293 Z" />
                    </svg>
                    <span>Enter a promo code</span>
                  </button>
                </div>

                <hr className="border-gray-600 mt-4 mx-5" />

                <section className="mt-4 mb-5 mx-5" aria-label="Total due breakdown">
                    <dl className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-black">Subtotal</dt>
                        <dd className="font-bold">{service.price ? `$${(service.price.value * participants).toFixed(2)}` : 'N/A'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-black">Sales Tax</dt>
                        <dd className="font-bold">$0.00</dd>
                      </div>
                      <hr className="border-gray-600 my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <dt>Total</dt>
                        <dd>{service.price ? `$${totalAmount}` : 'N/A'}</dd>
                      </div>
                    </dl>
                </section>
                <div className="w-full flex justify-center bg-white items-center text-sm text-black mt-4 py-4">
                  <svg className="w-3 h-3.5 mr-2" viewBox="0 0 11 14" aria-hidden="true">
                    <g fill="currentColor" fillRule="evenodd">
                      <path d="M0 12.79c0 .558.445 1.01.996 1.01h9.008A1 1 0 0 0 11 12.79V6.01c0-.558-.445-1.01-.996-1.01H.996A1 1 0 0 0 0 6.01v6.78Z"></path>
                      <path d="M9.5 5v-.924C9.5 2.086 7.696.5 5.5.5c-2.196 0-4 1.586-4 3.576V5h1v-.924c0-1.407 1.33-2.576 3-2.576s3 1.17 3 2.576V5h1Z" fillRule="nonzero" />
                    </g>
                  </svg>
                  <span>Secure Checkout</span>
                </div>
              </aside>
            </div>
          </section>
        </main>

        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onClick={toggleMobileMenu}
          aria-hidden={!isMobileMenuOpen}
        ></div>
        <div
          className={`fixed top-0 w-[280px] h-full bg-white p-5 shadow-lg transition-transform duration-300 z-50 ${
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
    </PayPalScriptProvider>
  );
}