import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';

// 1. Configure PayPal environment
const getPayPalEnvironment = () => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error('Missing PayPal credentials in environment variables');
  }

  return process.env.NODE_ENV === 'development'
    ? new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
};

const paypalClient = new paypal.core.PayPalHttpClient(getPayPalEnvironment());

// 2. Subscription plan mapping
const getPayPalPlanId = (internalPlanId: string): string => {
  const planMappings: Record<string, string> = {
    premium_monthly_123: 'P-123456789',
    annual_subscription_456: 'P-987654321',
  };

  const planId = planMappings[internalPlanId];
  if (!planId) {
    throw new Error(`No PayPal plan configured for ${internalPlanId}`);
  }

  return planId;
};

// 3. Main route handler
export async function POST(request: Request) {
  try {
    const {
      orderId: internalOrderId,
      amount,
      currency,
      description,
      isSubscription,
      returnUrl,
      cancelUrl,
      planId
    } = await request.json();

    if (isSubscription) {
      // Handle subscription flow
      const subscriptionRequest = new paypal.billing.SubscriptionsCreateRequest();
      subscriptionRequest.requestBody({
        plan_id: getPayPalPlanId(planId),
        application_context: {
          brand_name: process.env.NEXT_PUBLIC_SITE_NAME || 'Our Service',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
        custom_id: internalOrderId,
      });

      const subscription = await paypalClient.execute(subscriptionRequest);
      return NextResponse.json({
        orderId: subscription.result.id,
        subscriptionId: subscription.result.id
      });
    } else {
      // Handle one-time payment flow
      const orderRequest = new paypal.orders.OrdersCreateRequest();
      orderRequest.requestBody({
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
          brand_name: process.env.NEXT_PUBLIC_SITE_NAME || 'Our Service',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      });

      const order = await paypalClient.execute(orderRequest);
      return NextResponse.json({ orderId: order.result.id });
    }
  } catch (error) {
    console.error('PayPal processing error:', error);
    
    const statusCode = 500;
    const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';

    return NextResponse.json(
      { 
        error: 'Payment processing failed',
        details: errorMessage 
      },
      { status: statusCode }
    );
  }
}

// 4. Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: { 'Allow': 'POST' } 
    }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: { 'Allow': 'POST' } 
    }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: { 'Allow': 'POST' } 
    }
  );
}
