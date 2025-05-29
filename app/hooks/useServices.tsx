// src/hooks/useServices.ts
import { useQuery } from '@tanstack/react-query';
import { getFirestore, collection, query, where, getDocs, limit as firestoreLimit } from 'firebase/firestore';
import { Service } from 'lib/service-types';
import { useContext } from 'react';
import { AppContext } from 'lib/context';

export const useServices = ({
  limit,
  categoryId,
}: {
  limit?: number;
  categoryId?: string;
} = {}) => {
  const { firestore } = useContext(AppContext) || {};

  return useQuery({
    queryKey: ['services', limit, categoryId],
    queryFn: async () => {
      if (!firestore) {
        return [];
      }

      let servicesQuery = query(collection(firestore, 'services'));
      if (categoryId) {
        servicesQuery = query(servicesQuery, where('category.id', '==', categoryId));
      }
      if (limit) {
        servicesQuery = query(servicesQuery, firestoreLimit(limit));
      }

      const snapshot = await getDocs(servicesQuery);
      const services: Service[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        services.push({
          id: doc.id,
          slug: data.slug,
          name: data.name,
          description: data.description,
          tagLine: data.tagLine,
          type: data.type,
          category: data.category,
          mainMedia: data.mainMedia,
          price: data.price
            ? {
                value: Number(data.price.value),
                currency: data.price.currency,
              }
            : undefined,
        } as Service);
      });

      return services;
    },
    enabled: !!firestore,
  });
};