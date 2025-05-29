// app/api/paypal/capture-order/route.ts
import { NextResponse } from 'next/server'
import paypal from '@paypal/checkout-server-sdk'
import verifyAuthToken from 'lib/auth'

const configureEnvironment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  
  return process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret)
}

const client = new paypal.core.PayPalHttpClient(configureEnvironment())

function getPayPalPlanId(planId: string): string {
  const planMap: Record<string, string> = {
    'premium_monthly_123': 'P-123456789',
    'annual_subscription_456': 'P-987654321',
  }
  
  if (!planMap[planId]) {
    throw new Error(`No PayPal plan configured for ${planId}`)
  }
  
  return planMap[planId]
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    await verifyAuthToken(authHeader || '')

    const { 
      orderId: internalOrderId,
      amount, 
      currency, 
      description,
      isSubscription,
      returnUrl,
      cancelUrl,
      planId
    } = await request.json()

    if (isSubscription) {
      const subRequest = new paypal.billing.SubscriptionsCreateRequest()
      subRequest.requestBody({
        plan_id: getPayPalPlanId(planId),
        application_context: {
          brand_name: process.env.NEXT_PUBLIC_SITE_NAME,
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
        custom_id: internalOrderId,
      })

      const response = await client.execute(subRequest)
      return NextResponse.json({ 
        orderId: response.result.id,
        subscriptionId: response.result.id
      })
    } else {
      const orderRequest = new paypal.orders.OrdersCreateRequest()
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
          brand_name: process.env.NEXT_PUBLIC_SITE_NAME,
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      })

      const response = await client.execute(orderRequest)
      return NextResponse.json({ orderId: response.result.id })
    }
  } catch (error) {
    console.error('PayPal error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create PayPal order',
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { 
      status: 405,
      headers: { 'Allow': 'POST' } 
    }
  )
}