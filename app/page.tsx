import { db } from "@/lib/supabaseClient";
import ShowList from "@/app/components/ShowList";

export default async function Home() {
  const { data: shows, error } = await db.from("shows").select("*").order("start_time", { ascending: true })

  if (error) {
    return <div>Error fetching shows: {error.message}</div>;
  }

  if (!shows) {
    return <div>Loading shows...</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-6xl font-bold mb-8 dancing">Welcome to Red Jacks</h1>
      <p className="text-2xl mb-8 text-blood">Discover and book tickets for amazing shows!</p>
      <br />
      <ShowList shows={shows} />
    </div>
  );
}
