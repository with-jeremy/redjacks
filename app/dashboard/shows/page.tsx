
import { db } from '@/lib/supabaseClient';
import Link from 'next/link';
import ShowList from '@/app/components/ShowList';
import { Shows } from '@/types/globals';
export default async function ShowDash() {
  const { data: shows, error } = await db
    .from<Shows, Shows>("shows")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) {
    return <div>Error fetching shows: {error.message}</div>;
  }

  if (!shows) {
    return <div>Loading shows...</div>;
  }

  return (
    <div>
      <div className="grid gap-5 p-5 bg-gray-800">
        <Link href="/dashboard/shows/create">
          <button className="p-5 m-2 text-lg bg-gray-200 text-gray-800 w-40 h-40">
            Create New Show
          </button>
        </Link>
      </div>
      <div className="grid gap-5 p-5 bg-gray-800">
        <Link href="/dashboard/shows/scan">
          <button className="p-5 m-2 text-lg bg-gray-200 text-gray-800 w-40 h-40">
            Scan Tickets For Show
          </button>
        </Link>
      </div>
      <h1>Events Dashboard</h1>
     
       
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ShowList shows={shows} />
        </div>
    </div>
  );
};

