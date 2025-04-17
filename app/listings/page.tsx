// --- Server component for fetching and passing spots ---
import { db } from '@/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';
import ListingsFilterClient from '../components/ListingsFilterClient';

const supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default async function ListingsPage() {
  // Fetch spots with their images (if any)
  const { data: spots, error } = await db
    .from('parking_spots')
    .select('*, parking_spot_images(image_url, is_primary)')
    .eq('is_active', true);

  if (error) {
    return <div className="p-8">Error loading parking spots: {error.message}</div>;
  }

  if (!spots) {
    return <div className="p-8">Loading...</div>;
  }

  // Generate signed URLs for the first image of each spot
  const spotsWithSignedUrls = await Promise.all(
    spots.map(async spot => {
      let signedUrl = null;
      if (Array.isArray(spot.parking_spot_images) && spot.parking_spot_images.length > 0) {
        const imagePath = spot.parking_spot_images[0].image_url;
        const { data } = await supabaseAdmin.storage
          .from('parking-spot-images')
          .createSignedUrl(imagePath.replace(/^.*parking-spot-images\//, ''), 60 * 60); // 1 hour expiry
        signedUrl = data?.signedUrl || null;
      }
      return { ...spot, signedUrl };
    })
  );

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      {/* Sidebar */}
      <div className="w-80 min-w-[240px] max-w-xs bg-white border-r border-gray-200 p-4 overflow-y-auto hidden md:block">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        {/* Render only the filter UI from ListingsFilterClient if possible */}
        <ListingsFilterClient spots={spotsWithSignedUrls} filterOnly />
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Available Parking Spots</h1>
        {/* Render only the grid from ListingsFilterClient if possible */}
        <ListingsFilterClient spots={spotsWithSignedUrls} gridOnly />
      </div>
    </div>
  );
}