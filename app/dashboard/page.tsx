import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import Link from 'next/link'
import { clerkClient } from '@clerk/nextjs/server'  

export default async function AdminDashboard() {
  if (!checkRole('admin')) {
    redirect('/')
  }
  const client = await clerkClient()

  console.log(client)

  return (
    <div className="grid gap-5 p-5 bg-gray-800">
      <h1>Hello </h1>
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
