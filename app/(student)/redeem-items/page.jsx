import { createClient } from '@/utils/supabase/server';
import ItemCard from './ItemCard';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default async function RedeemItems() {
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

  // if user is not verfied and a student redirect to /please-verify
  if (user?.role === 'student' && !user?.is_verified) {
    redirect('/please-verify');
  }

  const studentId = activeSession.session.user.id;
  const {
    data: { points_balance },
    error,
  } = await supabase
    .from('Students')
    .select('points_balance')
    .eq('supabase_id', studentId)
    .single();

  async function getItems() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Redeemable_Items')
      .select()
      .eq('is_available', true);
    if (error) {
      return error;
    }
    return data;
  }

  const items = await getItems();

  return (
    <div>
      {items.map(({ name, image_url, description, point_cost, id }) => (
        <ItemCard
          studentId={studentId}
          studentPoints={points_balance}
          key={id}
          itemId={id}
          name={name}
          imageUrl={image_url}
          description={description}
          pointsCost={point_cost}
        />
      ))}
    </div>
  );
}
