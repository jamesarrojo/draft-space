// moved from app/
import TableStatus from '@/components/TableStatus';
import { Toaster } from '@/components/ui/toaster';
import { createClient } from '@/utils/supabase/server';
import { createServerClient } from '@supabase/ssr';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Perspective from '../../public/PERSPECTIVE.webp';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import ImagesCarousel from '@/components/ImagesCarousel';

export const dynamic = 'force-dynamic';

export default async function Home() {
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

  async function getTables() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tables/`);

    const tables = await data.json();

    return tables.data;
  }

  const tables = await getTables();

  return (
    <main className="container mx-auto px-4">
      {/* landing page here */}
      <section className="flex min-h-screen flex-col lg:pb-36 pt-36 lg:pt-0 items-center lg:flex-row text-center lg:text-left gap-8 md:gap-2">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            A space to draft your ideas
          </h1>
          <Button>
            <Link href="#reservation">Reserve a Table</Link>
          </Button>
        </div>
        <Image
          className="flex-none min-h-4 max-h-60 h-auto w-auto"
          src={Perspective}
          alt="Persepective cad drawing of DraftSpace"
          // width={480}
          quality={100}
        />
      </section>

      <ImagesCarousel />

      <h2
        id="reservation"
        className="text-center text-2xl md:text-4xl p-8 mt-16 font-bold"
      >
        Pick a table to reserve.
      </h2>
      <div className="grid md:grid-rows-4 md:grid-cols-4 md:grid-flow-col gap-4">
        {tables.map(({ id, is_occupied }) => (
          <TableStatus key={id} tableNumber={id} isOccupied={is_occupied} />
        ))}
      </div>
      <Toaster />
    </main>
  );
}
