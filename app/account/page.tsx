"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/supabaseClient';
import { useUser } from '@clerk/nextjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { QRCodeSVG } from 'qrcode.react';

export default function AccountPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ticketStatus, setTicketStatus] = useState({});
  const { user, isLoaded: userLoaded } = useUser();

  useEffect(() => {
    if (!userLoaded) return;

    const fetchTickets = async () => {
      const user_id = user?.id;
      const { data, error } = await db
        .from('tickets')
        .select(`
          id,
          isValid,
          show_id,
          user_id,
          shows (
            id,
            door_time,
            name
          )
        `)
        .eq('user_id', user_id || '');

      if (error) {
        console.error('Error fetching tickets:', error);
        setError('Error loading tickets');
      } else {
        setTickets(data);
        const status = {};
        data.forEach(ticket => {
          status[ticket.id] = ticket.isValid;
        });
        setTicketStatus(status);
      }
      setIsLoaded(true);
    };

    fetchTickets();

    const ticketChannel: RealtimeChannel = db.channel('tickets').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets' }, (payload) => {
      setTicketStatus((prevStatus) => ({
        ...prevStatus,
        [payload.new.id]: payload.new.isValid,
      }));
    }).subscribe();

    return () => {
      db.removeChannel(ticketChannel);
    };
  }, [userLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Tickets</h1>
      <p className="mb-4">Manage your tickets here, {user.firstName}.</p>

      {tickets.length > 0 ? (
        <div className="overflow-x-auto">
          <ul className="flex space-x-4">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="min-w-[300px] bg-gray-200 border p-4 relative">
                <div className="absolute top-0 right-0 bg-white p-1 rounded-full">
                  {ticketStatus[ticket.id] ? (
                    <span className="bg-green-500 w-4 h-4 rounded-full block"></span>
                  ) : (
                    <span className="bg-red-500 w-4 h-4 rounded-full block"></span>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-bold">{ticket.shows?.name}</h2>
                  <p>
                    {ticket.shows?.door_time ? new Date(ticket.shows.door_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" }) : 'Invalid date'} @ {ticket.shows?.door_time ? new Date(ticket.shows.door_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }) : 'Invalid date'}
                  </p>
                  {ticketStatus[ticket.id] && (
                    <QRCodeSVG value={ticket.id.toString()} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No tickets found for this user.</p>
      )}
    </div>
  );
}