// src/app/service/by-id/[serviceId]/page.tsx
import { getServiceById } from 'app/model/service/service-api';
import { Service } from 'lib/service-types';
import { mapServiceInfo } from 'app/model/service/service.mapper';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from 'app/utils/price-formtter';

export default async function ServiceByIdPage({ params }: { params: { serviceId: string } }) {
  const { data: service } = await getServiceById(params.serviceId);

  if (!service) {
    notFound();
  }

  const serviceInfo = mapServiceInfo(service);
  if (!serviceInfo) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl mb-4">{serviceInfo.info.name}</h1>
      {serviceInfo.info.media.mainMedia && (
        <Image
          src={serviceInfo.info.media.mainMedia.url}
          alt={serviceInfo.info.media.mainMedia.alt as string}
          width={serviceInfo.info.media.mainMedia.width}
          height={serviceInfo.info.media.mainMedia.height}
          className="w-full h-auto mb-4"
        />
      )}
      <p className="text-lg mb-4">{serviceInfo.info.description}</p>
      {serviceInfo.info.tagLine && (
        <p className="text-md italic mb-4">{serviceInfo.info.tagLine}</p>
      )}
      <p className="mb-4">Category: {serviceInfo.categoryName}</p>
      {serviceInfo.info.formattedDuration && (
        <p className="mb-4">Duration: {serviceInfo.info.formattedDuration}</p>
      )}
      {serviceInfo.payment.paymentDetails.defaultPrice && (
        <p className="mb-4">
          Price: {formatPrice({
            value: serviceInfo.payment.paymentDetails.defaultPrice.price,
            currency: serviceInfo.payment.paymentDetails.defaultPrice.currency,
          })}
        </p>
      )}
      <a
        href={`/bookings/new?serviceId=${service.id}`}
        className="btn-main inline-block mt-4"
      >
        Book Now
      </a>
    </div>
  );
}