import { Dancing_Script } from "next/font/google"
import { db } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

const dancingScript = Dancing_Script({ subsets: ["latin"] })

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
   
   <h1 className={`text-6xl font-bold mb-8 text-blood ${dancingScript.className}`}>Welcome to Red Jacks</h1>
      <p className="text-2xl mb-8 text-silver">Discover and book tickets for amazing shows!</p>
      <br />
      {shows.map((show) => (
          <Link href={`/shows/${show.id}`} key={show.id} className="block">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow text-center">
              <h2 className="text-xl font-semibold mb-2">{show.name}</h2>
              <p className="text-gray-700 mb-2">{show.description}</p>
              {show.show_flyer && (
               <Image
               src={show.show_flyer || "/placeholder.svg"}
               alt="Show Flyer"
               className="mt-2 max-w-full h-auto mx-auto"
               style={{ maxHeight: "400px" }}
               width={400}
               height={400}
             />
              )}
            </div>
          </Link>
        ))}
         </div>
  );
}
