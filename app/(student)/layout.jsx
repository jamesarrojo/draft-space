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
    <div className="flex flex-col min-h-screen">
      <Navbar user={data.session.user} menuItems={menuItems} />
      <div className="flex-1">{children}</div>
      <Toaster />
      <footer className="text-center text-xs p-4 border mt-16">
        <p>© {new Date().getFullYear()} DraftSpace. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

const menuItems = [
  { route: '/transactions-history', label: 'Transactions History' },
  { route: '/redeem-items', label: 'Redeem Items' },
  { route: '/redemptions-history', label: 'Redemptions History' },
  { route: '/send-feedback', label: 'Send Feedback' },
];
