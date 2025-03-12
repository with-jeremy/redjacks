import { NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';



export async function POST(req: Request) {
  console.log("create-ticket API hit");

  try {
    const { showId, paymentIntentId, userId, quantity } = await req.json();

    console.log("Received data:", { showId, paymentIntentId, userId, quantity });

    // Create ticket records in the database
    const tickets = Array.from({ length: quantity }, () => ({
      show_id: showId,
      stripe_confirmation: paymentIntentId,
      user_id: userId,
    }));

    const { error } = await db.from('tickets').insert(tickets).select();

    if (error) {
      console.error("Failed to create ticket records:", error);
      return NextResponse.json({ message: "Failed to create ticket records." }, { status: 500 });
    }

    return NextResponse.json({ message: "Tickets created successfully." }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error creating tickets:", error);
    return NextResponse.json({ message: (error as Error).message || "An unexpected error occurred." }, { status: 500 });
  }
}
