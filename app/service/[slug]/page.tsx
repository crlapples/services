// src/app/service/[slug]/page.tsx
import ImageGallery from 'app/components/Image/ImageGallery/ImageGallery';
import { formatPrice } from 'app/utils/price-formtter';
import { Service, ServiceType, OfferedAsType, Money } from 'lib/service-types';
import { Image } from 'lib/image-types'
import rawServicesData from 'lib/services.json';

const transformRawService = (rawService: any): Service => {
  return {
    id: rawService.id,
    slug: rawService.slug,
    name: rawService.name,
    description: rawService.description,
    tagLine: rawService.tagLine,
    type: rawService.type as ServiceType,
    category: {
      id: rawService.category.id,
      name: rawService.category.name,
    },
    mainMedia: rawService.mainMedia ? {
      id: rawService.mainMedia.id,
      url: rawService.mainMedia.url,
      altText: rawService.mainMedia.altText,
      type: rawService.mainMedia.type as 'image' | 'video',
    } as Image : undefined,
    otherMediaItems: rawService.otherMediaItems ? rawService.otherMediaItems.map((item: any) => ({
      id: item.id,
      url: item.url,
      altText: item.altText,
      type: item.type as 'image' | 'video',
    })) as Image[] : undefined,
    price: rawService.price ? {
      value: rawService.price.value,
      currency: rawService.price.currency,
    } as Money : undefined,
    duration: rawService.duration,
    offeredAs: rawService.offeredAs.map((oa: string) => oa as OfferedAsType),
    payment: rawService.payment ? {
      rateType: rawService.payment.rateType as 'FIXED' | 'VARIED' | 'NO_FEE' | undefined,
      // Corrected 'fixed' property:
      fixed: (rawService.payment.fixed && rawService.payment.fixed.price)
        ? { price: rawService.payment.fixed.price as Money } // If fixed.price exists, it's Money
        : undefined, // Otherwise, the entire 'fixed' object is undefined
      varied: rawService.payment.varied ? {
        defaultPrice: rawService.payment.varied.defaultPrice ? rawService.payment.varied.defaultPrice as Money : undefined,
        deposit: rawService.payment.varied.deposit ? rawService.payment.varied.deposit as Money : undefined,
        minPrice: rawService.payment.varied.minPrice ? rawService.payment.varied.minPrice as Money : undefined,
        maxPrice: rawService.payment.varied.maxPrice ? rawService.payment.varied.maxPrice as Money : undefined,
      } : undefined,
      custom: rawService.payment.custom ? {
        description: rawService.payment.custom.description,
      } : undefined,
      options: rawService.payment.options ? {
        online: rawService.payment.options.online,
        inPerson: rawService.payment.options.inPerson,
        pricingPlan: rawService.payment.options.pricingPlan,
      } : undefined,
    } : undefined,
    schedule: rawService.schedule,
  };
};

// Transform the entire array of services from JSON
const services: Service[] = (rawServicesData as any[]).map(transformRawService);

const offeredAsToPaymentOptions = (offeredAs: OfferedAsType) =>
  offeredAs === OfferedAsType.OFFLINE
    ? 'Offline'
    : offeredAs === OfferedAsType.ONLINE
    ? 'Online'
    : offeredAs === OfferedAsType.PRICING_PLAN
    ? 'Paid Plans'
    : 'Other';

function ServicePageView({ service }: { service: Service }) {
  const formattedPrice = service.price ? formatPrice(service.price) : 'Price not available';
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
              href={`/confirmation?serviceId=${service.id}`}
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
      {service.otherMediaItems && service.otherMediaItems.length > 0 ? (
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

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = services.find(s => s.slug === params.slug);

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