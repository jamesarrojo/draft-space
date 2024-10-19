import { getCurrentPhilippineTime } from '@/utils/dateTimePhilippines';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';

// [CREATE] transactions

export async function POST(request) {
  console.log('START', Date.now());
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const dateTimeNowStr = getCurrentPhilippineTime();
  const supabase = createClient();
  if (action === 'cron') {
    // checks if there is a Reservation(s) that has to start
    const { data, error } = await supabase
      .from('Reservations')
      .select()
      .is('is_converted', false)
      .is('is_paid', true)
      .lte('start_time', dateTimeNowStr); // returns rows that are `dateTimeNowStr` <= `start_time`
    // if there is, create a Transaction(s) based on that Reservation(s)
    if (data.length > 0) {
      const transactions = data.map((t) => ({
        created_at: getCurrentPhilippineTime(),
        login_time: t.start_time,
        logout_time: t.end_time,
        table_number: t.table_id,
        student_number: t.student_id,
        reservation_id: t.id,
        amount: t.amount,
      }));
      const { error } = await supabase
        .from('Transactions')
        .insert(transactions);
      console.log('ERROR FROM INSERTING TRANSACTION', error);

      if (!error) {
        // updates is_converted to true
        const reservations = data.map((r) => ({
          ...r,
          is_converted: true,
        }));
        const { error: reservationsError } = await supabase
          .from('Reservations')
          .upsert(reservations);
        // UPDATES TABLE STATUS TO BE UNAVAILABLE!!! could use a function trigger?!?
        const { error: tablesError } = await supabase
          .from('Tables')
          .upsert(data.map((t) => ({ id: t.table_id, is_occupied: true })));
        if (reservationsError || tablesError) {
          return NextResponse.json({ reservationsError, tablesError });
        }
      }
    }
    console.log('END', Date.now());
    return NextResponse.json({ data, error });
  }
  const transaction = await request.json();

  // insert the data from the browser
  const { data, error } = await supabase
    .from('Transactions')
    .insert({
      created_at: dateTimeNowStr,
      login_time: dateTimeNowStr,
      logout_time: DateTime.fromISO(dateTimeNowStr)
        .plus({
          hours: transaction.hours,
        })
        .setZone('Asia/Manila'),
      table_number: transaction.table_number,
      student_number: transaction.student_number,
      amount: transaction.amount,
    })
    .select()
    .single();
  // update table status to be unavailable
  if (!error) {
    const { error } = await supabase
      .from('Tables')
      .update({ is_occupied: true })
      .eq('id', data.table_number);
    if (error) {
      return NextResponse.json({ error });
    }
  }
  console.log('END2', Date.now());
  return NextResponse.json({ data, error });
}

// [READ] transactions

export async function GET() {
  // use RLS to only allow an admin to get ALL the transactions
  // and only allow students to get transactions they made
  const supabase = createClient();

  const { data: transactions, error } = await supabase
    .from('Transactions')
    .select();
  if (error) {
    return NextResponse.json(error);
  }
  return NextResponse.json({ transactions });
}
