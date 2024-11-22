import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import FeedbackCard from './FeedbackCard';
export const dynamic = 'force-dynamic';
export default async function Feedback() {
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

  async function getFeedback() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('Feedback')
      .select('*, Students (email)');
    if (error) {
      return error;
    }

    const feedbackData = data.map(({ Students, ...rest }) => ({
      email: Students?.email,
      ...rest,
    }));
    return feedbackData;
  }

  const feedback = await getFeedback();
  console.log(feedback);
  if (feedback.length === 0) return <p>No Feedback Yet</p>;
  return (
    <div>
      {feedback.map(({ id, email, created_at, feedback, is_approved }) => (
        <FeedbackCard
          key={id}
          id={id}
          email={email}
          createdAt={created_at}
          feedback={feedback}
          isApproved={is_approved}
        />
      ))}
    </div>
  );
}
