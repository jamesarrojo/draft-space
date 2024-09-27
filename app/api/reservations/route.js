import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const reservationDate = getCurrentPhilippineTime();
  const reservation = await request.json();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('Reservations')
    .insert({
      ...reservation,
      created_at: reservationDate,
      reservation_date: '2024-09-30T00:00:00.000+08:00',
    })
    .select()
    .single();
  return NextResponse.json({ data, error });
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('Reservations').select();
  return NextResponse.json({ data, error });
}
