import { Session, User } from "next-auth";
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
  name: string;
  email: string;
  image: string;
}

export interface CustomSession extends Session {
  user: User & {
    guestId?: number;
  };
}
