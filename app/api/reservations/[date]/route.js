import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(_, { params }) {
  const date = params.date.slice(0, 10);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('Reservations')
    .select()
    .like('reservation_date', `%${date}%`);
  console.log({ date, data_from_server: data, error });
  return NextResponse.json({ data, error });
}
