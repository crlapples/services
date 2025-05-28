// src/services/member-api.ts
import { getAuthSession } from 'lib/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export interface Member {
  id: string;
  email?: string;
  name?: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const getCurrentMember = async (): Promise<Member | null> => {
  try {
    // Get current session
    const session = await getAuthSession();
    if (!session?.userId) return null;

    // Initialize Firestore
    const db = getFirestore();

    // Fetch member data from Firestore
    const memberDoc = await getDoc(doc(db, 'members', session.userId));
    if (!memberDoc.exists()) {
      return {
        id: session.userId,
        email: session.user?.email ?? undefined,
        name: session.user?.name ?? undefined,
        profilePicture: session.profilePicture,
      };
    }

    const data = memberDoc.data() as Partial<Member>;
    return {
      id: session.userId,
      email: data.email ?? session.user?.email ?? undefined,
      name: data.name ?? session.user?.name ?? undefined,
      profilePicture: data.profilePicture ?? session.profilePicture,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    };
  } catch (error) {
    console.error('Error fetching current member:', error);
    return null;
  }
};