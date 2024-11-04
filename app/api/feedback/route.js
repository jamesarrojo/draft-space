import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { DateTime } from 'luxon';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const createdAt = getCurrentPhilippineTime();
  const feedback = await request.json();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('Feedback')
    .insert({
      ...feedback,
      created_at: createdAt,
    })
    .select()
    .single();
  return NextResponse.json({ data, error });
}
// export async function GET() {
//   const supabase = await createClient();
//   const { data, error } = await supabase.from('Redeemable_Items').select();
//   return NextResponse.json({ data, error });
// }
