import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { columns } from './columns';
import { DataTable } from './data-table';

async function getStudents() {
  const data = await fetch(
    `${process.env.API_URL}:3000/api/students?role=student`
  ); // there should be no trailing `/`

  return data.json();
}

export default async function Students() {
  const supabase = await createClient();

  const { data: activeSession } = await supabase.auth.getSession();
  if (!activeSession.session) {
    redirect('/login');
  }
  const userId = activeSession.session.user.id;
  const { data: user } = await supabase
    .from('Students')
    .select('*')
    .eq('supabase_id', userId)
    .single();

  // only admin can access this route
  if (user?.role !== 'admin') {
    redirect('/');
  }
  const { data } = await getStudents();
  return (
    <div className="container mx-auto py-10">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
