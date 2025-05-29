// src/app/account/my-account/page.tsx
import MyAccountSection from 'app/components/MyAccount/MyAccountSection';
import getAuthSession from 'lib/auth';
import { getCurrentMember } from 'app/model/members/members-api';

export default async function MyAccountPage() {
  const session = await getAuthSession();

    return (
        <p>Please sign in to view your account details.</p>

    );
  }