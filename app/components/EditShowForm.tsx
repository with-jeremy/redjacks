'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function EditShowForm({ show }) {
  const [name, setName] = useState(show.name);
  const [description, setDescription] = useState(show.description);
  const [doorTime, setDoorTime] = useState(formatDateTime(show.door_time));
  const [startTime, setStartTime] = useState(formatDateTime(show.start_time));
  const [capacity, setCapacity] = useState(show.capacity);
  const [price, setPrice] = useState(show.price);
  const [showFlyer, setShowFlyer] = useState(show.show_flyer);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setDoorTime(formatDateTime(show.door_time));
    setStartTime(formatDateTime(show.start_time));
  }, [show.door_time, show.start_time]);

  const handleRemoveFlyer = () => {
    setShowFlyer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/update-show', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: show.id, name, description, doorTime, startTime, capacity, price, showFlyer }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update show');
      }

      router.push('/dashboard/shows');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="name" className="block mb-2 text-white">Show Title</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded text-black" />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 text-white">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded text-black" />
      </div>
      <div>
        <label htmlFor="doorTime" className="block mb-2 text-white">Door Time</label>
        <input id="doorTime" type="datetime-local" value={doorTime} onChange={(e) => setDoorTime(e.target.value)} className="w-full p-2 border rounded text-black" />
      </div>
      <div>
        <label htmlFor="startTime" className="block mb-2 text-white">Start Time</label>
        <input id="startTime" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 border rounded text-black" />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="capacity" className="block mb-2 text-white">Capacity</label>
          <input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full p-2 border rounded text-black" />
        </div>
        <div className="flex-1">
          <label htmlFor="price" className="block mb-2 text-white">Price</label>
          <input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded text-black" />
        </div>
      </div>
      <div>
        <label htmlFor="showFlyer" className="block mb-2 text-white">Show Flyer</label>
        <input id="showFlyer" type="file" accept="image/*" onChange={(e) => setShowFlyer(e.target.files[0])} className="w-full p-2 border rounded text-black" />
        {showFlyer && (
          <div className="relative mt-2">
            <img src={typeof showFlyer === 'string' ? showFlyer : URL.createObjectURL(showFlyer)} alt="Show Flyer" className="w-24 h-24 object-cover rounded" />
            <button type="button" onClick={handleRemoveFlyer} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">X</button>
          </div>
        )}
      </div>
      <button type="submit" disabled={isLoading} className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-blue-300">
        {isLoading ? 'Updating...' : 'Update Show'}
      </button>
    </form>
  );
}
