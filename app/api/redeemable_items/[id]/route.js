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

export async function PUT(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const supabase = createClient();

  const id = params.id;
  if (action === 'availability') {
    const {
      data: { is_available },
      error,
    } = await supabase
      .from('Redeemable_Items')
      .select('is_available')
      .eq('id', id)
      .single();
    if (!error) {
      const { error } = await supabase
        .from('Redeemable_Items')
        .update({ is_available: !is_available })
        .eq('id', id);
      return NextResponse.json({ error });
    }
    return NextResponse.json({ is_available, error });
  }
  const item = await request.json();

  const { error } = await supabase
    .from('Redeemable_Items')
    .update({ ...item })
    .eq('id', id);
  return NextResponse.json({ error });
}
