import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('Tables').select().order('id');
  return NextResponse.json({ data, error });
}
