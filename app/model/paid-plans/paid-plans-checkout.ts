import { Plan } from '@/types/plan';

export const getCheckoutUrl = (plan: Plan): string => {
  return `/checkout/${plan._id}`;
};

export const createPayPalOrder = async (plan: Plan): Promise<string> => {
  try {
    const response = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: plan._id,
        amount: plan.pricing.price.value,
        currency: plan.pricing.price.currency,
        description: `${plan.name} Membership`,
        isSubscription: !!plan.pricing.subscription,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const { orderId } = await response.json();
    return orderId;
  } catch (error) {
    console.error('PayPal order creation error:', error);
    throw error;
  }
};

export const capturePayPalOrder = async (orderId: string): Promise<{ success: boolean; details?: any }> => {
  try {
    const response = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      throw new Error('Failed to capture PayPal order');
    }

    const result = await response.json();
    return { success: true, details: result };
  } catch (error) {
    console.error('PayPal capture error:', error);
    return { success: false };
  }
};