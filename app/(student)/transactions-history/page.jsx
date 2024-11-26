import { createClient } from '@/utils/supabase/server';
import { DataTable } from './data-table';
import { columns } from './columns';
import { redirect } from 'next/navigation';

export default async function TransactionsHistory() {
  const supabase = createClient();
  const { data: activeSession } = await supabase.auth.getSession();
  const studentId = activeSession.session.user.id;

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

  // if user is not verfied and a student redirect to /please-verify
  if (user?.role === 'student' && !user?.is_verified) {
    redirect('/please-verify');
  }

  async function getTransactions() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Transactions')
      .select()
      .eq('student_number', studentId)
      .order('created_at', { ascending: false });
    if (error) {
      return error;
    }

    return data;
  }
  const transactions = await getTransactions();
  return (
    <div className="container mx-auto py-10">
      <DataTable data={transactions} columns={columns} />
    </div>
  );
}
