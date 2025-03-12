"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/supabaseClient';
import { useUser } from '@clerk/nextjs';
import { QRCodeSVG } from 'qrcode.react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
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
        .eq('isValid', true)
        .limit(limit);

      if (error) {
        console.error('Error fetching tickets:', error);
        setError('Error loading tickets');
      } else {
        setTickets(data);
      }
      setIsLoaded(true);
    };

    fetchTickets();

    // Subscribe to ticket updates
    const subscription = db
      .channel('tickets-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets' }, async (payload) => {
        const updatedTicket = payload.new;
        const { data: showData, error: showError } = await db
          .from('shows')
          .select('id, door_time, name')
          .eq('id', updatedTicket.show_id)
          .single();

        if (showError) {
          console.error('Error fetching show data:', showError);
          return;
        }

        updatedTicket.shows = showData;

        setTickets((prev) => {
          const next = [...prev];
          const idx = next.findIndex((t) => t.id === updatedTicket.id);
          if (idx >= 0) {
            if (!updatedTicket.isValid) {
              next.splice(idx, 1);
            } else {
              next[idx] = updatedTicket;
            }
          } else if (updatedTicket.isValid) {
            next.push(updatedTicket);
          }
          return next;
        });
      })
      .subscribe();

    return () => {
      db.removeChannel(subscription);
    };
  }, [userLoaded, limit, user?.id]);

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  // Sort valid tickets by door_time
  const sortedTickets = [...tickets].sort((a, b) => {
    const ta = a.shows?.door_time ? new Date(a.shows.door_time).getTime() : Infinity;
    const tb = b.shows?.door_time ? new Date(b.shows.door_time).getTime() : Infinity;
    return ta - tb;
  });

  // Group by show_id
  const groupedTickets = sortedTickets.reduce((acc, ticket) => {
    if (!acc[ticket.show_id]) {
      acc[ticket.show_id] = [];
    }
    acc[ticket.show_id].push(ticket);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Tickets</h1>
      <p className="mb-4">Manage your tickets here, {user.firstName}.</p>

      {Object.keys(groupedTickets).length > 0 ? (
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
            {Object.values(groupedTickets).map((group: any[]) => (
              <AnimatePresence key={group[0].id}>
                <motion.div layout className="relative min-h-[300px]">
                  {group.map((ticket, index) => {
                    const dt = ticket.shows?.door_time
                      ? new Date(ticket.shows.door_time)
                      : null;
                    return (
                      <motion.div
                        key={ticket.id}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-200 border border-blood p-4 max-w-[80%] m-auto absolute min-h-[200px] rounded-lg shadow-lg"
                        style={{ right: `${index * 25}px`, top: `${index * 12}px` }}
                      >
                        <div className="absolute top-0 right-0 bg-white p-1 rounded-full">
                          <span
                            className={`${
                              ticket.isValid ? 'bg-green-500' : 'bg-red-500'
                            } w-4 h-4 rounded-full block`}
                          ></span>
                        </div>
                        <div className="flex flex-col items-center">
                          <h2 className="text-xl font-bold">{ticket.shows?.name || 'Untitled Show'}</h2>
                          {dt && (
                            <p className="pb-4">
                              {dt.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: '2-digit',
                              })}
                              {' @ ' }
                              {dt.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                              })}
                            </p>
                          )}
                          <div className="mb-4">
                            <QRCodeSVG value={ticket.id.toString()} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            ))}
          </Slider>
          {Object.keys(groupedTickets).length >= limit && (
            <button onClick={handleLoadMore} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Load More
            </button>
          )}
        </div>
      ) : (
        <p>No valid tickets found for this user.</p>
      )}
    </div>
  );
}