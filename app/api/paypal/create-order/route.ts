import { NextApiRequest, NextApiResponse } from 'next';
import paypal from '@paypal/checkout-server-sdk';
import { verifyAuthToken } from 'lib/auth';

const configureEnvironment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  
  return process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

const client = new paypal.core.PayPalHttpClient(configureEnvironment());

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).json({ 
      error: 'Method not allowed' 
    });
  }

  try {
    // Verify authentication
    await verifyAuthToken(req.headers.authorization);

    const { 
      orderId: internalOrderId,
      amount, 
      currency, 
      description,
      isSubscription,
      returnUrl,
      cancelUrl
    } = req.body;

    if (isSubscription) {
      // Create subscription
      const request = new paypal.billing.SubscriptionsCreateRequest();
      request.requestBody({
        plan_id: getPayPalPlanId(req.body.planId), // Map to your PayPal plan
        application_context: {
          brand_name: process.env.NEXT_PUBLIC_SITE_NAME,
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
        custom_id: internalOrderId,
      });

      const response = await client.execute(request);
      return res.status(200).json({ 
        orderId: response.result.id,
        subscriptionId: response.result.id
      });
    } else {
      // Create one-time payment
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          custom_id: internalOrderId,
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: description,
        }],
        application_context: {
          brand_name: process.env.NEXT_PUBLIC_SITE_NAME,
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      });

      const response = await client.execute(request);
      return res.status(200).json({ orderId: response.result.id });
    }
  } catch (error) {
    console.error('PayPal error:', error);
    return res.status(500).json({ 
      error: 'Failed to create PayPal order',
      details: error instanceof Error ? error.message : undefined
    });
  }
}

function getPayPalPlanId(planId: string): string {
  // Map your internal plan IDs to PayPal plan IDs
  const planMap: Record<string, string> = {
    'premium_monthly_123': 'P-123456789',
    'annual_subscription_456': 'P-987654321',
    // Add all your subscription plans
  };
  
  if (!planMap[planId]) {
    throw new Error(`No PayPal plan configured for ${planId}`);
  }
  
  return planMap[planId];
}