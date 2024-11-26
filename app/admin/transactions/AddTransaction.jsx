'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import useSWR, { useSWRConfig } from 'swr';
import { DateTime } from 'luxon';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const fetcher = (url) => fetch(url).then((res) => res.json());

function hoursToSixPM() {
  // Get the current time
  const now = DateTime.local();

  // Set target time to today at 6:00 PM
  const sixPM = now.set({ hour: 18, minute: 0, second: 0, millisecond: 0 });

  // Check if current time is after 6 PM, if so, set target time to tomorrow's 6 PM
  const targetTime = now > sixPM ? sixPM.plus({ days: 1 }) : sixPM;

  // Calculate the difference in hours
  const diffInHours = targetTime.diff(now, 'hours').hours;

  return Math.floor(diffInHours);
}

export default function AddTransaction() {
  const {
    data: tables,
    error: tablesErr,
    isLoading: isTablesLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/tables`, fetcher);
  const {
    data: students,
    error: studentsErr,
    isLoading: isStudentsLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/students?role=verified-student`,
    fetcher
  );

  const [tableNumber, setTableNumber] = useState(undefined); //set this to `undefined` instead of `null` so that placeholder text will show in the `SelectValue`. source: https://github.com/shadcn-ui/ui/issues/1529#issuecomment-1721015873
  const [student, setStudent] = useState(undefined);
  const [tablesArr, setTablesArr] = useState([]);
  const [studentsArr, setStudentsArr] = useState([]);
  const [hours, setHours] = useState(undefined);
  const [amount, setAmount] = useState(undefined);

  const { toast } = useToast();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  async function handleSubmit(e) {
    e.preventDefault();

    setTableNumber(undefined);
    setStudent(undefined);
    setHours(undefined);
    setAmount(undefined);

    const newTransaction = {
      table_number: tableNumber,
      student_number: student,
      hours,
      amount,
    };

    console.log('NEW TRANSACTION', newTransaction);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      }
    );

    const { data } = await res.json();

    // I moved the trigger for the toast here
    toast({
      title: `Transaction has been created.`,
      description: `Table ${tableNumber} is now occupied by ${
        data.student_email
      } for ${hours} hour${
        hours === 1 ? '' : 's'
      } and has been paid ₱${amount}.00`,
    });
    if (res.status === 200) {
      // refreshes list of available tables and students
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/tables`);
      mutate(
        `${process.env.NEXT_PUBLIC_API_URL}/api/students?role=verified-student`
      );

      router.refresh();
    }
  }

  useEffect(() => {
    if (tables) setTablesArr(tables.data); // Set the initial state once data is available
    if (students) setStudentsArr(students.data); // Set the initial state once data is available
  }, [tables, students]);

  const hoursTillSix = hoursToSixPM();
  console.log(process.env.NODE_ENV, process.env.NODE_ENV === 'development');
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="mb-4">New Transaction</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <form onSubmit={handleSubmit}>
          <SheetHeader className="gap-2 mb-8">
            <SheetTitle>
              Add new transaction{' '}
              {amount ? `— Total amount is ₱${amount}.00` : null}
            </SheetTitle>
            <SheetDescription>
              This will add a new entry below with a Login Time of the current
              PH time.
            </SheetDescription>

            <Select
              onValueChange={(value) => {
                setTableNumber(+value);
              }}
              value={tableNumber}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select available table" />
              </SelectTrigger>
              <SelectContent>
                {tablesArr.map(({ id, is_occupied }) => {
                  return (
                    <SelectItem key={id} value={id} disabled={is_occupied}>
                      {id}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                setStudent(value);
              }}
              value={student}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {studentsArr.map(({ supabase_id, has_table, email }) => {
                  return (
                    <SelectItem
                      key={supabase_id}
                      value={supabase_id}
                      disabled={has_table}
                    >
                      {email}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                setHours(+value);
                setAmount(+value > 8 ? 350 : +rates[+value - 1]);
              }}
              value={hours}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of hours" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(
                  (hour, index) => {
                    return (
                      <SelectItem
                        key={hour}
                        value={hour}
                        disabled={
                          process.env.NODE_ENV === 'development'
                            ? false
                            : hoursTillSix < hour || hoursTillSix >= 10
                        } // makes sure you only select 1-10 hours so it won't exceed 6PM.
                      >
                        {hour}
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </SheetHeader>
          <SheetFooter className="sm:justify-start">
            <SheetClose asChild>
              <Button
                disabled={!tableNumber || !student || !hours || !amount}
                type="submit"
              >
                Submit
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

const rates = [45, 85, 130, 175, 215, 260, 305, 350];
