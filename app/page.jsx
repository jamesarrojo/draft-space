import { createClient } from '@/utils/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    // we use this because we can't do router.push() on a server component
    redirect('/login');

    // but if user is logged in and tries to access /login or /register, redirect them to dashboard
  }
  return (
    <main>
      <h1>DraftSpace</h1>
      {data.session.user.email}
    </main>
  );
}
