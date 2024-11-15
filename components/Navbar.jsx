import Link from 'next/link';
import Image from 'next/image';
import Logo from './default-monochrome-black.svg';
import LogoutButton from './LogoutButton';

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
import { createClient } from '@/utils/supabase/server';

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
    <nav>
      <Link href="/">
        <Image
          src={Logo}
          alt="DraftSpace logo"
          width={150}
          // placeholder="blur"
          quality={100}
        />
      </Link>
      <NavigationMenu>
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
      {role === 'student' && <span>Points: {points}</span>}
      {user && <span>Hello, {user.email}</span>}
      <LogoutButton />
    </nav>
  );
}
