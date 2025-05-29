// src/services/plan-orders-api.ts
import getAuthSession from 'lib/auth';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { PlanOrder } from 'lib/plan-types';
import { getPlanById } from '@app/model/service/plans';

export const getMyPlanOrders = async (): Promise<{ data: PlanOrder[] }> => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) return { data: [] };

    const db = getFirestore();
    const ordersQuery = query(
      collection(db, 'planOrders'),
      where('memberId', '==', session.userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(ordersQuery);
    const planOrders: PlanOrder[] = [];

    for (const doc of snapshot.docs) {
      const order = { _id: doc.id, ...doc.data() } as PlanOrder;
      const { data: plan } = await getPlanById(order._id);
      planOrders.push({
        ...order,
        planName: plan?.name || 'Unknown Plan',
      });
    }

    return { data: planOrders };
  } catch (error) {
    console.error('Error fetching plan orders:', error);
    return { data: [] };
  }
};