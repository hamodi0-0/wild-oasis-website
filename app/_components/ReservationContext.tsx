"use client";

import React, { createContext, useState } from "react";
import { DateRange } from "react-day-picker";
import { childrenProp } from "../_types/types";

interface ReservationContextType {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  resetRange: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

function ReservationProvider({ children }: childrenProp) {
  const [range, setRange] = useState<DateRange | undefined>();

  function resetRange() {
    setRange(undefined);
  }

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = React.useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
}

export { ReservationProvider, useReservation };
