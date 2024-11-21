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
import UpdateField from './UpdateField';

export const columns = [
  {
    accessorKey: 'item_name',
    header: 'Item',
  },
  {
    accessorKey: 'student_email',
    header: 'Redeemed By',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'redemption_date',
    header: 'Date Redeemed',
    cell: (row) => (
      <div>
        {row.getValue('redemption_date')
          ? DateTime.fromISO(row.getValue('redemption_date')).toFormat(
              'MMMM dd, yyyy'
            )
          : '-'}
      </div>
    ),
  },
  {
    accessorKey: 'id',
    header: 'Redemption ID',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
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
            {row.getValue('redemption_date') === null ? (
              <UpdateField userId={row.getValue('id')}>
                Mark as redeemed
              </UpdateField>
            ) : (
              <p>No actions available.</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
