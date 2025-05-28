// src/components/Login.tsx
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import MemberAvatar from './MemberAvatar';

type LoginProps = {
  onActionClick: (isLoggedIn: boolean) => void;
};

const LoginComp = ({ onActionClick }: LoginProps) => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const onLoginClick = async () => {
    onActionClick(isLoggedIn);
    if (isLoggedIn) {
      await signOut({ callbackUrl: '/' });
    } else {
      await signIn(undefined, { callbackUrl: window.location.href });
    }
  };

  return (
    <button
      onClick={onLoginClick}
      className="flex flex-nowrap text-highlight gap-2 justify-center items-center font-open-sans-condensed"
    >
      <div className="w-[22px] h-[22px] fill-highlight">
        <MemberAvatar />
      </div>
      <div className="flex relative whitespace-nowrap">
        {isLoggedIn ? 'Log Out' : 'Log In'}
      </div>
    </button>
  );
};

const LoginNoSsr = dynamic(() => Promise.resolve(LoginComp), { ssr: false });

export default LoginNoSsr;