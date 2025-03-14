import { db } from '@/lib/supabaseClient';
import EditShowForm from '@/app/components/EditShowForm';
import { checkRole } from '@/utils/roles';

export default async function EditShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: show, error } = await db.from('shows').select('*').eq('id', id).single();

  if (error) {
    return <div>Error fetching show: {error.message}</div>;
  }

  if (!show) {
    return <div>Loading show...</div>;
  }

  if (!await checkRole('admin')) {
    return <div>Unauthorized</div>;
  }

  return (
    <div>
      <h1>Edit Show</h1>
      <EditShowForm show={show} />
    </div>
  );
}
