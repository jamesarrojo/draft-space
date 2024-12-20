import { createClient } from '@/utils/supabase/server';
// import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';

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
      <Navbar user={data.session.user} menuItems={menuItems} />
      {children}
      <Toaster />
    </>
  );
}

const menuItems = [
  { route: '/admin/transactions', label: 'Transactions' },
  { route: '/admin/reservations', label: 'Reservations' },
  { route: '/admin/students', label: 'Students' },
  { route: '/admin/items', label: 'Items' },
  { route: '/admin/redemptions', label: 'Redemptions' },
  { route: '/admin/feedback', label: 'Feedback' },
];
