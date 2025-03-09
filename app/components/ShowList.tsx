import Link from "next/link"
import { Shows } from "@/types/globals"
export default function ShowList({ shows }: { shows: Shows }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shows.map((show: Shows[number]) => (
        <Link href={`/shows/${show.id}`} key={show.id} className="block">
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow text-center">
            <h2 className="text-xl font-semibold mb-2">{show.name}</h2>
            <div className="mb-4">
              <p>
                <strong>{new Date(show.start_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })} @ {new Date(show.door_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}</strong>
              </p>
            </div>
            {show.show_flyer_url && (
              <img
                src={show.show_flyer_url || "/placeholder.svg"}
                alt="Show Flyer"
                className="mt-2 max-w-full h-auto mx-auto"
                style={{ maxHeight: "400px" }}
              />
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}