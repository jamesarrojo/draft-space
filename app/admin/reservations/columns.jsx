'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DateTime } from 'luxon';
// import DeleteAccountButton from './DeleteAccountButton';
import UpdateField from './UpdateField';

// function verifyStudent() {}
// async function setAdmin(id) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}`,
//     {
//       method: 'PUT',
//     }
//   );
//   const json = await res.json();
//   // console.log({ json });
//   if (json.error) {
//     console.log(json.error);
//     // setIsLoading(false);
//   }
//   if (!json.error) {
//     console.log('NO ERROR!');
//     // router.refresh();
//     // router.push('/admin/students');
//     // revalidatePath('/admin/students');
//   }
// }

export const columns = [
  {
    accessorKey: 'reservation_date',
    header: 'Reservation Date',
    cell: (row) => (
      <div>
        {DateTime.fromISO(row.getValue('reservation_date')).toFormat(
          'MMMM dd, yyyy'
        )}
      </div>
    ),
  },
  {
    accessorKey: 'start_time',
    header: 'Start Time',
    cell: (row) => (
      <div>
        {DateTime.fromISO(row.getValue('start_time')).toFormat('hh:mm:ss a')}
      </div>
    ),
  },
  {
    accessorKey: 'end_time',
    header: 'End Time',
    cell: (row) => (
      <div>
        {DateTime.fromISO(row.getValue('end_time')).toFormat('hh:mm:ss a')}
      </div>
    ),
  },
  {
    accessorKey: 'table_id',
    header: 'Table Number',
  },
  {
    accessorKey: 'student_email',
    header: 'Student',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'is_paid',
    header: 'Paid?',
    cell: (row) => (
      <div>{row.getValue('is_paid') ? '✅ Yes' : '❌ Not Yet'}</div>
    ),
  },
  {
    accessorKey: 'id',
    header: 'Reservation ID',
  },
  // {
  //   accessorKey: 'status',
  //   header: 'Status',
  // },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {row.getValue('is_paid') === false ? (
              <UpdateField userId={row.getValue('id')}>Set to paid</UpdateField>
            ) : (
              <p>No actions available.</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
