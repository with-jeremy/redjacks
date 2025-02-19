// app/dashboard/events/page.tsx
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

async function getEvents() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    console.error("Error fetching events:", error);
    return []; // Or handle the error appropriately
  }

  return events || [];
}

export default async function EventsDashboard() {
  const events = await getEvents();

  return (
    <div>
      <h1>Events Dashboard</h1>
      <Link href="/dashboard/events/create">
      <button
        className="p-5 m-2 text-lg bg-gray-200 text-gray-800 w-40 h-40"
      >
Create New Event 
      </button>
      </Link>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.title} - {event.location} - {new Date(event.start_time).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}