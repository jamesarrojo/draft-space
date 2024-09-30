// PROBABLY NOT NEEDED ANYMORE

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  console.log('THIS IS THE PARAMS', params);
  const date = params.date.slice(0, 10);
  const tableId = params.tableId;
  const supabase = await createClient();
  console.log({ params });
  const { data, error } = await supabase
    .from('Reservations')
    .select()
    .eq('table_id', tableId);
  // .like('reservation_date', `%${date}%`);
  return NextResponse.json({ data, error });
}
