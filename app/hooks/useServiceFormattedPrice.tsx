// src/hooks/useFormattedPrice.ts
import { useMemo } from 'react';

export const useFormattedPrice = (price: { value: number; currency: string }) => {
  return useMemo(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
    });
    return {
      userFormattedPrice: formatter.format(price.value),
    };
  }, [price]);
};