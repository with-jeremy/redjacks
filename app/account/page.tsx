import { db } from '@/lib/supabaseClient';
import { currentUser } from '@clerk/nextjs/server'
import {QRCodeSVG} from 'qrcode.react';

export default async function AccountPage() {
  const user = await currentUser();
  const { data: tickets, error } = await db
    .from("tickets")
    .select(`
      id,
      show_id,
      isValid,
      shows (
        name
      )
    `)
    .eq("user_id", user?.id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Tickets</h1>
      <p className="mb-4">Manage your tickets here.</p>

      {user ? (
        <div>
          {tickets.length > 0 ? (
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