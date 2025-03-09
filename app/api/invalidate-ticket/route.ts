import { db } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ticketId } = await request.json();

    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tickets")
      .update({ isValid: false })
      .eq("id", ticketId)
      .select();

    if (error) {
      console.error("Error invalidating ticket:", error);
      return NextResponse.json(
        { error: "Failed to invalidate ticket" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Ticket invalidated", ticket: data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error invalidating ticket:", error);
    return NextResponse.json(
      { error: "Failed to invalidate ticket" },
      { status: 500 }
    );
  }
}
