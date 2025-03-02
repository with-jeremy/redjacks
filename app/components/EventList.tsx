import Link from "next/link"
import { Events } from "@/types/globals"
export default function EventList({ events }: { events: Events }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event: Events[number]) => (
        <Link href={`/events/${event.id}`} key={event.id} className="block">
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow text-center">
            <h2 className="text-xl font-semibold mb-2">{event.show_title}</h2>
            <div className="mb-4">
              <p>
                <strong>{new Date(event.start_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })} @ {new Date(event.door_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}</strong>
              </p>
            </div>
            {event.show_flyer_url && (
              <img
                src={event.show_flyer_url || "/placeholder.svg"}
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