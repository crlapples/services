// src/app/account/my-account/page.tsx
import MyAccountSection from 'app/components/MyAccount/MyAccountSection';
import getAuthSession from 'lib/auth';
import { getCurrentMember } from 'app/model/members/members-api';

export default async function MyAccountPage() {
  const session = await getAuthSession();
  const { member } = await getCurrentMember(session);

  if (!member) {
    return (
      <MyAccountSection member={null}>
        <p>Please sign in to view your account details.</p>
      </MyAccountSection>
    );
  }

  return (
    <MyAccountSection member={member}>
      <h2 className="text-highlight text-4xl">My Account</h2>
      <div className="text-sm font-open-sans-condensed py-2">
        <p className="pt-2">
          Here you can manage your orders for both pricing plans and bookings and
          view your member details
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
        <div>
          Name: {member.contact?.firstName ?? ''} {member.contact?.lastName ?? ''}
        </div>
        <div>Login Email: {member.loginEmail ?? ''}</div>
        <div>Nickname: {member.profile?.nickname ?? ''}</div>
        <div>Phone: {member.contact?.phones?.[0] ?? ''}</div>
      </div>
    </MyAccountSection>
  );
}