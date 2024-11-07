import TableStatus from '@/components/TableStatus';
import { Toaster } from '@/components/ui/toaster';
import { createClient } from '@/utils/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default async function Home() {
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

  // redirect to this route if account is admin
  if (user?.role === 'admin') {
    redirect('/admin/transactions');
  }

  async function getTables() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tables/`);

    const tables = await data.json();

    return tables.data;
  }

  const tables = await getTables();

  return (
    <main>
      <h1>DraftSpace</h1>
      {/* {data.session.user.email} */}
      {tables.map(({ id, is_occupied }) => (
        <TableStatus key={id} tableNumber={id} isOccupied={is_occupied} />
      ))}
      <Toaster />
    </main>
  );
}
