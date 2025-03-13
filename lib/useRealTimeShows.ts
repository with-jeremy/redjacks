import { useEffect, useState } from 'react';
import { db } from './supabaseClient';

export function useRealTimeShows() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      const { data, error } = await db.from('shows').select('id, name, capacity, tickets (id, isValid)');
      if (error) {
        console.error('Error fetching shows:', error);
        setError('Error loading shows');
      } else {
        setShows(data);
      }
      setIsLoaded(true);
    };

    fetchShows();

    const handleUpdate = async (payload) => {
      console.log('Real-time update received:', payload);
      fetchShows();
    };

    const subscription = db
      .channel('public:shows')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shows' }, handleUpdate)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shows' }, handleUpdate)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'shows' }, handleUpdate)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' }, handleUpdate)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets' }, handleUpdate)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tickets' }, handleUpdate)
      .subscribe();

    return () => {
      db.removeChannel(subscription);
    };
  }, []);

  return { shows, error, isLoaded };
}
