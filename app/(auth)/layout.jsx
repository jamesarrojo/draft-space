import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import Logo from '../../components/icon_smaller_screen.svg';
import Image from 'next/image';
export default async function AuthLayout({ children }) {
  const supabase = createClient({ cookies });

  const { data } = await supabase.auth.getSession();

  if (data.session) {
    redirect('/');
  }

  return (
    <>
      <nav className="flex justify-between p-2 mx-2">
        <Link href="/">
          <Image
            className="flex-none h-10 w-auto"
            src={Logo}
            alt="DraftSpace logo"
            width={150}
            quality={100}
          />
        </Link>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </nav>
      {children}
    </>
  );
}
