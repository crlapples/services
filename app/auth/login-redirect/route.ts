// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_LOGIN_CALLBACK_PARAM, PROMPT_QUERY_PARAM } from 'app/model/auth/auth.const';
import { signIn } from 'next-auth/react';

export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get(AUTH_LOGIN_CALLBACK_PARAM) || '/';
  const prompt = searchParams.get(PROMPT_QUERY_PARAM) ?? 'login';

  // NextAuth.js handles the redirect to the sign-in page
  // Since this is an API route, we simulate the signIn redirect
  const signInUrl = new URL('/auth/signin', request.url);
  signInUrl.searchParams.set('callbackUrl', callbackUrl);
  if (prompt) {
    signInUrl.searchParams.set('prompt', prompt);
  }

  return NextResponse.redirect(signInUrl);
}