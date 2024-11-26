import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from './LogoutButton';
import Logo from './icon_smaller_screen.svg';
// shadcn
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

import { createClient } from '@/utils/supabase/server';
import { Button } from './ui/button';

export default async function Navbar({ user, menuItems }) {
  // get student points balance
  async function fetchPoints(email) {
    const supabase = createClient();
    const {
      data: { points_balance: points, role },
      error,
    } = await supabase.from('Students').select().eq('email', email).single();
    return { points, role };
  }

  const { points, role } = await fetchPoints(user.email);
  return (
    <div className="flex justify-between mx-2 p-2 items-center h-16">
      <Link href="/">
        <Image
          className="flex-none h-10 w-auto"
          src={Logo}
          alt="DraftSpace logo"
          width={150}
          quality={100}
        />
      </Link>
      <NavigationMenu className="hidden lg:flex items-center gap-1">
        <NavigationMenuList>
          {menuItems.map(({ route, label }) => (
            <NavigationMenuItem key={route}>
              <Link href={route} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="hidden lg:flex gap-4 ml-auto items-center">
        {role === 'student' && <p>Points: {points}</p>}
        {user && <p>{user.email}</p>}
        <LogoutButton />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <NavigationMenu className="items-start mt-4">
            <NavigationMenuList className="flex flex-col items-start">
              {menuItems.map(({ route, label }) => (
                <NavigationMenuItem key={route}>
                  <SheetClose asChild>
                    {/* I removed the `legacyBehavior` prop inside the Link component
                    and the `SheetClose` now works!*/}
                    <Link href={route} passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {label}
                      </NavigationMenuLink>
                    </Link>
                  </SheetClose>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="justify-stretch flex flex-col gap-4 py-2 px-4 mb-4">
            {role === 'student' && <p>Points: {points}</p>}
            {user && <p>{user.email}</p>}
            <LogoutButton />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
