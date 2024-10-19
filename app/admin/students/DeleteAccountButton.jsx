import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MdDeleteForever } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default function DeleteAccountButton({ userId }) {
  const router = useRouter();
  async function deleteUser(id) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/students/${id}`,
      {
        method: 'DELETE',
      }
    );
    const json = await res.json();
    // console.log({ json });
    if (json.error) {
      console.log(json.error);
      // setIsLoading(false);
    }
    if (!json.error) {
      router.refresh();
      // router.push('/admin/students');
      // revalidatePath('/admin/students');
    }
  }
  return (
    <DropdownMenuItem onClick={() => deleteUser(userId)}>
      <MdDeleteForever className="mr-1" /> Delete
    </DropdownMenuItem>
  );
}
