import { db } from '@/lib/supabaseClient';
import { currentUser } from '@clerk/nextjs/server';
import { QRCodeSVG } from 'qrcode.react';
import { Tables } from '@/lib/supabase';
import type { User } from '@clerk/backend';

/**
 * Represents a Ticket type which extends the 'tickets' table from the database.
 * Optionally includes a nested 'shows' object containing the name of the show.
 *
 * @typedef {Object} Ticket
 * @property {Tables<'tickets'>} - The base properties from the 'tickets' table.
 * @property {Object} [shows] - An optional object containing show details.
 * @property {string} shows.name - The name of the show.
 */
type Ticket = Tables<'tickets'>;
type TicketWithShow = Ticket & {
  shows?: {
    id: string;
    name: string
  }
};

export default async function AccountPage() {
  const user: User | null = await currentUser();
  const user_id = user?.id;
  const { data: tickets } = await db.from<TicketWithShow>('tickets')
    .select(`
      id,
      isValid,
      show_id,
      user_id,
      shows (
        id,
        name
      )
    `)
    .eq('user_id', user_id || '');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Tickets</h1>
      <p className="mb-4">Manage your tickets here.</p>

      {user ? (
        <div>
          {tickets && tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <ul className="flex space-x-4">
                {tickets.map((ticket) => (
                  <li key={ticket.id} className="min-w-[300px] border p-4 relative">
                    {ticket.shows?.name || 'Unknown Show'}
                    <div className="relative">
                      {ticket.isValid && (
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
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}