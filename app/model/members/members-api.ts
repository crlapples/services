// src/app/model/members/members-api.ts
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Session } from 'next-auth';

export interface Member {
  id: string;
  loginEmail?: string;
  contact?: {
    firstName?: string;
    lastName?: string;
    phones?: string[];
  };
  profile?: {
    nickname?: string;
  };
}

export async function getCurrentMember(session: Session | null): Promise<{ member: Member | null }> {
  if (!session?.userId) {
    return { member: null };
  }

  try {
    const db = getFirestore();
    const userRef = doc(db, 'users', session.userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return {
        member: {
          id: session.userId,
          loginEmail: session.user?.email || '',
          contact: {
            firstName: session.user?.name?.split(' ')[0],
            lastName: session.user?.name?.split(' ')[1],
            phones: [],
          },
          profile: { nickname: session.user?.name },
        },
      };
    }

    const data = userSnap.data();
    return {
      member: {
        id: session.userId,
        loginEmail: data.email || session.user?.email,
        contact: {
          firstName: data.firstName,
          lastName: data.lastName,
          phones: data.phones || [],
        },
        profile: { nickname: data.nickname },
      },
    };
  } catch (error) {
    console.error('Error fetching member:', error);
    return { member: null };
  }
}