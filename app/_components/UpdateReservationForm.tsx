"use client";

import SpinnerMini from "@/app/_components/SpinnerMini";
import { updateReservation } from "@/app/_lib/actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function UpdateReservationForm({
  bookingId,
  booking,
  maxCapacity,
}: {
  bookingId: number;
  booking: { numGuests: number; observations: string };
  maxCapacity: number;
}) {
  // CHANGE

  const updateReservationWithId = updateReservation.bind(
    null,
    Number(bookingId),
  );
  const [state, formAction, isPending] = useActionState(
    updateReservationWithId,
    {},
  );

  useEffect(() => {
    if (!state) return;

    if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <form
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
        action={formAction}
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            disabled={isPending}
            name="numGuests"
            defaultValue={booking.numGuests}
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            disabled={isPending}
            defaultValue={booking.observations}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
          {state.errors?.observations && (
            <p className="text-sm text-red-400">
              {state.errors.observations[0]}
            </p>
          )}
        </div>

        <div className="flex justify-end items-center gap-6">
          <button
            disabled={isPending}
            type="submit"
            className="bg-accent-500 px-8 py-4 h-16 w-48 rounded-sm text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 flex justify-center items-center"
          >
            {isPending ? <SpinnerMini /> : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
