import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ItemCard from './ItemCard';
import AddItem from './AddItem';
export const dynamic = 'force-dynamic';

export default async function Items() {
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

  async function getItems() {
    const supabase = createClient();
    const { data, error } = await supabase.from('Redeemable_Items').select();
    if (error) {
      return error;
    }
    return data;
  }

  const items = await getItems();

  return (
    <div className="container mx-auto px-4 py-10">
      <AddItem />
      <div className="flex gap-4 p-4 m-4 flex-col lg:flex-row flex-wrap justify-center">
        {items.map(
          ({ name, image_url, is_available, description, point_cost, id }) => (
            <ItemCard
              key={id}
              id={id}
              name={name}
              imageUrl={image_url}
              isAvailable={is_available}
              description={description}
              pointsCost={point_cost}
            />
          )
        )}
      </div>
    </div>
  );
}
