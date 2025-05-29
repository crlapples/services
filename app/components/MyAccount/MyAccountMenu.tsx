// src/components/MyAccount/MyAccountMenu.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { StyledNavLink } from 'app/components/Layout/NavBar/NavLink';

const navbarItems = [
  { scroll: true, ref: '/account/my-account', label: 'My Account' },
  { scroll: true, ref: '/account/bookings', label: 'My Bookings' },
  { scroll: true, ref: '/account/plans', label: 'My Plans' },
];

export default function MyAccountMenu() {
  const pathname = usePathname();
  const [linkRef, setLinkRef] = useState(pathname ?? '/account/my-account');

  return (
    <ul className="flex flex-row md:flex-col gap-6 md:gap-4 start text-md leading-[22px]">
      {navbarItems.map(({ ref, label, scroll }) => (
        <li key={ref} className="relative">
          <StyledNavLink
            isActive={ref === linkRef}
            href={ref}
            onClick={() => setLinkRef(ref)}
            scroll={scroll}
            className="normal-case"
          >
            {label}
          </StyledNavLink>
        </li>
      ))}
    </ul>
  );
}