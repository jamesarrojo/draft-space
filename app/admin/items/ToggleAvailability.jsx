'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ToggleAvailability({ id, children }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleToggle() {
    setIsLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/redeemable_items/${id}?action=availability`,
      {
        method: 'PUT',
      }
    );
    const { error } = await res.json();
    if (!error) {
      router.refresh();
    }
    setIsLoading(false);
  }
  return (
    <Button disabled={isLoading} onClick={handleToggle}>
      {children}
    </Button>
  );
}
