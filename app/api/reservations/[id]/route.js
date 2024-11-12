import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { DateTime } from 'luxon';
import { NextResponse } from 'next/server';

export async function PUT(_, { params }) {
  const id = params.id;

  const supabase = createClient();

  // marks a Reservation as paid, won't be deleted, and ready to be converted as a Transaction
  const { data, error } = await supabase
    .from('Reservations')
    .update({ is_paid: true })
    .eq('id', id)
    .select()
    .single();

  return NextResponse.json({ error });
}
export async function DELETE(_, { params }) {
  const id = params.id;

  const supabase = await createClient();

  const { error } = await supabase.from('Reservations').delete().eq('id', id);
  return NextResponse.json({ error });
}
