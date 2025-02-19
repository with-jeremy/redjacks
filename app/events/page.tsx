"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import EventDetail from '@/components/EventDetail';

const EventsPage: React.FC = () => {
  interface Event {
    id: string;
    name: string;
    start_time: string;
    // Add other event properties here
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      console.log("Fetching events...");
      const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        console.log("Events fetched successfully:", events);
        setEvents(events);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  return (
    <div>
     
      
      <h1>Events List</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(event => (
            <div className='flex p-5 mx-auto' key={event.id}>
              <Link href={`/dashboard/events/${event.id}`} className="block justify-center align-center">
                <EventDetail eventId={event.id} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;