// src/app/api/checkout/redirect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPlanById, getCheckoutUrl } from 'app/model/service/plans'

export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const planId = searchParams.get('planId');
  const checkoutData = searchParams.get('checkoutData');
  const baseUrl = new URL('/', request.url).toString();

  if (!planId) {
    console.error('planId is required for checkout redirect');
    return NextResponse.redirect(baseUrl);
  }

  try {
    const { data: plan, hasError } = await getPlanById(planId);
    if (hasError || !plan) {
      console.error(`Plan not found: ${planId}`);
      return NextResponse.redirect(baseUrl);
    }

    const checkoutUrl = new URL(getCheckoutUrl(plan), baseUrl);
    if (checkoutData) {
      checkoutUrl.searchParams.set('checkoutData', checkoutData);
    }

    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    console.error('Checkout redirect error:', error);
    return NextResponse.redirect(baseUrl);
  }
}