import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(_, { params }) {
  const id = params.id;

  const supabase = createClient();

  const { error } = await supabase.from('Redemptions').delete().eq('id', id);
  return NextResponse.json({ error });
}

export async function PUT(_, { params }) {
  const id = params.id;
  const createAt = getCurrentPhilippineTime();

  const supabase = createClient();

  const { error } = await supabase
    .from('Redemptions')
    .update({ redemption_date: createAt, status: 'claimed' })
    .eq('id', id);
  return NextResponse.json({ error });
}
