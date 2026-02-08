"use client";

import Image from "next/image";
import { cabinInterface, userInterface } from "../_types/types";
import { useReservation } from "./ReservationContext";
import { differenceInDays } from "date-fns";
import { createBooking } from "../_lib/actions";
import { useActionState, useEffect } from "react";
import SpinnerMini from "./SpinnerMini";
import { toast } from "sonner";
function ReservationForm({
  cabin,
  user,
}: {
  cabin: cabinInterface;
  user: userInterface;
}) {
  // CHANGE
  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;
  const startDate = range?.from;
  const endDate = range?.to;
  const numNights = differenceInDays(endDate!, startDate!);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  const [state, action, isPending] = useActionState(createBookingWithData, {});

  useEffect(() => {
    if (!state) return;

    if (state.message) {
      toast.error(state.message);
    } else {
      // Only reset on successful booking (no error)
      resetRange();
    }
  }, [state, resetRange]);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-5  flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          <Image
            src={user.image!}
            alt={user.name || "User avatar"}
            width={32}
            height={32}
            className="h-8 rounded-full"
            referrerPolicy="no-referrer"
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={action}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
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
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <p className="text-primary-300 text-base">Start by selecting dates</p>

          <button
            disabled={isPending || !(startDate && endDate)}
            type="submit"
            className="bg-accent-500 px-8 py-4 h-16 w-48 rounded-sm text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 flex justify-center items-center"
          >
            {isPending ? <SpinnerMini /> : "Reserve now"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
