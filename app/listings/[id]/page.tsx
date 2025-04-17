import { db } from "@/lib/supabaseClient";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/card";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';

export default async function ParkingSpotDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  // Fetch parking spot details
  const { data: spot, error: spotError } = await db
    .from("parking_spots")
    .select("*")
    .eq("id", id)
    .single();

  // Fetch amenities (join through parking_spot_amenities)
  const { data: amenities } = await db
    .from("parking_spot_amenities")
    .select("amenities(name)")
    .eq("parking_spot_id", id);

  // Fetch images
  const { data: images } = await db
    .from("parking_spot_images")
    .select("image_url, is_primary")
    .eq("parking_spot_id", id);

  // Generate signed URLs for all images
  const supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  let signedImages: { signedUrl: string | null, is_primary: boolean | null }[] = [];
  if (images && images.length > 0) {
    signedImages = await Promise.all(images.map(async (img: any) => {
      const { data } = await supabaseAdmin.storage
        .from('parking-spot-images')
        .createSignedUrl(img.image_url.replace(/^.*parking-spot-images\//, ''), 60 * 60);
      return { signedUrl: data?.signedUrl || null, is_primary: img.is_primary };
    }));
  }

  if (spotError) {
    return <div className="p-4 text-red-500">Error fetching parking spot: {spotError.message}</div>;
  }
  if (!spot) {
    return <div className="p-4">Loading parking spot...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle>{spot.title}</CardTitle>
            <CardDescription>{spot.address}, {spot.city}, {spot.state} {spot.zip_code}</CardDescription>
          </div>
          <Link href={`/bookings/${spot.id}/book/`} className="ml-4">
            <button className="bg-foreground text-white py-2 px-4 rounded hover:bg-primary/90 transition whitespace-nowrap">Book Now</button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-gray-700">{spot.description}</div>
        <div className="mb-4">
          <span className="font-semibold">Amenities:</span>
          <ul className="list-disc list-inside">
            {amenities && amenities.length > 0 ? amenities.map((a: any, i: number) => (
              <li key={i}>{a.amenities?.name}</li>
            )) : <li>No amenities listed.</li>}
          </ul>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {signedImages && signedImages.length > 0 ? signedImages.map((img, i) => (
            <img
              key={i}
              src={img.signedUrl || "/file.svg"}
              alt={`Parking Spot Image ${i + 1}`}
              width={300}
              height={200}
              className="rounded object-cover w-full h-40"
            />
          )) : <div className="col-span-2 text-center text-gray-400">No images available.</div>}
        </div>
        <div className="mb-2 font-semibold">Price per day: <span className="text-primary">${spot.price_per_day}</span></div>
        <div className="mb-2">Type: {spot.type}</div>
        <div className="mb-2">Spaces available: {spot.spaces_available ?? 'N/A'}</div>
      </CardContent>
      <CardFooter>
        <Link href={`/book/${spot.id}`} className="w-full">
          <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition">Book Now</button>
        </Link>
      </CardFooter>
    </Card>
  );
}
