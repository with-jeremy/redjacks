'use client';

import React from 'react';
import 'tailwindcss/tailwind.css';
import Link from "next/link"
import { useUser } from '@clerk/nextjs';

const Dashboard = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn || !user) {
    return <div>Sign in to access the dashboard.</div>;
  }

  const role = user.publicMetadata.role || 'No Role';

  return (
    <div className="grid gap-5 p-5 bg-gray-800">
      <h1>Hello {String(user.firstName) || 'User'} with role {String(role)}</h1>
      <Link href="/dashboard/shows">
      <button className="p-5 m-2 text-lg bg-gray-200 text-gray-800 w-40 h-40">
        Events Management
      </button>
      </Link>
      <Link href="/">
      <button
        className="p-5 m-2 text-lg bg-gray-200 text-gray-800 w-40 h-40"
      >
        Logout
      </button>
      </Link>
      
    </div>
  );
};

export default Dashboard;
