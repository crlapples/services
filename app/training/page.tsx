// src/app/training/page.tsx
import PlansList from 'app/components/Plan/PlanList';
import ServiceListPreviewView from 'app/components/ServiceList/ServiceListPreview';
import { getServices } from 'app/model/service/service-api';
import { getPlans } from 'app/service/plans-api';

export default async function TrainingPage() {
  const {
    data: { services },
  } = await getServices({ limit: 3 });
  const { data: plans } = await getPlans({ limit: 3 });

  return (
    <>
      <div className="px-3 py-12">
        <h1 className="text-center">Training</h1>
      </div>
      <ServiceListPreviewView services={services} />
      <div className="px-3 py-12">
        <h2 className="title text-center">Plans & Pricing</h2>
      </div>
      <PlansList plans={plans} />
    </>
  );
}