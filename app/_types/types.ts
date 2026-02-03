import { Session } from "next-auth";
import { ReactNode } from "react";

export interface childrenProp {
  children: ReactNode;
}

export interface cabinInterface {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
}

export interface settingsInterface {
  id: number;
  created_at: string;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
}

export interface dateSelectorProps {
  settings: settingsInterface;
  cabin: cabinInterface;
  bookedDates: Date[];
}

export interface userInterface {
  name?: string;
  email?: string;
  image?: string;
}

export interface CustomSession extends Session {
  user: userInterface & {
    guestId?: number;
  };
}

export interface guestInterface {
  id: number;
  fullName: string;
  email: string;
  countryFlag: string;
  nationalID: string;
  nationality: string;
}

export interface bookingInterface {
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: "checked-in" | "checked-out" | "unconfirmed";
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  cabinId: number;
  guestId: number;
  id: number;
  cabins: cabinInterface;
}

export type FormState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};
