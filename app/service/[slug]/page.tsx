// src/app/service/[slug]/page.tsx
import { getServiceBySlug } from 'app/model/service/service-api';
import ImageGallery from 'app/components/Image/ImageGallery/ImageGallery';
import { formatPrice } from 'app/utils/price-formtter';
import { OfferedAsType, Service } from 'lib/service-types';
import serviceData from 'lib/services.json'

const offeredAsToPaymentOptions = (offeredAs: OfferedAsType) =>
  offeredAs === OfferedAsType.OFFLINE
    ? 'Offline'
    : offeredAs === OfferedAsType.ONLINE
    ? 'Online'
    : offeredAs === OfferedAsType.PRICING_PLAN
    ? 'Paid Plans'
    : 'Other';

function ServicePageView({ service }: { service: Service }) {
  const formattedPrice = formatPrice(service.price);
  const formattedDuration = service.duration
    ? `${service.duration} minutes`
    : '';

  return (
    <div className="full-w rounded overflow-hidden max-w-7xl mx-auto text-center font-open-sans-condensed">
      <div className="mt-14 mb-8 pb-8 border-b border-white w-full">
        <h1 className="mb-2">{service.name}</h1>
        <p className="pt-4 empty:hidden">{service.tagLine}</p>
        <div className="w-full h-full mt-10 text-center">
          <div className="table text-base border-collapse mx-auto">
            <div className="table-row">
              <p className="table-cell border border-white p-4 empty:hidden">
                {formattedDuration}
              </p>
              <p className="table-cell border border-white p-4 empty:hidden">
                {formattedPrice}
              </p>
              <p className="table-cell border border-white p-4 empty:hidden">
                {service.offeredAs.map(offeredAsToPaymentOptions).join(', ')}
              </p>
            </div>
          </div>
          <div className="mt-14">
            <a
              href={`/bookings/new?serviceId=${service.id}`}
              className="btn-main text-lg px-7"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
      {service.description ? (
        <>
          <h2 className="text-xl">Service Description</h2>
          <p className="w-full mt-4">{service.description}</p>
        </>
      ) : null}
      {service.otherMediaItems?.length ? (
        <section className="mt-10">
          <ImageGallery mediaItems={service.otherMediaItems} />
        </section>
      ) : null}
      <div className="w-full h-full pt-14 pb-10 text-center">
        <div className="mt-14">
          <a
            href={`/bookings/new?serviceId=${service.id}`}
            className="btn-main text-lg px-7"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const { data: service } = await getServiceBySlug(params.slug);

  return (
    <div className="max-w-full-content mx-auto px-6 sm:px-28">
      {service ? (
        <ServicePageView service={service} />
      ) : (
        <div className="text-3xl w-full text-center p-9 box-border">
          The service was not found
        </div>
      )}
    </div>
  );
}