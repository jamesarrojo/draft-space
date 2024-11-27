import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Logo from '../../components/default-monochrome-black.svg';
import Image from 'next/image';

export default async function PleaseVerify() {
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

  // redirect to this route if account is a student and is verified
  if (
    (user?.role === 'student' || user?.role === 'admin') &&
    user?.is_verified
  ) {
    redirect('/');
  }
  return (
    <div className="text-center flex flex-col justify-center items-center mt-36 gap-4">
      <Image
        className="flex-none h-12 w-auto mb-8"
        src={Logo}
        alt="DraftSpace logo"
        width={150}
        quality={100}
      />
      <h1 className="text-3xl font-bold">Please Verify Your Account</h1>
      <p>
        Bring your Bicol University ID to verify your DraftSpace account.
        DraftSpace is open from 8AM to 6PM every day. See you there!
      </p>
    </div>
  );
}
