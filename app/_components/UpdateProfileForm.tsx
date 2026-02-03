"use client";

import { useActionState, useEffect, useState } from "react";
import { guestInterface } from "../_types/types";
import { updateGuest } from "../_lib/actions";
import { toast } from "sonner";
import SpinnerMini from "./SpinnerMini";
import Image from "next/image";

export default function UpdateProfileForm({
  children,
  guest,
}: {
  children: React.ReactNode;
  guest: guestInterface;
}) {
  // const [count, setCount] = useState(0);

  const { fullName, email, countryFlag, nationality, nationalID } = guest;
  const [state, formAction, isPending] = useActionState(updateGuest, {});

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={fullName}
          name="fullName"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <Image
            width={48}
            height={32}
            src={countryFlag}
            alt="Country flag"
            className="h-5 rounded-sm"
          />
        </div>
        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          disabled={isPending}
          name="nationalID"
          defaultValue={nationalID}
          className={
            "px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          }
        />
        {state.errors?.nationalID && (
          <p className="text-sm text-red-400">{state.errors.nationalID[0]}</p>
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
  );
}
