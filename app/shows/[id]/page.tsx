import { db } from "@/lib/supabaseClient";
import Image from 'next/image';
import TicketWrapper from "@/app/components/TicketWrapper";

export default async function ShowDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: show, error } = await db.from("shows").select("*").eq("id", id).single();
  
  if (error) {
    return <div>Error fetching shows: {error.message}</div>;
  }

  if (!show) {
    return <div>Loading shows...</div>;
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow text-center">
      <h2 className="text-xl font-semibold mb-2">{show.name}</h2>
      <p className="text-white-700 mb-2">{show.description}</p>
      <p>
              <strong>{new Date(show.start_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })} @ {new Date(show.door_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}</strong>
              </p>
      
      <TicketWrapper show={show} />
      
      {show.show_flyer && (
        <div className="flex justify-center">
          <Image
            src={show.show_flyer || "/placeholder.svg"}
            alt="Show Flyer"
            width={400}
            height={400}
            className="mt-2 h-auto max-w-full"
          />
        </div>
      )}
    </div>
  );
}
