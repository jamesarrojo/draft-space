import { createClient } from '@/utils/supabase/server';
import FeedbackForm from './FeedbackForm';

export default async function SendFeedback() {
  const supabase = createClient();
  const { data: activeSession } = await supabase.auth.getSession();
  const studentId = activeSession.session.user.id;
  return <FeedbackForm studentId={studentId} />;
}
