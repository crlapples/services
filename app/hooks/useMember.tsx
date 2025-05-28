// src/hooks/useMember.ts
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentMember } from '@app/model/members/members-api';

export interface MemberResponse {
  member: {
    id: string;
    profile?: {
      photo?: {
        url?: string;
      };
      name?: string;
      email?: string;
    };
  };
}

export const useCurrentMember = () => {
  const { data: session } = useSession();

  return useQuery<MemberResponse, Error>({
    queryKey: ['currentMember', session?.userId],
    queryFn: async () => {
      const member = await getCurrentMember();
      if (!member) throw new Error('No member found');
      return {
        member: {
          id: member.id,
          profile: {
            photo: member.profilePicture ? { url: member.profilePicture } : undefined,
            name: member.name,
            email: member.email,
          },
        },
      };
    },
    enabled: !!session?.userId,
  });
};