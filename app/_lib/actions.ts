"use server";

import { revalidatePath } from "next/cache";
import {
  bookingDataInterface,
  CustomSession,
  FormState,
  settingsInterface,
} from "../_types/types";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { z } from "zod";
import { getBookings, getSettings } from "./data-service";
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
    .max(1000, "Observations must be under 1000 characters")
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
  const observations = String(formData.get("observations"));

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

export async function createBooking(
  bookingData: bookingDataInterface,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = (await auth()) as CustomSession;

  if (!session) {
    return {
      errors: { _form: ["Unauthorized"] },
      message: "You must be logged in to create a booking.",
    };
  }
  const settings: settingsInterface = await getSettings();

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: String(formData.get("observations")?.slice(0, 1000)),
    extrasPrice: formData.get("hasBreakfast")
      ? Number(settings.breakfastPrice * Number(bookingData.numNights))
      : 0,
    totalPrice: formData.get("hasBreakfast")
      ? Number(bookingData.cabinPrice) +
        Number(settings.breakfastPrice * Number(bookingData.numNights))
      : Number(bookingData.cabinPrice),
    isPaid: false,
    hasBreakfast: formData.get("hasBreakfast"),
    status: "unconfirmed",
  };

  try {
    await supabase.from("bookings").insert([newBooking]);
    revalidatePath(`/cabins/${bookingData.cabinId}`);
  } catch (error) {
    return {
      errors: { _form: ["Failed to create booking"] },
      message: "Something went wrong. Please try again.",
    };
  }

  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId: number) {
  const session = (await auth()) as CustomSession;
  if (!session) {
    return {
      success: false,
      error: "You must be logged in to delete a reservation.",
    };
  }

  const guestBookings = await getBookings(session.user.guestId!);
  const bookingIds = guestBookings.map((booking) => booking.id);

  if (!bookingIds.includes(bookingId)) {
    return {
      success: false,
      error: "You are not allowed to delete this reservation.",
    };
  }

  try {
    await supabase.from("bookings").delete().eq("id", bookingId);
    revalidatePath("/account/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete reservation" };
  }
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
