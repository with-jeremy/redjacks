"use client";

import { useState, useEffect } from "react";
import CheckoutPage from "@/app/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

interface Event {
  show_title: string;
  start_time: string;
  door_time: string;
  price: number;
  show_flyer_url?: string;
}

export default function TicketPurchase({ event }: { event: Event }) {
  const [quantity, setQuantity] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutClicked, setCheckoutClicked] = useState(false); // New state
  const [loading, setLoading] = useState(false); // New state
  const price = event.price;
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
    setLoading(true); // Set loading to true when checkout is clicked
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
          setLoading(false); // Set loading to false when clientSecret is received
        });
    }
  }, [amount, checkoutClicked]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">{event.show_title}</h1>
      <div className="mb-4 text-center">
        <p>
          <strong>{new Date(event.start_time).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })} at {new Date(event.door_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} </strong>
        </p>     
        
      </div>
      <div className="bg-white text-black p-4 rounded shadow-md mb-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Buy Tickets</h2>
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
              onClick={handleCheckoutClick} // Add onClick handler
            >
              Checkout
            </button>
          )}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <div className="text-center">
          {checkoutClicked && clientSecret && (
            <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutPage amount={amount} />
            </Elements>
          )}
        </div>
      </div>
      {event.show_flyer_url && (
        <img
          src={event.show_flyer_url || "/placeholder.svg"}
          alt="Show Flyer"
          className="mt-2 max-w-full mx-auto h-auto"
        />
      )}    
      <style jsx>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}