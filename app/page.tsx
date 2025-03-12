import { db } from '@/lib/supabaseClient';
import ShowList from '@/app/components/ShowList';
import { Dancing_Script, Abel } from 'next/font/google';

const abel = Abel({ weight: '400', subsets: ['latin'] });
const dancingScript = Dancing_Script({ subsets: ['latin'] });

export default async function Home() {
  const { data: shows, error } = await db.from('shows').select('*').order('start_time', { ascending: true });

  if (error) {
    return <div>Error fetching shows: {error.message}</div>;
  }

  if (!shows) {
    return <div>Loading shows...</div>;
  }

  return (
    <div className={`flex flex-col items-center p-8 pb-20 gap-16 sm:p-20 ${abel.className}`}>
      <h1 className={`md:text-6xl text-3xl text-center font-bold mb-8 ${dancingScript.className}`}>Welcome to Red Jacks</h1>
      <div className="text-2xl text-blood mb-8">Upcoming Shows</div>
      <div className="w-full">
      <ShowList shows={shows} />
      </div>
    </div>
  );
}
