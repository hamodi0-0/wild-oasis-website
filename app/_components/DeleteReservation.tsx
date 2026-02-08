"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import { toast } from "sonner";
import SpinnerMini from "./SpinnerMini";

function DeleteReservation({
  bookingId,
  onDelete,
}: {
  bookingId: number;
  onDelete: (id: number) => any; //change later
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await onDelete(bookingId);
      if (result.success) {
        toast.success("Reservation deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete reservation");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
    >
      {!isPending ? (
        <>
          <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span className="mt-1">Delete</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
}

export default DeleteReservation;
