import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AuthLayout({ children }) {
  const supabase = createClient({ cookies });

  const { data } = await supabase.auth.getSession();

  if (data.session) {
    redirect('/');
  }

  return (
    <>
      <nav className="flex">
        <h1 className="mr-auto">DraftSpace</h1>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
      </nav>
      {children}
    </>
  );
}
