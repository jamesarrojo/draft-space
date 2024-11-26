import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DataTable } from './data-table';
import { columns } from './columns';
export const dynamic = 'force-dynamic';

async function getRedemptions() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/redemptions`
  );

  return data.json();
}

export default async function Redemptions() {
  const supabase = createClient();
  const { data: activeSession } = await supabase.auth.getSession();

  if (!activeSession.session) {
    // we use this because we can't do router.push() on a server component
    redirect('/login');
    // but if user is logged in and tries to access /login or /register, redirect them to dashboard
  }
  const userId = activeSession.session.user.id;
  const { data: user } = await supabase
    .from('Students')
    .select('*')
    .eq('supabase_id', userId)
    .single();

  // redirect to this route if account is not an admin
  if (user?.role === 'student') {
    redirect('/');
  }

  const { redemptionsData } = await getRedemptions();
  return (
    <div className="container mx-auto px-4 py-10">
      <DataTable data={redemptionsData} columns={columns} />
    </div>
  );
}
