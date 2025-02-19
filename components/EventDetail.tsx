import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';



interface EventDetailProps {
    eventId: string;
}

interface Event {
    id: string;
    show_title: string;
    start_time: string;
    door_time: string;
    capacity: number;
    price: number;
    show_flyer_url?: string;
    description: string;
}

const EventDetail: React.FC<EventDetailProps> = ({ eventId }) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvent() {
            console.log(`Fetching event with ID: ${eventId}`);
            const { data: event, error } = await supabase
                .from("events")
                .select("*")
                .eq("id", eventId)
                .single();

            if (error) {
                console.error("Error fetching event:", error);
            } else {
                console.log("Event fetched successfully:", event);
                console.log("Event fields:", Object.keys(event)); // Output field names
                setEvent(event);
            }
            setLoading(false);
        }

        fetchEvent();
    }, [eventId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!event) {
        return <div>No event found.</div>;
    }



    return (
            <div className=" p-6 max-w-sm mx-auto text-gray-800 bg-white rounded-xl shadow-md space-y-4 hover:bg-gray-100">
                <h2 className="text-xl font-bold">{event.show_title}</h2>
                <strong className="text-gray-500">{new Date(event.start_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })} @ {new Date(event.door_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true })}</strong>
                <p className="text-gray-500">Capacity: {event.capacity}</p>
                <p className="text-gray-500">Price: ${event.price}</p>
                {event.show_flyer_url && (
              <img
                src={event.show_flyer_url || "/placeholder.svg"}
                alt="Show Flyer"
                className="mt-2 max-w-full h-auto mx-auto"
                style={{ maxHeight: "400px" }}
              />
            )}
                            <p className="text-gray-500">{event.description}</p>

            </div>
    );
};

export default EventDetail;
