'use client';

import React, { useState } from "react";
import {
  useStripe, 
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useRouter } from 'next/navigation'; 

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


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
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required'
    });

    if (error) {
      console.error("Payment failed:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log("Payment succeeded:", paymentIntent);
    } else {
      console.error("Payment failed:", paymentIntent);
      setErrorMessage("Payment failed. Please try again.");
      setLoading(false);
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

export default CheckoutPage;