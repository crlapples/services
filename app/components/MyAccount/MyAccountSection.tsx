// src/components/MyAccount/MyAccountSection.tsx
import MyAccountMenu from './MyAccountMenu';
import MemberAvatar from '../Login/MemberAvatar';
import { Member } from 'lib/member-types';
import { redirect } from 'next/navigation';

export default function MyAccountSection({
  children,
  member,
}: {
  children: React.ReactNode;
  member: Member | null;
}) {
  if (!member) {
    redirect('/auth/signin?callbackUrl=/account/my-account');
  }

  return (
    <div className="max-w-full-content mx-auto flex flex-col md:flex-row gap-6 py-12 px-6 items-stretch">
      <div className="min-w-[250px] flex flex-col gap-6">
        <div className="w-full bg-gray-c2 p-6 flex md:flex-col items-center gap-4">
          <MemberAvatar />
          <div className="whitespace-nowrap font-open-sans-condensed text-sm">
            {member.nickname || member.name || 'User'}
          </div>
        </div>
        <div className="w-full bg-gray-c2 p-6">
          <MyAccountMenu />
        </div>
      </div>
      <div className="bg-gray-c2 grow p-7">{children}</div>
    </div>
  );
}