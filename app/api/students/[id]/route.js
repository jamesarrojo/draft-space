import { createClient } from '@/utils/supabase/server';
import { createClient as createClientAdmin } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function DELETE(_, { params }) {
  const id = params.id;
  const supabase = createClientAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ADMIN_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Access auth admin api
  const { error } = await supabase.auth.admin.deleteUser(id);
  console.log('DELETE', error);
  return NextResponse.json({ error });
}
export async function PUT(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  const id = params.id;
  const supabase = createClient();
  if (action === 'Set admin') {
    const { error } = await supabase
      .from('Students')
      .update({ role: 'admin' })
      .eq('supabase_id', id);

    return NextResponse.json({ error });
  }

  const { error } = await supabase
    .from('Students')
    .update({ is_verified: true })
    .eq('supabase_id', id);

  return NextResponse.json({ error });
}
