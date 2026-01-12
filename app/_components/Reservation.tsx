import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { Cabin } from "../_types/cabinInterface";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";

export default async function Reservation({ cabin }: { cabin: Cabin }) {
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
      <ReservationForm />
    </div>
  );
}
