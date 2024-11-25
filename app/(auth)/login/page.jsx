'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  async function handleSubmit(e, email, password) {
    e.preventDefault();
    setError('');
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    if (!error) {
      router.push('/');
    }
  }
  return (
    <div className="flex flex-col gap-8 mt-8 ">
      <h1 className="text-center text-2xl">Login</h1>
      <form
        onSubmit={(e) => handleSubmit(e, email, password)}
        className="flex flex-col gap-4 lg:w-1/5 self-center"
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />
        <Button>Submit</Button>
      </form>
      {error && <p className="text-center text-red-600">{error}.</p>}
    </div>
  );
}
