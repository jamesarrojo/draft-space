import { createClient } from '@/utils/supabase/server';
import ItemCard from './ItemCard';
export const dynamic = 'force-dynamic';

export default async function RedeemItems() {
  const supabase = createClient();
  const { data: activeSession } = await supabase.auth.getSession();

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
