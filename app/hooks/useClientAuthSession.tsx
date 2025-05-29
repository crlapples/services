// src/hooks/useClientAuthSession.ts
'use client';
import { useContext } from 'react';
import { AppContext } from 'lib/context';

export const useClientAuthSession = () => {
  return useContext(AppContext);
};