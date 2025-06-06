"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import { useSearchParams, notFound } from 'next/navigation';
import { FiTag, FiLock, FiCheck } from 'react-icons/fi';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import type {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OrderResponseBody,
} from '@paypal/paypal-js';

import { Plan } from 'lib/plan-types';
import rawPlansData from 'lib/plans.json';
import '.././globals.css';

const plans: Plan[] = rawPlansData as Plan[];

const SubscriptionCheckoutPage: React.FC = () => {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  
  const planDetails = plans.find(p => p._id === planId);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAccount, setUserAccount] = useState<{ name: string } | null>(null);
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderResponseBody | null>(null);

  if (!planDetails) {
    notFound();
    return null;
  }

  const handleAuthAction = (action: 'login' | 'signup') => {
    console.log(`${action} action triggered`);
    setIsLoggedIn(true);
    setUserAccount({ name: 'Christopher Lee' });
    setActiveStep(2);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserAccount(null);
    setActiveStep(1);
  };

  const createOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    console.log('Creating PayPal order...');
    setPaymentError(null);
    setPaymentSuccess(false);
    return actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: planDetails.name,
          amount: {
            currency_code: planDetails.pricing.price.currency,
            value: planDetails.pricing.price.value.toFixed(2),
          },
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      }
    });
  };

  const onApprove = async (data: OnApproveData, actions: any) => {
    console.log('Payment approved. Capturing order...', data);
    if (actions.order) {
      try {
        const details: OrderResponseBody = await actions.order.capture();
        console.log('Payment successful:', details);
        setOrderDetails(details);
        setPaymentSuccess(true);
      } catch (error) {
        console.error('Error capturing PayPal order:', error);
        setPaymentError('Failed to capture payment. Please try again.');
      }
    } else {
      console.error('actions.order is undefined in onApprove');
      setPaymentError('An unexpected error occurred with PayPal. Please try again.');
    }
  };

  const onError = (err: any) => {
    console.error('PayPal Error:', err);
    setPaymentError('An error occurred with PayPal. Please check your details or try again later.');
  };

  const billingCycleText = `every ${planDetails.pricing.subscription?.cycleDuration.unit.toLowerCase()}`;
  const perks = planDetails.perks.values || [];

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
        currency: 'USD',
      }}
    >
      <div className="bg-white min-w-screen min-h-screen">
        <Head>
          <title>Checkout - {planDetails.name}</title>
        </Head>
        <div className="max-w-4xl bg-white mx-auto py-8 px-4">
          <h1 className="text-3xl text-gray-500 mb-2">Checkout</h1>
          <hr className="mb-8 border-gray-300" />

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 space-y-6">
              <div className={`p-6 ${isLoggedIn ? 'border-green-500 bg-white' : 'border-blue-500 bg-white'}`}>
                <header className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 text-black ${isLoggedIn ? 'bg-white' : 'bg-white'}`}>
                      {isLoggedIn ? <FiCheck size={20} /> : '1'}
                    </span>
                    <h2 className="text-xl font-semibold text-gray-700">Sign Up</h2>
                  </div>
                  {isLoggedIn && (
                    <button onClick={handleLogout} className="text-sm text-black hover:text-gray-600 underline">
                      Log Out
                    </button>
                  )}
                </header>
                {activeStep === 1 && (
                  <div>
                    {isLoggedIn && userAccount ? (
                      <p className="text-gray-700">Logged in as {userAccount.name}</p>
                    ) : (
                      <>
                        <p className="text-gray-600 mb-4">
                          To purchase this plan and use its benefits in the future, log in to your account or sign up.
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleAuthAction('signup')}
                            className="px-6 md:w-1/2 py-2 bg-black text-white hover:underline"
                          >
                            Sign Up
                          </button>
                          <button
                            onClick={() => handleAuthAction('login')}
                            className="px-6 md:w-1/2 py-2 bg-white border border-black text-black hover:underline"
                          >
                            Log In
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <hr className="border-gray-300 md:hidden" />

              <div className={`p-6 border-t ${activeStep === 2 ? 'border-gray-500 bg-white' : 'border-gray-300 bg-gray-50'}`}>
                <header className="flex items-center mb-4">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${activeStep === 2 ? 'bg-white text-black' : 'bg-white text-gray-400'}`}>2</span>
                  <h2 className={`text-xl font-semibold ${activeStep === 2 ? 'text-black' : 'text-gray-400'}`}>Payment</h2>
                </header>
                {activeStep === 2 && (
                  <div>
                    {paymentSuccess && orderDetails ? (
                       <div className="p-4 bg-green-100 text-green-700 rounded-md">
                         Payment successful! Thank you for your purchase.
                         <p className="text-sm mt-1">Order ID: {orderDetails.id}</p>
                         <p className="text-sm">Status: {orderDetails.status}</p>
                       </div>
                    ) : (
                      <>
                        <PayPalButtons
                          style={{ layout: "vertical", color: "black", shape: "rect", label: "paypal" }}
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                          forceReRender={[planDetails.pricing.price.value]}
                        />
                        {paymentError && <p className="text-red-500 mt-2 text-sm">{paymentError}</p>}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <div className="bg-white p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Order summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">{planDetails.name}</span>
                    <span className="text-gray-800 font-semibold">${planDetails.pricing.price.value.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{planDetails.description}</p>
                  {perks.length > 0 && (
                      <ul className="text-sm text-gray-500 list-disc list-inside pt-2">
                          {perks.map((perk, i) => <li key={i}>{perk}</li>)}
                      </ul>
                  )}
                </div>

                <hr className="my-4 border-gray-200" />
                
                <button className="flex items-center space-x-2 text-black hover:text-gray-600 underline text-sm mb-4">
                  <FiTag className="w-4 h-4" />
                  <span>Enter a coupon code</span>
                </button>

                <hr className="my-4 border-gray-200" />

                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-gray-700">Total</span>
                    <span className="text-xl font-bold text-gray-800">${planDetails.pricing.price.value.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 text-right">{billingCycleText}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center text-sm text-black">
                <FiLock className="w-4 h-4 mr-2" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default SubscriptionCheckoutPage;