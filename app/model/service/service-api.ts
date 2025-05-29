// src/services/services-api.ts
import { getFirestore, collection, getDocs, query, where, doc, getDoc, limit } from 'firebase/firestore';
import { Service, OfferedAsType } from 'lib/service-types';

export const getServices = async ({
  limit: maxResults = 10,
}: { limit?: number } = {}): Promise<{ data: { services: Service[] } }> => {
  try {
    const db = getFirestore();
    const servicesQuery = query(collection(db, 'services'), limit(maxResults));
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
        mainMedia: data.mainMedia
          ? {
              url: data.mainMedia.url,
              alt: data.mainMedia.altText,
              width: data.mainMedia.width,
              height: data.mainMedia.height,
            }
          : undefined,
        otherMediaItems: data.otherMediaItems
          ? data.otherMediaItems.map((item: any) => ({
              url: item.url,
              alt: item.altText,
              width: item.width,
              height: item.height,
            }))
          : undefined,
        price: data.price
          ? {
              value: Number(data.price.value),
              currency: data.price.currency,
            }
          : undefined,
        duration: data.duration ? Number(data.duration) : undefined,
        offeredAs: data.offeredAs || [OfferedAsType.OFFLINE],
        payment: data.payment,
        schedule: data.schedule,
      } as Service);
    });

    return { data: { services } };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { data: { services: [] } };
  }
};

export const getServiceBySlug = async (slug: string): Promise<{ data: Service | null }> => {
  try {
    const db = getFirestore();
    const servicesQuery = query(collection(db, 'services'), where('slug', '==', slug));
    const snapshot = await getDocs(servicesQuery);
    if (snapshot.empty) {
      return { data: null };
    }
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      data: {
        id: doc.id,
        slug: data.slug,
        name: data.name,
        description: data.description,
        tagLine: data.tagLine,
        type: data.type,
        category: data.category,
        mainMedia: data.mainMedia
          ? {
              url: data.mainMedia.url,
              alt: data.mainMedia.altText,
              width: data.mainMedia.width,
              height: data.mainMedia.height,
            }
          : undefined,
        otherMediaItems: data.otherMediaItems
          ? data.otherMediaItems.map((item: any) => ({
              url: item.url,
              alt: item.altText,
              width: item.width,
              height: item.height,
            }))
          : undefined,
        price: data.price
          ? {
              value: Number(data.price.value),
              currency: data.price.currency,
            }
          : undefined,
        duration: data.duration ? Number(data.duration) : undefined,
        offeredAs: data.offeredAs || [OfferedAsType.OFFLINE],
        payment: data.payment,
        schedule: data.schedule,
      } as Service,
    };
  } catch (error) {
    console.error('Error fetching service:', error);
    return { data: null };
  }
};

export const getServiceById = async (id: string): Promise<{ data: Service | null }> => {
  try {
    const db = getFirestore();
    const serviceRef = doc(db, 'services', id);
    const docSnap = await getDoc(serviceRef);
    if (!docSnap.exists()) {
      return { data: null };
    }
    const data = docSnap.data();
    return {
      data: {
        id: docSnap.id,
        slug: data.slug,
        name: data.name,
        description: data.description,
        tagLine: data.tagLine,
        type: data.type,
        category: data.category,
        mainMedia: data.mainMedia
          ? {
              url: data.mainMedia.url,
              alt: data.mainMedia.altText,
              width: data.mainMedia.width,
              height: data.mainMedia.height,
            }
          : undefined,
        otherMediaItems: data.otherMediaItems
          ? data.otherMediaItems.map((item: any) => ({
              url: item.url,
              alt: item.altText,
              width: item.width,
              height: item.height,
            }))
          : undefined,
        price: data.price
          ? {
              value: Number(data.price.value),
              currency: data.price.currency,
            }
          : undefined,
        duration: data.duration ? Number(data.duration) : undefined,
        offeredAs: data.offeredAs || [OfferedAsType.OFFLINE],
        payment: data.payment,
        schedule: data.schedule,
      } as Service,
    };
  } catch (error) {
    console.error('Error fetching service:', error);
    return { data: null };
  }
};