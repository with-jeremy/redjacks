import EventList from "@/app/components/EventList";
import { Dancing_Script } from "next/font/google"
import { supabase } from "@/lib/supabaseClient";

const dancingScript = Dancing_Script({ subsets: ["latin"] })

export default async function Home() {
  const { data: events, error } = await supabase.from("rje_events").select("*").order("start_time", { ascending: true })

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
   
   <h1 className={`text-6xl font-bold mb-8 text-blood ${dancingScript.className}`}>Welcome to Red Jacks</h1>
      <p className="text-2xl mb-8 text-silver">Discover and book tickets for amazing events!</p>
      <br />
      <EventList events={events} />
         </div>
  );
}

 