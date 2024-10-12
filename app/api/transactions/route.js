import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// [CREATE] transactions

export async function POST(request) {
  const transaction = await request.json();
  const createdAt = getCurrentPhilippineTime();
  // get supabase instance
  console.log('CREATED AT', createdAt);
  const supabase = createClient();

  // get the current user session ?? NOT needed because we will
  // get the required data (table_id and student_number) from the Form

  // insert the data
  const { data, error } = await supabase
    .from('Transactions')
    .insert({ ...transaction, created_at: createdAt })
    .select()
    .single();

  return NextResponse.json({ data, error });
}

// NetNinja made his GET requests in Server Components (?)
// export async function GET(request) {
//   const { data } = await supabase.from('Transactions').select();
//   return JSON.stringify(data);
// }
