import Link from "next/link"
import Image from "next/image"
import { Tables } from "@/lib/supabase"

export default function ShowList({ shows, isAdminDashboard = false }: { shows: Tables<'shows'>[], isAdminDashboard?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shows.map((show: Tables<'shows'>) => (
        <Link href={`/shows/${show.id}`} key={show.id} className="block">
            <div className="border border-blood rounded-lg p-4 bg-white text-center transform transition-transform duration-300 hover:scale-105 hover:border-2 hover:shadow-lg hover:shadow-red-500">
            <h2 className="text-xl font-semibold mb-2 text-black">{show.name}</h2>
            <div className="mb-4 text-black">
              <p>
              <strong>{new Date(show.start_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })} @ {new Date(show.door_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}</strong>
              </p>
              {isAdminDashboard && show.capacity !== undefined && (
                <p className="mt-2 text-sm">
                  <strong>Capacity:</strong> {show.capacity}
                </p>
              )}
            </div>
            {show.show_flyer && (
              <Image
              src={show.show_flyer || "/placeholder.svg"}
              alt="Show Flyer"
              className="mt-2 max-w-full h-auto mx-auto"
              style={{ maxHeight: "400px" }}
              width={400}
              height={400}
              />
            )}
            </div>
        </Link>
      ))}
    </div>
  )
}