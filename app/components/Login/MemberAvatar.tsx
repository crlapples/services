// src/components/Login/MemberAvatar.tsx
'use client';
import { useSession } from 'next-auth/react';

export default function MemberAvatar() {
  const { data: session } = useSession();

  const profilePicture = session?.profilePicture || '/images/default-avatar.png';
  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'U';

  return (
    <div className="w-10 h-10 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
      {profilePicture ? (
        <img
          src={profilePicture}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-600 text-lg md:text-2xl">{initials}</span>
      )}
    </div>
  );
}