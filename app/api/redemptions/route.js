import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { DateTime } from 'luxon';
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
  return NextResponse.json({ data, error });
}

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('Feedback').select();
  return NextResponse.json({ data, error });
}
