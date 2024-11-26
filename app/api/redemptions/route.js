import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const createdAt = getCurrentPhilippineTime();
  const redemption = await request.json();

  const supabase = createClient();

  // FIXED THE BUG WHERE EVEN IF STUDENT HAS INSUFFICIENT POINTS,
  // A NEW ROW IS STILL ADDED ON THE REDEMPTIONS TABLE

  // Attempt to decrement points first
  const { data: decrementData, error: decrementError } = await supabase.rpc(
    'decrement',
    {
      points: redemption.total_points, // Assuming `total_points` is part of the request payload (indeed part of the payload, just checked)
      row_id: redemption.student_id, // Assuming `student_id` is part of the request payload
    }
  );
  if (decrementError) {
    // Return an error response without inserting the redemption
    return NextResponse.json(
      { error: decrementError.message },
      { status: 400 }
    );
  }
  // Insert redemption if the decrement RPC succeeds
  const { data, error: insertError } = await supabase
    .from('Redemptions')
    .insert({
      ...redemption,
      created_at: createdAt,
    })
    .select()
    .single();

  if (insertError) {
    // Handle insertion error
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('Redemptions')
    .select(`*, Redeemable_Items (name), Students (email)`); // this is how you JOIN(?) in supabase
  if (!error) {
    const redemptionsData = data.map(
      ({ Redeemable_Items, Students, ...rest }) => ({
        item_name: Redeemable_Items?.name,
        student_email: Students?.email,
        ...rest,
      })
    );
    return NextResponse.json({ redemptionsData, error });
  }
}
