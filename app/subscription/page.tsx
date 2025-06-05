"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import { FiTag, FiLock } from 'react-icons/fi';
import { PayPalButtons } from '@paypal/react-paypal-js';
import type {
    CreateOrderData,
    CreateOrderActions,
    OnApproveData,
    OrderResponseBody,
} from '@paypal/paypal-js';

const SubscriptionCheckoutPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderResponseBody | null>(null);

  const planDetails = {
    name: 'Private Membership',
    price: 375.00,
    duration: '12 months',
    sessions: 4,
    billingCycle: 'every month',
    disclaimer: 'You will be charged monthly for 12 months.',
  };

  const handleAuthAction = (action: 'login' | 'signup') => {
    console.log(`${action} action triggered`);
    setActiveStep(2);
  };

  const createOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    console.log('Creating PayPal order...');
    setPaymentError(null);
    setPaymentSuccess(false);
    return actions.order.create({
      // Add the intent property here
      intent: 'CAPTURE', // Or 'AUTHORIZE' if you want to capture later
      purchase_units: [
        {
          description: planDetails.name,
          amount: {
            currency_code: 'USD',
            value: planDetails.price.toFixed(2),
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

  return (
    <>
      <Head>
        <title>Checkout - {planDetails.name}</title>
      </Head>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Checkout</h1>
        <hr className="mb-8 border-gray-300" />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Steps */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Step 1: Sign Up */}
            <div className={`p-6 border rounded-lg ${activeStep === 1 ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-50'}`}>
              <header className="flex items-center mb-4">
                <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 text-white ${activeStep === 1 ? 'bg-blue-600' : 'bg-gray-400'}`}>1</span>
                <h2 className="text-xl font-semibold text-gray-700">Sign Up</h2>
              </header>
              {activeStep === 1 && (
                <div>
                  <p className="text-gray-600 mb-4">
                    To purchase this plan and use its benefits in the future, log in to your account or sign up.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAuthAction('signup')}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => handleAuthAction('login')}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150"
                    >
                      Log In
                    </button>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-300 md:hidden" />

            {/* Step 2: Payment */}
            <div className={`p-6 border rounded-lg ${activeStep === 2 ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-50'}`}>
              <header className="flex items-center mb-4">
                <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 text-white ${activeStep === 2 ? 'bg-blue-600' : 'bg-gray-400'}`}>2</span>
                <h2 className="text-xl font-semibold text-gray-700">Payment</h2>
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
                      <p className="text-gray-600 mb-4">
                        Please complete your payment using PayPal.
                      </p>
                      <PayPalButtons
                        style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        forceReRender={[planDetails.price]}
                      />
                      {paymentError && <p className="text-red-500 mt-2 text-sm">{paymentError}</p>}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full md:w-1/3">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Order summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">{planDetails.name}</span>
                  <span className="text-gray-800 font-semibold">${planDetails.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500">Duration: {planDetails.duration}</p>
                <p className="text-sm text-gray-500">Sessions: {planDetails.sessions}</p>
              </div>

              <hr className="my-4 border-gray-200" />
              
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm mb-4">
                <FiTag className="w-4 h-4" />
                <span>Enter a coupon code</span>
              </button>

              <hr className="my-4 border-gray-200" />

              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-gray-700">Total</span>
                  <span className="text-xl font-bold text-gray-800">${planDetails.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 text-right">{planDetails.billingCycle}</p>
                <p className="text-xs text-gray-500 mt-1">{planDetails.disclaimer}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <FiLock className="w-4 h-4 mr-2" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionCheckoutPage;