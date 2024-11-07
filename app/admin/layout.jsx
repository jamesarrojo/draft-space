import { createClient } from '@/utils/supabase/server';
// import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// components
import Navbar from '@/components/Navbar';

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    // we use this because we can't do router.push() on a server component
    redirect('/login');
    // but if user is logged in and tries to access /login or /register, redirect them to dashboard
  }

  return (
    <>
      <Navbar user={data.session.user} />
      {children}
    </>
  );
}
