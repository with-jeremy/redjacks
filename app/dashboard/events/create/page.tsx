// app/events/create/page.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { supabase } from '@/lib/supabaseClient';

export default function EventForm() {
  const [showTitle, setShowTitle] = useState("");
  const [description, setDescription] = useState("");
  const [doorTime, setDoorTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [showFlyer, setShowFlyer] = useState<File | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn || !user) {
    return <div>Sign in to create events.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let showFlyerUrl = "";

      if (showFlyer) {
        const fileExt = showFlyer.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("showPosters")
          .upload(filePath, showFlyer, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("File upload error:", uploadError);
          throw new Error(`Could not upload image: ${uploadError.message}. Please check your storage bucket policies.`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("showPosters")
          .getPublicUrl(filePath);

        

        showFlyerUrl = publicUrlData.publicUrl;
      }

      if (!user.id) {
        throw new Error("User ID not found.");
      }

      const { error: insertError } = await supabase.from("events").insert([
        {
          show_title: showTitle,
          description: description,
          door_time: doorTime,
          start_time: startTime,
          capacity: capacity,
          show_flyer_url: showFlyerUrl,
          price: price,
          user_id: user.id,
        },
      ]);

      if (insertError) {
        console.error("Database insert error:", insertError);
        throw new Error(`Could not create event: ${insertError.message}`);
      }

      router.push("/dashboard/events");
      router.refresh();
    } catch (err: unknown) {
      console.error("Error creating event:", err);
      if (err instanceof Error) {
        setError(`Error creating event: ${err.message}`);
      } else {
        setError("Error creating event: An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="showTitle" className="block mb-2 text-white">
          Show Title
        </label>
        <input
          id="showTitle"
          type="text"
          value={showTitle}
          onChange={(e) => setShowTitle(e.target.value)}
          required
          className="w-full p-2 border rounded text-black"
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 text-white">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded text-black"
        />
      </div>
      <div>
        <label htmlFor="doorTime" className="block mb-2 text-white">
          Door Time
        </label>
        <input
          id="doorTime"
          type="datetime-local"
          value={doorTime}
          onChange={(e) => setDoorTime(e.target.value)}
          className="w-full p-2 border rounded text-black"
        />
      </div>
      <div>
        <label htmlFor="startTime" className="block mb-2 text-white">
          Start Time
        </label>
        <input
          id="startTime"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border rounded text-black"
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="capacity" className="block mb-2 text-white">
            Capacity
          </label>
          <input
            id="capacity"
            type="number"
            value={capacity === null ? '' : capacity}
            onChange={(e) => setCapacity(e.target.value === '' ? null : Number(e.target.value))}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="price" className="block mb-2 text-white">
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price === null ? '' : price}
            onChange={(e) => setPrice(e.target.value === '' ? null : Number(e.target.value))}
            className="w-full p-2 border rounded text-black"
          />
        </div>
      </div>
      <div>
        <label htmlFor="showFlyer" className="block mb-2 text-white">
          Show Flyer
        </label>
        <input
          id="showFlyer"
          type="file"
          accept="image/*"
          onChange={(e) => setShowFlyer(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded text-black"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
      >
        {isLoading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}