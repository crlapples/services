// hooks/useLocalAvailability.ts
import { useState, useEffect } from 'react';
import type { CalendarAvailability } from 'lib/calendar-availability';

export const useLocalAvailability = () => {
  const [data, setData] = useState<CalendarAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/calendarAvailability.json');
        if (!response.ok) {
          throw new Error('Failed to fetch calendar availability');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};