import ShowList from '@/app/components/ShowList';
import { Dancing_Script, Abel } from 'next/font/google';
import { db } from '@/lib/supabaseClient';
import { Tables } from '@/lib/supabase';

type ShowRow = Tables<'shows'>;
const abel = Abel({ weight: '400', subsets: ['latin'] });
const dancingScript = Dancing_Script({ subsets: ['latin'] });

export default async function ShowsPage() {
  const { data, error } = await db
    .from('shows')
    .select('*')
    .order('start_time', { ascending: true });

  const shows: ShowRow[] = (data as ShowRow[]) || [];

  if (error) {
    return <div>Error fetching shows: {error.message}</div>;
  }

  if (!shows) {
    return <div>Loading shows...</div>;
  }

  return (
    <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 ${abel.className}`}>
      <h1 className={`text-6xl font-bold mb-8 text-blood ${dancingScript.className}`}>Welcome to Red Jacks</h1>
      <p className="text-2xl mb-8">Discover and book tickets for amazing events!</p>
      <br />
      <ShowList shows={shows} />
    </div>
  );
}

