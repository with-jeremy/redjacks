import { db } from '@/lib/supabaseClient';
import Link from 'next/link';
import ShowList from '@/app/components/ShowList';
import { Tables } from '@/lib/supabase';

type Shows = Tables<'shows'>;

export default async function ShowDash() {
  const { data: shows, error } = await db
    .from("shows")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) {
    return <div>Error fetching shows: {error.message}</div>;
  }

  if (!shows) {
    return <div>Loading shows...</div>;
  }

  return (
    <div className="p-5 bg-gray-800 min-h-screen flex flex-col items-center">
      <div className="w-full flex justify-around mb-5">
        <Link href="/dashboard/shows/create">
          <button className="p-5 text-lg bg-blue-500 text-white rounded-lg">
            Create New Show
          </button>
        </Link>
        <Link href="/dashboard/shows/scan">
          <button className="p-5 text-lg bg-blue-500 text-white rounded-lg">
            Scan Tickets For Show
          </button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-white mb-5">Events Dashboard</h1>
      <div className="w-full flex flex-wrap justify-center">
        <ShowList shows={shows} isAdminDashboard={true} />
      </div>
    </div>
  );
};

