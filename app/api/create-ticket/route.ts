import { NextResponse } from 'next/server';
import { db } from '@/lib/supabaseClient';



export async function POST(req: Request) {
  console.log("create-ticket API hit");

  try {
    const { showId, paymentIntentId, userId } = await req.json();

    console.log("Received data:", { showId, paymentIntentId, userId });

    // Create ticket record in the database
    const { error } =  await db.from('tickets')
      .insert([
        { show_id: showId, stripe_confirmation: paymentIntentId, user_id: userId },
      ]).select();

    if (error) {
      console.error("Failed to create ticket record:", error);
      return NextResponse.json({ message: "Failed to create ticket record." }, { status: 500 });
    }

    return NextResponse.json({ message: "Ticket created successfully." }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error creating ticket:", error);
    return NextResponse.json({ message: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
