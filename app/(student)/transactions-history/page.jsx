import { createClient } from '@/utils/supabase/server';
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function TransactionsHistory() {
  const supabase = createClient();
  const { data: activeSession } = await supabase.auth.getSession();
  const studentId = activeSession.session.user.id;

  async function getTransactions() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Transactions')
      .select()
      .eq('student_number', studentId);
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
