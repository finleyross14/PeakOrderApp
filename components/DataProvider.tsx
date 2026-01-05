"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import {
  Charity,
  Event,
  Guess,
  HistoricalDataPoint,
  PaymentMethod,
  ProAccess,
  User,
  Donation
} from "../lib/types";
import { useAuth } from "./AuthProvider";

interface DataContextValue {
  charities: Charity[];
  events: Event[];
  activeEvent: Event | null;
  guesses: Guess[];
  proAccess: ProAccess[];
  historicalData: HistoricalDataPoint[];
  donations: Donation[];
  submitGuess: (value: number, paymentMethod: PaymentMethod, paymentNote: string, charityId?: string) => void;
  addDonation: (guessId: string, amount: number) => void;
  grantPro: () => void;
  setFinalPeakOrders: (value: number) => void;
  markGuessPaid: (guessId: string, isPaid: boolean) => void;
  addEvent: (event: Omit<Event, "id">) => void;
  recordDonation: (userId: string, eventId: string, amount: number, paymentMethod: PaymentMethod, paymentNote?: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

// Seed data
const seedCharities: Charity[] = [
  {
    id: "c1",
    name: "Code for Good",
    description: "Supporting STEM education for underserved communities.",
    url: "https://example.org/code-for-good",
    category: "Education"
  },
  {
    id: "c2",
    name: "Health First",
    description: "Improving access to basic healthcare globally.",
    url: "https://example.org/health-first",
    category: "Health"
  }
];

const seedEvent: Event = {
  id: "e1",
  name: "Peak Orders – Holiday 2025",
  description:
    "Guess the highest number of internet orders we'll hit in a single day during the holiday event. Entry is $10, supports charity, and you can donate more to climb the leaderboard!",
  start: new Date(),
  end: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  registrationOpensAt: new Date(new Date().getTime() + 1 * 60 * 60 * 1000), // Opens in 1 hour
  entryFee: 10,
  proFee: 30,
  isActive: true,
  charityIds: ["c1", "c2"],
  finalPeakOrders: null,
  createdBy: "leader-1",
  createdAt: new Date()
};

const seedHistory: HistoricalDataPoint[] = [
  { year: 2022, peakOrders: 48000 },
  { year: 2023, peakOrders: 53000 },
  { year: 2024, peakOrders: 62000 }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [charities] = useState<Charity[]>(seedCharities);
  const [events, setEvents] = useState<Event[]>([seedEvent]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [proAccess, setProAccess] = useState<ProAccess[]>([]);
  const [historicalData] = useState<HistoricalDataPoint[]>(seedHistory);
  const [donations, setDonations] = useState<Donation[]>([]);

  const activeEvent = useMemo(
    () => events.find((e) => e.isActive) ?? null,
    [events]
  );

  const submitGuess = (
    value: number,
    paymentMethod: PaymentMethod,
    paymentNote: string,
    charityId?: string
  ) => {
    if (!user || !activeEvent) return;
    const existing = guesses.find(
      (g) => g.userId === user.id && g.eventId === activeEvent.id
    );
    if (existing) {
      alert("You already submitted a guess for this event. You can still donate more from the leaderboard.");
      return;
    }
    const now = new Date();
    const guess: Guess = {
      id: `g-${now.getTime()}`,
      eventId: activeEvent.id,
      userId: user.id,
      value,
      createdAt: now,
      totalDonation: activeEvent.entryFee,
      paymentMethod,
      paymentNote,
      isPaid: false,
      charityId
    };
    // attach display name for guest flows
    if (user.name) {
      (guess as any).userName = user.name;
    }
    setGuesses((prev) => [...prev, guess]);
  };


  const addDonation = (guessId: string, amount: number) => {
    setGuesses((prev) =>
      prev.map((g) =>
        g.id === guessId ? { ...g, totalDonation: g.totalDonation + amount } : g
      )
    );
  };

  const grantPro = () => {
    if (!user || !activeEvent) return;
    const existing = proAccess.find(
      (p) => p.userId === user.id && p.eventId === activeEvent.id
    );
    if (existing) return;
    const now = new Date();
    const pa: ProAccess = {
      id: `p-${now.getTime()}`,
      eventId: activeEvent.id,
      userId: user.id,
      grantedAt: now
    };
    setProAccess((prev) => [...prev, pa]);
  };

  const setFinalPeakOrders = (value: number) => {
    if (!activeEvent) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === activeEvent.id ? { ...e, finalPeakOrders: value } : e
      )
    );
  };

  const markGuessPaid = (guessId: string, isPaid: boolean) => {
    setGuesses((prev) =>
      prev.map((g) => (g.id === guessId ? { ...g, isPaid } : g))
    );
  };

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: `e-${new Date().getTime()}`,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const recordDonation = (
    userId: string,
    eventId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentNote?: string
  ) => {
    const donation: Donation = {
      id: `d-${new Date().getTime()}`,
      userId,
      eventId,
      amount,
      paymentMethod,
      paymentNote,
      isPaid: false,
      createdAt: new Date(),
    };
    // try to attach userName when available (guest flow)
    if (user && user.id === userId) {
      (donation as any).userName = user.name;
    }
    setDonations((prev) => [...prev, donation]);
  };

  return (
    <DataContext.Provider
      value={{
        charities,
        events,
        activeEvent,
        guesses,
        proAccess,
        historicalData,
        donations,
        submitGuess,
        addDonation,
        grantPro,
        setFinalPeakOrders,
        markGuessPaid,
        addEvent,
        recordDonation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}
