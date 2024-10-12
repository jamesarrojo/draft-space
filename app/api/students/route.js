import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role');

  const supabase = await createClient();
  if (role === 'student') {
    const { data, error } = await supabase
      .from('Students')
      .select()
      .eq('role', role);

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    return NextResponse.json({ data, error });
  }
  const { data, error } = await supabase.from('Students').select();
  return NextResponse.json({ data, error });
}
