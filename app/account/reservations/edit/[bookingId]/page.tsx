import UpdateReservationForm from "@/app/_components/UpdateReservationForm";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const bookingId = Number((await params).bookingId);

  const booking = await getBooking(bookingId);
  const { maxCapacity } = await getCabin(booking.cabinId);
  return (
    <div>
      <h1>Edit Reservation</h1>
      <UpdateReservationForm
        booking={booking}
        bookingId={bookingId}
        maxCapacity={maxCapacity}
      />
    </div>
  );
}
