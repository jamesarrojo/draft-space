import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { DateTime } from 'luxon';
import { NextResponse } from 'next/server';

export async function DELETE(_, { params }) {
  const id = params.id;

  const supabase = await createClient();

  const { error } = await supabase
    .from('Redeemable_Items')
    .delete()
    .eq('id', id);
  return NextResponse.json({ error });
}
