import { db } from "@/lib/supabaseClient";
import Image from 'next/image';
import TicketButton from "@/app/components/TicketButton";

interface ShowPageProps {
  params: { id: string };
}

export default async function ShowDetail( { params }: ShowPageProps) {
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
      <p className="text-white-700 mb-2">{show.door_time}</p>
      <p className="text-white-700 mb-2">${show.price} Each</p>
      
      <TicketButton show={show} />
      
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
