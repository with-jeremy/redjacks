"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import EventDetail from '../../../components/EventDetail';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState([]);
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
     
      <div className="grid gap-5 p-5 bg-gray-800">
      <Link href="/dashboard/events/create">
        <button
          className="p-5 m-2 text-lg bg-gray-200 text-gray-800 w-40 h-40"
        >
          Create New Event
        </button>
      </Link>
      </div>
      <h1>Events Dashboard</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map(event => (
            <Link href={`/dashboard/events/${event.id}`} className="block" key={event.id}>
              <EventDetail eventId={event.id} />
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsPage;