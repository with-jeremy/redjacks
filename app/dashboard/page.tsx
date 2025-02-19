'use client';

import React from 'react';
import 'tailwindcss/tailwind.css';
import Link from "next/link"

const Dashboard = () => {

  return (
    <div className="grid gap-5 p-5 bg-gray-800">
      <Link href="/dashboard/users">
      <button
        className="p-5 m-2 text-lg bg-gray-200 text-gray-800 w-40 h-40"
      >
        User Management
      </button>
      </Link>
      <button className="p-5 m-2 text-lg bg-gray-200 text-gray-800 w-40 h-40">
        Events Management
      </button>
    </div>
  );
};

export default Dashboard;
