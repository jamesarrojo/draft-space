'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteItem({ id, children }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleToggle() {
    setIsLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/redeemable_items/${id}`,
      {
        method: 'DELETE',
      }
    );
    const { error } = await res.json();
    if (!error) {
      router.refresh();
    }
    setIsLoading(false);
  }
  return (
    <Button variant="destructive" disabled={isLoading} onClick={handleToggle}>
      {children}
    </Button>
  );
}
