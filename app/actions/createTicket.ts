'use server';

import { createTicketRecord } from '../../lib/createTicketRecord';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs';

export const createTicket = async ({
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
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    await createTicketRecord({
      eventId,
      amount,
      quantity,
      stripePaymentId,
    });
    revalidatePath('/payment-success'); // Or wherever you want to revalidate
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create ticket:", error);
    return { success: false, error: error.message || "Failed to create ticket" };
  }
};
