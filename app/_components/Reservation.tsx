import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import { cabinInterface } from "../_types/types";
import ReservationForm from "./ReservationForm";

export default async function Reservation({
  cabin,
}: {
  cabin: cabinInterface;
}) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  return (
    <div className="grid grid-cols-[auto_auto] border border-primary-800 min-h-100">
      <DateSelector
        settings={settings}
        cabin={cabin}
        bookedDates={bookedDates}
      />
      <ReservationForm cabin={cabin} />
    </div>
  );
}
