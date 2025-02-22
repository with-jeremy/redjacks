import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';
import { useUser } from "@clerk/nextjs";

export const createTicketRecord = async ({
  eventId,
  amount,
  quantity,
  stripePaymentId,
}: {
  eventId: string;
  amount: number;
  quantity: number;
  stripePaymentId: string;
}) => {
  
  const { user } = useUser();
  const userId = user?.id;

  if (typeof userId !== 'string') {
    console.error("User not authenticated or userId is not a string.");
    return null;
  }

  const ticketId = uuidv4(); // Generate a unique ticketId
  const purchaseTime = new Date();
  const qrCodeData = uuidv4(); // Generate a unique QR code

  try {
    const { data, error } = await supabase
      .from('rje_tickets')
      .insert([
        {
          id: ticketId, // Use the generated ticketId
          created_at: purchaseTime.toISOString(),
          event_id: eventId,
          price: amount,
          quantity: quantity,
          qr_code_data: qrCodeData,
          is_valid: true, // Set initial value to true
          purchased_by: userId,
          stripe_payment_id: stripePaymentId,
        },
      ]);

    if (error) {
      console.error("Error creating ticket record:", error);
      return null;
    }

    console.log("Ticket record created successfully:", data);
    return data; // Or return the created ticket object if needed

  } catch (error) {
    console.error("Error creating ticket record:", error);
    return null;
  }
};
