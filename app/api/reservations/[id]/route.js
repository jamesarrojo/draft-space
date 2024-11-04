import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { DateTime } from 'luxon';
import { NextResponse } from 'next/server';

export async function PUT(_, { params }) {
  const id = params.id;

  const supabase = createClient();

  const { data, error } = await supabase
    .from('Reservations')
    .update({ is_paid: true })
    .eq('id', id)
    .select()
    .single();
  if (!error) {
    const startTime = DateTime.fromISO(data.start_time);
    const endTime = DateTime.fromISO(data.end_time);
    // Get the difference between the two times
    const diff = endTime.diff(startTime, 'hours').hours;

    // created a stored procedure using this guide https://github.com/orgs/supabase/discussions/909
    const { error } = await supabase.rpc('increment', {
      hours: diff,
      row_id: data.student_id,
    });
    return NextResponse.json({ error });
  }
  return NextResponse.json({ error });
}
export async function DELETE(_, { params }) {
  const id = params.id;

  const supabase = await createClient();

  const { error } = await supabase.from('Reservations').delete().eq('id', id);
  return NextResponse.json({ error });
}
