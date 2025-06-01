// src/app/training/page.tsx
import PlansList from 'app/components/Plan/PlanList';
import ServiceListPreviewView from 'app/components/ServiceList/ServiceListPreview';
import { getServices } from 'app/model/service/service-api';
import { getPlans } from 'app/service/plans-api';
import rawServicesData from 'lib/services.json'; // Import raw JSON data
import { Service, ServiceType, OfferedAsType } from 'lib/service-types'; // Import necessary types

// Transform the raw JSON data to conform to the Service[] type
const servicesData: Service[] = rawServicesData.map(s => ({
  // Spread existing properties from the JSON object
  ...s,
  // Override properties that need type casting or specific handling
  type: s.type as ServiceType, // Cast string 'INDIVIDUAL' to enum ServiceType.INDIVIDUAL
  offeredAs: s.offeredAs as OfferedAsType[], // Cast string[] to OfferedAsType[] (e.g., ["OFFLINE"] to [OfferedAsType.OFFLINE])
  
  // Handle nested properties that might need casting
  mainMedia: s.mainMedia ? {
    ...s.mainMedia,
    // Cast mainMedia.type from string (e.g., "image") to 'image' | 'video'
    // Assuming Image type (from lib/image-types) for mainMedia has a 'type' property compatible with 'image' | 'video'
    // This matches MediaItem.type definition.
    type: s.mainMedia.type as 'image' | 'video', 
  } : undefined, // Handle cases where mainMedia might be missing, though present in sample JSON

  payment: s.payment ? {
    ...s.payment,
    // Cast payment.rateType from string (e.g., "FIXED") to the string literal union type
    rateType: s.payment.rateType ? s.payment.rateType as 'FIXED' | 'VARIED' | 'NO_FEE' : undefined,
    // Assuming the rest of the payment structure (e.g., s.payment.fixed.price) is compatible
    // with the Money type and other nested structures in Service['payment'].
  } : undefined, // Handle cases where payment might be missing

  // Properties from JSON like id, slug, name, description, category, price are assumed to be structurally compatible.
  // Optional properties in the Service interface not present in the JSON (e.g., tagLine, duration) will remain undefined.
}));

export default async function TrainingPage() {
  const {
    data: { services }, // These services are from getServices API, not the JSON file.
  } = await getServices({ limit: 3 });
  const { data: plans } = await getPlans({ limit: 3 });

  return (
    <>
      <div className="px-3 py-12">
        <h1 className="text-center">Create</h1>
      </div>
      {/* Use the transformed servicesData which now conforms to Service[] */}
      <ServiceListPreviewView services={servicesData} />
      <div className="px-3 py-12">
        <h2 className="title text-center">Plans & Pricing</h2>
      </div>
      <PlansList plans={plans} />
    </>
  );
}