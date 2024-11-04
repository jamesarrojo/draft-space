import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const createdAt = getCurrentPhilippineTime();
  const redemption = await request.json();

  const supabase = createClient();
  const { data, error } = await supabase
    .from('Redemptions')
    .insert({
      ...redemption,
      created_at: createdAt,
    })
    .select()
    .single();
  if (!error) {
    // this lacks a way to not allow user to make a redemption request when his/her points are insufficient
    // only way is on the frontend side
    const { error } = await supabase.rpc('decrement', {
      hours: data.total_points,
      row_id: data.student_id,
    });
    return NextResponse.json({ error });
  }
  return NextResponse.json({ data, error });
}

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('Redemptions').select();
  return NextResponse.json({ data, error });
}
