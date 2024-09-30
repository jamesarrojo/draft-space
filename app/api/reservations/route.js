import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const createdAt = getCurrentPhilippineTime();
  const reservation = await request.json();
  const supabase = await createClient();

  // get current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('Reservations')
    .insert({
      ...reservation,
      created_at: createdAt,
      student_id: user.id,
    })
    .select()
    .single();
  return NextResponse.json({ data, error });
}

// export async function GET() {
//   const supabase = await createClient();
//   const { data, error } = await supabase.from('Reservations').select();
//   return NextResponse.json({ data, error });
// }
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const tableId = searchParams.get('tableId');
  const supabase = await createClient();
  if (date && tableId) {
    const { data, error } = await supabase
      .from('Reservations')
      .select()
      .eq('table_id', tableId)
      .like('reservation_date', `%${date}%`);
    return NextResponse.json({ data, error });
  }
  const { data, error } = await supabase.from('Reservations').select();
  return NextResponse.json({ data, error });
}
