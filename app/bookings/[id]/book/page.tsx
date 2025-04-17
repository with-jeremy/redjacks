"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { format, isBefore, isSameDay } from "date-fns";
import { db } from "@/lib/supabaseClient";
import { Calendar as CalendarComponent } from "@/app/components/ui/calendar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

export default function BookingFormPage({ params }: { params: { id: string } }) {
  const parkingSpotId = params.id;
  const router = useRouter();
  const [dates, setDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setFetchingData(true);
      setError(null);
      // Fetch price and availabilities
      const [spotRes, availRes] = await Promise.all([
        db.from("parking_spots").select("price_per_day").eq("id", parkingSpotId).single(),
        db.from("availability").select("date, is_available, price_override").eq("parking_spot_id", parkingSpotId),
      ]);
      if (spotRes.error) setError("Failed to load spot info");
      if (availRes.error) setError("Failed to load availability");
      setPrice(spotRes.data?.price_per_day || 0);
      setAvailabilities(availRes.data || []);
      setFetchingData(false);
    }
    fetchData();
  }, [parkingSpotId]);

  // Multi-date selection logic
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setDates((prev) => {
      const exists = prev.some((d) => isSameDay(d, date));
      if (exists) return prev.filter((d) => !isSameDay(d, date));
      return [...prev, date];
    });
  };

  const isDateDisabled = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const availability = availabilities.find((a) => a.date === dateString);
    if (availability && availability.is_available === false) return true;
    if (isBefore(date, new Date(new Date().setHours(0, 0, 0, 0)))) return true;
    return false;
  };

  // Calculate total
  const selectedAvailabilities = dates.map((date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return availabilities.find((a) => a.date === dateString);
  });
  const effectivePrices = selectedAvailabilities.map((a) => a?.price_override ?? price);
  const subtotal = effectivePrices.reduce((sum, p) => sum + p, 0);
  const serviceFee = subtotal * 0.15;
  const total = subtotal + serviceFee;

  const handleBooking = async () => {
    if (!dates.length) {
      setError("Please select at least one date");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Create booking record for each date
      const bookingDates = dates.map((d) => format(d, "yyyy-MM-dd"));
      const { error: bookingError } = await db.from("bookings").insert(
        bookingDates.map((date, i) => ({
          parking_spot_id: parkingSpotId,
          booking_date: date,
          check_in_time: "09:00",
          check_out_time: "18:00",
          price_per_day: effectivePrices[i],
          service_fee: effectivePrices[i] * 0.15,
          total_price: effectivePrices[i] * 1.15,
          status: "pending"
        }))
      );
      if (bookingError) throw bookingError;
      // Redirect to confirmation page for the spot
      router.push(`/bookings/${parkingSpotId}/confirmation`);
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Book Parking Spot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select days</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={fetchingData}>
                <Calendar className="mr-2 h-4 w-4" />
                {dates.length > 0 ? dates.map((d) => format(d, "MMM d")).join(", ") : "Select days"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="multiple"
                selected={dates}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-4 pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleBooking} disabled={loading || !dates.length || fetchingData}>
          {loading ? "Processing..." : "Confirm Booking"}
        </Button>
      </CardFooter>
    </Card>
  );
}