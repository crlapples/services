// src/utils/price-formatter.ts
export const formatCurrency = (
  price: number | string = 0,
  currency: string = 'USD'
): string =>
  Intl.NumberFormat('en', { style: 'currency', currency }).format(Number(price));

export const formatPrice = (
  price?: { value: number; currency: string },
  defaultFreeText: string = 'Free'
): string => {
  if (!price) {
    return defaultFreeText;
  }
  return formatCurrency(price.value, price.currency);
};