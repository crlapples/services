import './page.css';
import DayCalendar from '@app/components/Calendar/DayCalendar/DayCalendar';

// Mock service data - replace with your actual data fetching
const getServiceBySlug = async (slug: string) => {
  // In a real app, you might fetch this from an API or local JSON
  return {
    id: 'service_123',
    name: 'Yoga Class',
    duration: '1 hour',
    payment: {
      price: 50
    },
    info: {
      name: 'Yoga Class',
      formattedDuration: '1 hour'
    }
  };
};

export default async function CalendarPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);

  return (
    <div className="max-w-full-content mx-auto bg-gray-c2 pb-10">
      {service ? (
        <>
          <section className="align-middle box-border p-7 pt-16 text-left">
            <h1 className="mb-4">{service.info.name}</h1>
            <p className="text-stone-300 font-open-sans-condensed text-lg">
              Check out our availability and book the date and time that works
              for you
            </p>
          </section>

          <div
            key={service.id}
            className="full-w rounded overflow-hidden max-w-7xl mx-auto text-stone-300"
          >
            <DayCalendar service={service} />
          </div>
        </>
      ) : (
        <div className="text-3xl w-full text-center p-9 box-border">
          The service was not found
        </div>
      )}
    </div>
  );
}