import { createClient } from '@/utils/supabase/server';
import FeedbackForm from './FeedbackForm';
import { redirect } from 'next/navigation';

export default async function SendFeedback() {
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
  return <FeedbackForm studentId={studentId} />;
}