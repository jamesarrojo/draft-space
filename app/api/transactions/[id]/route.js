import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(_, { params }) {
  const id = params.id;

  const supabase = createClient();

  const { error } = await supabase.from('Transactions').delete().eq('id', id);

  return NextResponse.json({ error });
}

// I think I don't need this anymore since a transaction CAN'T be created if not paid yet.
// I need a PUT request for transactions to log out
// might not need the 'Payment' column in the views
export async function PUT(_, { params }) {
  const id = params.id;

  const supabase = createClient();

  const { data, error } = await supabase
    .from('Transactions')
    .update({ is_paid: true })
    .eq('id', id);

  return NextResponse.json({ data, error });
}
