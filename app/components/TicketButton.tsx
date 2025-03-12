"use client";

import React, { useState } from 'react';
import TicketWrapper from './TicketWrapper';
import { Tables } from '@/lib/supabase';

interface TicketButtonProps {
  show: Tables<'shows'>; // Replace 'any' with the actual type of 'show'
}

const TicketButton: React.FC<TicketButtonProps> = ({ show }) => {
  const [showTicketWrapper, setShowTicketWrapper] = useState(false);

  const handleBuyTicketsClick = () => {
    setShowTicketWrapper(true);
  };

  return (
    <>
      {!showTicketWrapper ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBuyTicketsClick}
        >
          Buy Tickets
        </button>
      ) : (
        <TicketWrapper show={show} />
      )}
    </>
  );
};

export default TicketButton;
