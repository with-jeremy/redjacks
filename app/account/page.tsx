"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/supabaseClient';
import { useUser } from '@clerk/nextjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { QRCodeSVG } from 'qrcode.react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// Added for animations:
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ticketStatus, setTicketStatus] = useState({});
  // Renamed from showValidOnly
  const [obscureInvalid, setObscureInvalid] = useState(false);
  const [stackByEvent, setStackByEvent] = useState(false);
  const [limit, setLimit] = useState(10);
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
        .eq('user_id', user_id || '')
        .limit(limit);

      if (error) {
        console.error('Error fetching tickets:', error);
        setError('Error loading tickets');
      } else {
        setTickets(data);
        // Keep ticketStatus usage if needed:
        const status = {};
        data.forEach(ticket => {
          status[ticket.id] = ticket.isValid;
        });
        setTicketStatus(status);
      }
      setIsLoaded(true);
    };

    fetchTickets();

    // Update tickets directly upon isValid changes:
    const ticketChannel: RealtimeChannel = db.channel('tickets')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets' }, (payload) => {
        setTickets((prev) =>
          prev.map(t =>
            t.id === payload.new.id ? { ...t, isValid: payload.new.isValid } : t
          )
        );
      })
      .subscribe();

    return () => {
      db.removeChannel(ticketChannel);
    };
  }, [userLoaded, limit]);

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  // 1) Sort by door_time:
  const timeSorted = [...tickets].sort((a, b) => {
    const ta = a.shows?.door_time ? new Date(a.shows.door_time).getTime() : Infinity;
    const tb = b.shows?.door_time ? new Date(b.shows.door_time).getTime() : Infinity;
    return ta - tb;
  });

  // 2) If obscureInvalid is checked, push invalid to the back:
  const finalTickets = obscureInvalid
    ? timeSorted.sort((a, b) => {
        if (a.isValid === b.isValid) return 0;
        return a.isValid ? -1 : 1;
      })
    : timeSorted;

  // 3) Group tickets by show_id (already sorted by time & validity):
  const groupedTickets = finalTickets.reduce((acc, ticket) => {
    if (!acc[ticket.show_id]) {
      acc[ticket.show_id] = [];
    }
    acc[ticket.show_id].push(ticket);
    return acc;
  }, {});

  // Changed label text to "Obscure Invalid Tickets"
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Tickets</h1>
      <p className="mb-4">Manage your tickets here, {user.firstName}.</p>
      <label className="mb-4 block">
        <input
          type="checkbox"
          checked={obscureInvalid}
          onChange={(e) => setObscureInvalid(e.target.checked)}
        />
        Obscure Invalid Tickets
      </label>
      <label className="mb-4 block">
        <input
          type="checkbox"
          checked={stackByEvent}
          onChange={(e) => setStackByEvent(e.target.checked)}
        />
        Stack by event
      </label>

      {finalTickets.length > 0 ? (
        <div>
          <Slider
            dots={true}
            infinite={false}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            responsive={[
              {
                breakpoint: 1024,
                settings: { slidesToShow: 2, slidesToScroll: 1, infinite: true, dots: true },
              },
              {
                breakpoint: 600,
                settings: { slidesToShow: 1, slidesToScroll: 1 },
              },
            ]}
          >
            {stackByEvent
              ? Object.values(groupedTickets).map((group: any[]) => (
                  <AnimatePresence key={group[0].id}>
                    <motion.div
                      layout
                      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                      className="relative min-h-[300px]"
                    >
                      {group.map((ticket, index) => (
                        <motion.div
                          key={ticket.id}
                          layout
                          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                          className={`bg-gray-200 border border-blood p-4 max-w-[80%] m-auto absolute min-h-[200px] ${
                            obscureInvalid && !ticket.isValid ? 'opacity-50' : ''
                          }`}
                          style={{ right: `${index * 25}px`, top: `${index * 12}px` }}
                        >
                          <div className="absolute top-0 right-0 bg-white p-1 rounded-full">
                            {ticket.isValid ? (
                              <span className="bg-green-500 w-4 h-4 rounded-full block"></span>
                            ) : (
                              <span className="bg-red-500 w-4 h-4 rounded-full block"></span>
                            )}
                          </div>
                          <div className="flex flex-col items-center">
                            <h2 className="text-xl font-bold">{ticket.shows?.name}</h2>
                            <p>
                              {ticket.shows?.door_time
                                ? new Date(ticket.shows.door_time).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "2-digit",
                                  })
                                : 'Invalid date'}{' '}
                              @{' '}
                              {ticket.shows?.door_time
                                ? new Date(ticket.shows.door_time).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })
                                : 'Invalid date'}
                            </p>
                            {ticket.isValid && <QRCodeSVG value={ticket.id.toString()} />}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                ))
              : finalTickets.map((ticket) => (
                  <AnimatePresence key={ticket.id}>
                    <motion.div
                      layout
                      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                      className={`bg-gray-200 border border-blood p-4 max-w-[80%] m-auto relative min-h-[200px] ${
                        obscureInvalid && !ticket.isValid ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="absolute top-0 right-0 bg-white p-1 rounded-full">
                        {ticket.isValid ? (
                          <span className="bg-green-500 w-4 h-4 rounded-full block"></span>
                        ) : (
                          <span className="bg-red-500 w-4 h-4 rounded-full block"></span>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <h2 className="text-xl font-bold">{ticket.shows?.name}</h2>
                        <p>
                          {ticket.shows?.door_time
                            ? new Date(ticket.shows.door_time).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "2-digit",
                              })
                            : 'Invalid date'}{' '}
                          @{' '}
                          {ticket.shows?.door_time
                            ? new Date(ticket.shows.door_time).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })
                            : 'Invalid date'}
                        </p>
                        {ticket.isValid && <QRCodeSVG value={ticket.id.toString()} />}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ))}
          </Slider>
          {finalTickets.length >= limit && (
            <button
              onClick={handleLoadMore}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Load More
            </button>
          )}
        </div>
      ) : (
        <p>No tickets found for this user.</p>
      )}
    </div>
  );
}