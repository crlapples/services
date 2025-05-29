// app/api/paypal/capture-order/route.ts
import { NextResponse } from 'next/server'
import paypal from '@paypal/checkout-server-sdk'

const client = new paypal.core.PayPalHttpClient(
  process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!
      )
)

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId)
    const response = await client.execute(captureRequest)

    return NextResponse.json({
      status: response.result.status,
      details: response.result,
    })
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture PayPal order' },
      { status: 500 }
    )
  }
}

// Optionally add other HTTP methods if needed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}