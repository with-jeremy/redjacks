"use client";

import Link from 'next/link';
import { useRealTimeShows } from '@/lib/useRealTimeShows';

export default function AdminDashboard() {
  const { shows, error, isLoaded } = useRealTimeShows();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load shows: {error}</div>;
  }

  return (
    <div className="p-5 bg-gray-800 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-5">Admin Dashboard</h1>
      <div className="mb-5">
        <Link href="/dashboard/shows">
          <button className="p-5 text-lg bg-blue-500 text-white rounded-lg w-full">
            Manage Shows
          </button>
        </Link>
      </div>
      <div className="bg-gray-700 p-5 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-5">Shows Stats</h2>
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 text-center">Name</th>
              <th className="py-2 px-4 text-center">Capacity</th>
              <th className="py-2 px-4 text-center">Tickets Sold</th>
              <th className="py-2 px-4 text-center">Tickets Used</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr key={show.id} className="border-t border-gray-600">
                <td className="py-2 px-4 text-center">{show.name}</td>
                <td className="py-2 px-4 text-center">{show.capacity}</td>
                <td className="py-2 px-4 text-center">{show.tickets.length}</td>
                <td className="py-2 px-4 text-center">{show.tickets.filter(ticket => !ticket.isValid).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
