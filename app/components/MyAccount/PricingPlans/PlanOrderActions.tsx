// src/components/PlanOrderActions.tsx
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { cancelPlanOrder } from 'lib/plan-orders-api';

export type PlanOrderActionsProps = {
  id: string;
};

export default function PlanOrderActions({ id }: PlanOrderActionsProps) {
  const [error, setError] = useState('');
  const { data: session } = useSession();

  const handleCancel = async () => {
    try {
      setError('');
      await cancelPlanOrder(session, id);
      window.location.reload();
    } catch (e) {
      console.error(e);
      setError('Failed to cancel plan order');
    }
  };

  return error ? (
    <span className="text-red-600">{error}</span>
  ) : (
    <div className="text-highlight flex gap-2 underline text-sm">
      <button onClick={handleCancel}>Cancel Plan</button>
    </div>
  );
}