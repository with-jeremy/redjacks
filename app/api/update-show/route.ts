import { NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';
import { checkRole } from '@/utils/roles';

export async function POST(req: Request) {
  const { id, name, description, doorTime, startTime, capacity, price, showFlyer } = await req.json();

  if (!await checkRole('admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { error } = await db
    .from('shows')
    .update({ name, description, door_time: doorTime, start_time: startTime, capacity, price, show_flyer: showFlyer })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Show updated successfully' });
}