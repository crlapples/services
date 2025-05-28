// src/services/plan-orders-api.ts
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Session } from 'next-auth';
import { PlanOrder } from 'lib/plan-types';

export const cancelPlanOrder = async (session: Session | null, orderId: string): Promise<void> => {
  if (!session?.userId) {
    throw new Error('Unauthorized: No user session found');
  }

  try {
    const db = getFirestore();
    const orderRef = doc(db, 'planOrders', orderId);
    await updateDoc(orderRef, {
      status: 'CANCELED',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error canceling plan order:', error);
    throw new Error('Failed to cancel plan order');
  }
};