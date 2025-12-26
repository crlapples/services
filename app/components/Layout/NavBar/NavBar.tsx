'use client';
import { useCallback, useState } from 'react';
import type { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import Login from '@app/components/Login/Login';
import { StyledNavLink } from '@app/components/Layout/NavBar/NavLink';

const navbarItems = [
  { scroll: true, ref: '/', label: 'Home' },
  { scroll: false, ref: '/#about', label: 'About' },
  { scroll: false, ref: '/#workspace', label: 'Workspace' },
  { scroll: true, ref: '/services', label: 'Services' },
  { scroll: true, ref: '/classes-schedule', label: 'Book Online' },
  { scroll: true, ref: '/plans', label: 'Plans & Pricing' },
  { scroll: false, ref: '/#contact', label: 'Contact' },
  {
    scroll: true,
    ref: '/account/my-account',
    label: 'My Account',
    prefetch: false,
  },
];

export function NavBar() {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const pathname = usePathname();
  const [linkRef, setLinkRef] = useState<LinkProps['href']>(pathname!);
  const toggleOpen = useCallback(
    () => setIsMenuShown(!isMenuShown),
    [isMenuShown]
  );
  return (
    <>
      <nav
        className={`${
          isMenuShown ? 'max-md:w-full' : 'max-md:w-0 max-md:opacity-0'
        } w-full transition-all duration-500 ease-in-out md:block overflow-hidden max-md:absolute max-md:animate-sideways-once max-md:h-screen max-md:bg-gray-c2 max-md:pt-24 z-40 top-0 right-0`}
      >
        <ul className="flex flex-col items-center md:flex-row gap-10 md:gap-4 min-[900px]:gap-5 lg:gap-8 start text-md leading-[22px] px-6">
          {navbarItems.map(({ ref, label, scroll, prefetch }) => (
            <li key={ref} className="relative">
              <StyledNavLink
                isActive={ref === linkRef}
                href={ref}
                onClick={() => {
                  setLinkRef(ref);
                  setIsMenuShown(false);
                }}
                scroll={scroll}
                prefetch={prefetch}
              >
                {label}
              </StyledNavLink>
              <span className="absolute -bottom-5 md:hidden w-48 left-[calc(50%_-_theme(space.24))]" />
            </li>
          ))}
          <li className="order-first md:order-last justify-end grow">
            <div className="flex flex-nowrap text-highlight gap-2 sm:justify-end justify-center items-center">
              <Login onActionClick={() => setIsMenuShown(false)} />
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}
