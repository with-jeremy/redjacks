'use client';

import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import { Tables } from '@/lib/supabase';
type Show = Tables<'shows'>;


const CheckoutForm = ({ show }: { show: Show }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  React.useEffect(() => {
    console.log("CheckoutForm loaded with showId:", show.id, "userId:", user?.id);
  }, [show.id, user?.id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded properly. Please try again.");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account`,
      },
      redirect: 'if_required'
    });

    if (error) {
      console.error("Payment failed:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log("Payment succeeded:", paymentIntent);
      setLoading(false);
      console.log("Ready to create ticket with showId:", show.id, "userId:", user?.id, "paymentIntentId:", paymentIntent );
      
      const response = await fetch("/api/create-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId: show.id,
          userId: user?.id,
          paymentIntentId: paymentIntent.id,
        })
      });

      if (!response.ok) {
        console.error("Failed to create ticket:", response);
        setErrorMessage("Failed to create ticket. Please try again.");
      } else {
        router.push("/account");
      }
    }
  };

  return (
    <form className="bg-white p-2 rounded-md" onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button className="border rounded px-4 py-2 mt-4 bg-blood text-white border-blood" disabled={loading}>
        <strong>{loading ? "Processing..." : "Buy Now"}</strong>
      </button>
    </form>
  );
};

export default CheckoutForm;
