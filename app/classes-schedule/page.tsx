import WeeklyClassesCalendar from '@app/components/Calendar/WeeklyClassesCalendar/WeeklyClassesCalendar';

// Mock classes data - replace with your actual data fetching
const getClasses = async () => {
  // In a real app, you might fetch this from an API or local JSON
  return [
    { id: 'class_1', name: 'Yoga Class' },
    { id: 'class_2', name: 'Pilates Class' },
    { id: 'class_3', name: 'Meditation Session' }
  ];
};

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <div className="max-w-full-content mx-auto mt-14 px-4">
      <h1 className="text-center">Book Online</h1>
      <div className="w-full border-b border-gray-600 mt-7 mb-3"></div>

      {classes?.length ? (
        <WeeklyClassesCalendar
          classes={classes.map(({ id, name }) => ({ id, name }))}
        />
      ) : (
        <h2>
          No classes or group sessions are offered at the moment.
        </h2>
      )}
    </div>
  );
}