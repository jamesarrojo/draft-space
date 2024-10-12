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
import DeleteAccountButton from './DeleteAccountButton';
import UpdateField from './UpdateField';
function verifyStudent() {}
async function setAdmin(id) {
  const res = await fetch(`${process.env.API_URL}:3000/api/students/${id}`, {
    method: 'PUT',
  });
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
    accessorKey: 'supabase_id',
    header: null,
    cell: null,
  },
  {
    accessorKey: 'student_number',
    header: 'Student Number',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
  },
  {
    accessorKey: 'role',
    header: null,
    cell: null,
  },
  {
    accessorKey: 'is_verified',
    header: 'Verified?',
    cell: (row) => <div>{row.getValue('is_verified') ? 'Yes' : 'Not Yet'}</div>,
  },
  {
    accessorKey: 'points_balance',
    header: 'Points',
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
            {row.getValue('role') !== 'admin' && (
              <UpdateField userId={row.getValue('supabase_id')}>
                Set admin
              </UpdateField>
            )}
            {!row.getValue('is_verified') && (
              <UpdateField userId={row.getValue('supabase_id')}>
                Verify student
              </UpdateField>
            )}

            <DeleteAccountButton userId={row.getValue('supabase_id')} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
