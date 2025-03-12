import { db } from '@/lib/supabaseClient';
import { currentUser } from '@clerk/nextjs/server';
import { QRCodeSVG } from 'qrcode.react';
import type { User } from '@clerk/backend';


export default async function AccountPage() {
  const user: User | null = await currentUser();
  const user_id = user?.id;
  const { data: tickets, error } = await db
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
    return <div>Error loading tickets</div>;
  }

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
                  <li key={ticket.id} className="min-w-[300px] background-gray-200 border p-4 relative">
                    {ticket.shows?.name || 'Unknown Show'}
                    <div className="mb-4">
                      <p>
                       
                          {new Date(ticket.shows?.door_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })} @ {new Date(ticket.shows?.door_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}
                        
                       </p>                 
                        {ticket.isValid && new Date(ticket.shows?.door_time).toDateString() === new Date().toDateString() && (
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