"use client";

import { useOptimistic } from "react";
import { bookingInterface } from "../_types/types";
import { deleteBooking } from "../_lib/actions";
import ReservationCard from "./ReservationCard";

export default function ReservationList({
  bookings,
}: {
  bookings: bookingInterface[];
}) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, id) => {
      return curBookings.filter((booking) => booking.id !== id);
    },
  );

  async function handleDelete(id: number) {
    optimisticDelete(id);
    await deleteBooking(id);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
}
