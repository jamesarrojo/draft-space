import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { DateTime } from 'luxon';
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
      student_email: user.email,
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
  console.log(date, tableId);
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

// deletes Reservations that are 10 mins or older and is not yet paid.
export async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  if (action === 'cron') {
    const supabase = createClient();
    const timeNow = getCurrentPhilippineTime();
    const timeTenMinsAgo = DateTime.fromISO(timeNow).minus({ minutes: 10 });
    const { data, error } = await supabase
      .from('Reservations')
      .select()
      .eq('is_paid', false) // only include rows that are yet paid
      .lte('created_at', timeTenMinsAgo); // checks if row is 10 or more mins old
    // creates an array of IDs of rows to delete
    const toDelete = data.map(({ id }) => id);
    if (data.length > 0) {
      const { error } = await supabase
        .from('Reservations')
        .delete()
        .in('id', toDelete);
      return NextResponse.json({ timeTenMinsAgo, data, error });
    }
    return NextResponse.json({
      timeTenMinsAgo,
      message: 'No reservations available to delete.',
      error,
    });
  }
}
