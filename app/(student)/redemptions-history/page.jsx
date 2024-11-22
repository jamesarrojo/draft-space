import { createClient } from '@/utils/supabase/server';
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function RedemptionsHistory() {
  const supabase = createClient();
  const { data: activeSession } = await supabase.auth.getSession();
  const studentId = activeSession.session.user.id;

  async function getRedemptions() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Redemptions')
      .select('*, Redeemable_Items (name)')
      .eq('student_id', studentId);
    if (error) {
      return error;
    }

    const redemptionsData = data.map(({ Redeemable_Items, ...rest }) => ({
      ...rest,
      item_name: Redeemable_Items?.name,
    }));

    return redemptionsData;
  }
  const redemptions = await getRedemptions();
  console.log(redemptions.length);
  return (
    <div className="container mx-auto py-10">
      <DataTable data={redemptions} columns={columns} />
    </div>
  );
}
