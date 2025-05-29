// src/services/member-api.ts
import getAuthSession from 'lib/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Member } from 'lib/member-types';

export const getCurrentMember = async (): Promise<Member | null> => {
  try {
    const session = await getAuthSession();
    if (!session?.userId) return null;
    const db = getFirestore();
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
      nickname: data.nickname,
    };
  } catch (error) {
    console.error('Error fetching current member:', error);
    return null;
  }
};