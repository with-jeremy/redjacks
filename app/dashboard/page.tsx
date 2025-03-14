"use client";

import Link from 'next/link';
import ShowsStats from '@/app/components/ShowsStats';

export default function AdminDashboard() {


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
      <div className="w-full">
        <ShowsStats />
    </div>
  </div>
  );
}
