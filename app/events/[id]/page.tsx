import TicketPurchase from "./TicketPurchase";
import { db } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";


export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const { data: event, error } = await db.from("events").select("*").eq("id", params.id).single();
  if (error || !event) {
    notFound();
  }
  return <TicketPurchase event={event} />;
};

