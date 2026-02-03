"use server";

import { revalidatePath } from "next/cache";
import { CustomSession, FormState } from "../_types/types";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { z } from "zod";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

// updateGuest action
const guestSchema = z.object({
  nationalID: z
    .string()
    .min(6, "Must be at least 6 characters")
    .max(12, "Must be at most 12 characters")
    .regex(/^[A-Za-z0-9]+$/, "Only letters and numbers allowed"),
});

const reservationSchema = z.object({
  numGuests: z
    .number()
    .min(1, "Must have at least 1 guest")
    .max(10, "Maximum 10 guests allowed"),
  observations: z
    .string()
    .max(500, "Observations must be under 500 characters")
    .optional(),
});

export async function updateGuest(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = (await auth()) as CustomSession;
  if (!session) {
    return {
      errors: { _form: ["Unauthorized"] },
      message: "You must be logged in to update your profile.",
    };
  }

  const nationalID = formData.get("nationalID");
  const nationalityData = formData.get("nationality");

  if (typeof nationalID !== "string") {
    return {
      errors: { nationalID: ["National ID is required"] },
      message: "National ID is required.",
    };
  }

  if (typeof nationalityData !== "string") {
    return {
      errors: { nationality: ["Nationality is required"] },
      message: "Nationality is required.",
    };
  }

  const [nationality, countryFlag] = nationalityData.split("%");

  const result = guestSchema.safeParse({ nationalID });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const updateData = {
    nationalID: result.data!.nationalID,
    nationality,
    countryFlag,
  };

  try {
    await supabase
      .from("guests")
      .update(updateData)
      .eq("id", session.user!.guestId!);

    revalidatePath("/account/profile");

    return {
      success: true,
      message: "Guest updated successfully.",
    };
  } catch (error) {
    return {
      errors: { _form: ["Guest could not be updated"] },
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function updateReservation(
  bookingId: number,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = (await auth()) as CustomSession;
  if (!session) {
    return {
      errors: { _form: ["Unauthorized"] },
      message: "You must be logged in to update your reservation.",
    };
  }

  const guestBookings = await getBookings(session.user.guestId!);
  const bookingIds = guestBookings.map((booking) => booking.id);

  if (!bookingIds.includes(bookingId)) {
    return {
      errors: { _form: ["Unauthorized"] },
      message: "You are not allowed to update this reservation.",
    };
  }

  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations") as string;

  const result = reservationSchema.safeParse({ numGuests, observations });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const updateData = {
    numGuests: result.data.numGuests,
    observations: result.data.observations ?? "",
  };

  try {
    await supabase.from("bookings").update(updateData).eq("id", bookingId);
    revalidatePath("/account/profile");
  } catch (error) {
    return {
      errors: { _form: ["Failed to update reservation"] },
      message: "Something went wrong. Please try again.",
    };
  }

  redirect("/account/reservations");
}

export async function deleteReservation(bookingId: number) {
  const session = (await auth()) as CustomSession;
  if (!session) {
    throw new Error("Unauthorized");
  }

  const guestBookings = await getBookings(session.user.guestId!);
  const bookingIds = guestBookings.map((booking) => booking.id);

  if (!bookingIds.includes(bookingId)) {
    throw new Error("Unauthorized to delete this reservation");
  }

  try {
    await supabase.from("bookings").delete().eq("id", bookingId);
    revalidatePath("/account/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete" };
  }
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
