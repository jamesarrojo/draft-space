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
    header: 'Date Requested',
    cell: (row) => (
      <div>
        {DateTime.fromISO(row.getValue('created_at')).toFormat('MMMM dd, yyyy')}
      </div>
    ),
  },
  {
    accessorKey: 'redemption_date',
    header: 'Date Claimed',
    cell: (row) =>
      row.getValue('redemption_date') ? (
        <div>
          {DateTime.fromISO(row.getValue('redemption_date')).toFormat(
            'MMMM dd, yyyy'
          )}
        </div>
      ) : (
        <div>-</div>
      ),
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'item_name',
    header: 'Item',
  },
  {
    accessorKey: 'total_points',
    header: 'Total Points Cost',
  },

  {
    accessorKey: 'status',
    header: 'Status',
  },
];
