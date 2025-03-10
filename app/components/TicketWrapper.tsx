"use client";

import { useState, useEffect } from "react";
import CheckoutForm from "@/app/components/CheckoutForm";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from '@clerk/nextjs';
import { Shows } from '@/types/globals';
import Image from 'next/image';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function TicketWrapper({ show }: { show: Shows[number] }) {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn || !user) {
    return <div>Sign in to purchase tickets.</div>;
  }

  const [quantity, setQuantity] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutClicked, setCheckoutClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const price = show.price;
  const amount = price * quantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 6) {
      setQuantity(value);
      setError(null);
    } else if (value > 6) {
      setQuantity(6);
      setError("Maximum quantity is 6.");
    }
  };

  const handleCheckoutClick = () => {
    setCheckoutClicked(true);
    setLoading(true);
  };

  useEffect(() => {
    if (checkoutClicked) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setLoading(false);
        });
    }
  }, [amount, checkoutClicked]);

  return (
   
        <div className="text-center mb-4">
          <p>{`$${price} ea  `} 
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              value={quantity} 
              onChange={handleQuantityChange} 
              min={1} 
              max={6} 
              className="rounded pl-1 ml-2 border border-black py-1 text-center bg-white text-black appearance-none" 
              style={{ MozAppearance: 'textfield', WebkitAppearance: 'textfield' }} 
            /> 
            {` = $${amount}`}
          </p>
          {!checkoutClicked && (
            <button 
              className="border rounded px-4 py-2 mt-4 bg-blood text-white border-blood"
              onClick={handleCheckoutClick}
            >
              Checkout
            </button>
          )}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {checkoutClicked && clientSecret && (
            <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm showId={show.id} />
            </Elements>
          )}
        </div>
     

  );
}