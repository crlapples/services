// src/services/member-api.ts
import { getAuthSession } from '@/lib/auth'; // Your auth provider

export interface Member {
  id: string;
  email?: string;
  name?: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  // Add other fields you need
}

export const getCurrentMember = async (): Promise<Member | null> => {
  try {
    // 1. Get current session (replace with your auth system)
    const session = await getAuthSession();
    if (!session?.userId) return null;

    // 2. Fetch member data (replace with your actual data source)
    // Option 1: Direct database access
    // const member = await db.member.findUnique({ where: { id: session.userId } });
    
    // Option 2: API call to your backend
    const response = await fetch('/api/members/current', {
      headers: {
        'Authorization': `Bearer ${session.token}` // If using JWT
      }
    });

    if (!response.ok) throw new Error('Failed to fetch member');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching current member:', error);
    return null;
  }
};