import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MdDeleteForever } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default function UpdateField({ userId, children }) {
  console.log(userId, children);
  const router = useRouter();
  async function updateField(id) {
    const res = await fetch(
      `${process.env.API_URL}:3000/api/students/${id}?action=${children}`,
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
      router.refresh();
      // router.push('/admin/students');
      // revalidatePath('/admin/students');
    }
  }
  return (
    <DropdownMenuItem onClick={() => updateField(userId)}>
      {children}
    </DropdownMenuItem>
  );
}
