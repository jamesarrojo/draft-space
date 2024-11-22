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
// import UpdateField from './UpdateField';
function verifyStudent() {}
async function setAdmin(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}`,
    {
      method: 'PUT',
    }
  );
  const json = await res.json();
  // console.log({ json });
  if (json.error) {
    console.log(json.error);
    // setIsLoading(false);
  }
  if (!json.error) {
    console.log('NO ERROR!');
    // router.refresh();
    // router.push('/admin/students');
    // revalidatePath('/admin/students');
  }
}

export const columns = [
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: (row) => (
      <div>
        {DateTime.fromISO(row.getValue('created_at')).toFormat('MMMM dd, yyyy')}
      </div>
    ),
  },
  {
    accessorKey: 'table_number',
    header: 'Table Number',
  },
  {
    accessorKey: 'login_time',
    header: 'Login Time',
    cell: (row) => (
      <div>
        {DateTime.fromISO(row.getValue('login_time')).toFormat('hh:mm:ss a')}
      </div>
    ),
  },
  {
    accessorKey: 'logout_time',
    header: 'Logout Time',
    cell: (row) => (
      <div>
        {DateTime.fromISO(row.getValue('logout_time')).toFormat('hh:mm:ss a')}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'reservation_id',
    header: 'Reservation ID',
    cell: (row) => (
      <div>
        {row.getValue('reservation_id')
          ? row.getValue('reservation_id')
          : '(walk-in)'}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];
