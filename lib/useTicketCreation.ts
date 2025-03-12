import { useState } from "react";

export const useTicketCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTickets = async (showId: string, userId: string, paymentIntentId: string, quantity: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId,
          userId,
          paymentIntentId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tickets. Please try again.");
      }

      setLoading(false);
      return true;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      return false;
    }
  };

  return { createTickets, loading, error };
};