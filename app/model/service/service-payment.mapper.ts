// src/services/service-payment.mapper.ts
import { Service, Money } from 'lib/service-types';

export type ServicePaymentDto = ReturnType<typeof mapServicePaymentDto>;

type PriceTypeDto = 'dynamic' | 'static' | 'text';

export function mapServicePaymentDto(service: Service): {
  defaultPrice?: MoneyDto;
  depositPrice?: MoneyDto;
  minPrice?: MoneyDto;
  maxPrice?: MoneyDto;
  priceType: PriceTypeDto;
  priceText?: string;
} {
  let defaultPrice = undefined;
  let depositPrice = undefined;
  let minPrice = undefined;
  let maxPrice = undefined;
  let priceText = undefined;
  let priceType: PriceTypeDto = 'text';

  switch (service.payment?.rateType) {
    case 'FIXED':
      defaultPrice = mapServiceMoneyDto(service.payment?.fixed?.price);
      depositPrice = mapServiceMoneyDto(service.payment?.fixed?.price);
      priceType = 'static';
      break;
    case 'VARIED':
      defaultPrice = mapServiceMoneyDto(service.payment?.varied?.defaultPrice);
      depositPrice = mapServiceMoneyDto(service.payment?.varied?.deposit);
      minPrice = mapServiceMoneyDto(service.payment?.varied?.minPrice);
      maxPrice = mapServiceMoneyDto(service.payment?.varied?.maxPrice);
      priceType = 'dynamic';
      break;
    case 'NO_FEE':
      priceText = service.payment?.custom?.description ?? undefined;
      break;
    default:
      break;
  }

  return {
    defaultPrice,
    depositPrice,
    priceText,
    priceType,
    maxPrice,
    minPrice,
  };
}

export type MoneyDto = ReturnType<typeof mapServiceMoneyDto>;

export const mapServiceMoneyDto = (money?: Money) => {
  return money
    ? {
        currency: money.currency,
        price: Number(money.value),
      }
    : undefined;
};