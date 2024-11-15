'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout(e) {
    e.preventDefault();
    // setError('');
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { error } = await supabase.auth.signOut();

    if (error) {
      // setError(error.message);
      console.log({ error });
    }

    if (!error) {
      router.push('/login');
    }
  }
  return <Button onClick={handleLogout}>Logout</Button>;
}
