// src/app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_LOGIN_CALLBACK_PARAM } from 'app/model/auth/auth.const';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get(AUTH_LOGIN_CALLBACK_PARAM) || '/';
  
  // NextAuth.js handles callback internally at /api/auth/callback/[provider]
  // Redirect to the original callback URL after authentication
  return NextResponse.redirect(callbackUrl);
}