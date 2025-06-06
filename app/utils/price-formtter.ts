// src/utils/price-formatter.ts

/**
 * The core currency formatting function.
 * It now accepts an optional 'options' object to control formatting.
 */
export const formatCurrency = (
  price: number | string = 0,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions // <-- ADDED THIS PARAMETER
): string => {
  // Default options that will always be applied
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
  };

  // Merge the default options with any custom options provided
  const finalOptions = { ...defaultOptions, ...options };

  return Intl.NumberFormat('en', finalOptions).format(Number(price));
}


/**
 * The main price formatting utility.
 * It now accepts an optional 'options' object and passes it to formatCurrency.
 */
export const formatPrice = (
  price?: { value: number; currency: string },
  options?: Intl.NumberFormatOptions, // <-- ADDED THIS PARAMETER
  defaultFreeText: string = 'Free'
): string => {
  if (!price) {
    return defaultFreeText;
  }
  // Pass the options object along to the core formatter
  return formatCurrency(price.value, price.currency, options);
};