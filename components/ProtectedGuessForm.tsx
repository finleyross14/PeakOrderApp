"use client";

import React, { useState } from "react";
import { Event, PaymentMethod } from "../lib/types";
import {
  canUserGuess,
  isRegistrationOpen,
  getUserEventDonationTotal,
} from "../lib/donationVerification";

interface ProtectedGuessFormProps {
  event: Event;
  userId: string;
  charities: { id: string; name: string }[];
  userDonationTotal: number;
  onSubmitGuess: (
    value: number,
    paymentMethod: PaymentMethod,
    paymentNote: string,
    charityId?: string
  ) => void;
  onDonate?: () => void; // callback to open donation form if needed
}

export default function ProtectedGuessForm({
  event,
  userId,
  charities,
  userDonationTotal,
  onSubmitGuess,
  onDonate,
}: ProtectedGuessFormProps) {
  const [guessValue, setGuessValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("zelle");
  const [paymentNote, setPaymentNote] = useState("");
  const [selectedCharity, setSelectedCharity] = useState<string>(
    charities[0]?.id || ""
  );
  const [error, setError] = useState("");

  const registrationOpen = isRegistrationOpen(event);
  const canGuess = registrationOpen
    ? canUserGuess(userId, event.id, event, [
        {
          id: "dummy",
          userId,
          eventId: event.id,
          amount: userDonationTotal,
          paymentMethod,
          isPaid: true,
          createdAt: new Date(),
        },
      ])
    : { allowed: false, reason: "Registration is not yet open" };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canGuess.allowed) {
      setError(canGuess.reason || "You cannot submit a guess");
      return;
    }

    if (!guessValue) {
      setError("Please enter a guess value");
      return;
    }

    const value = parseFloat(guessValue);
    if (isNaN(value) || value < 0) {
      setError("Please enter a valid number");
      return;
    }

    onSubmitGuess(value, paymentMethod, paymentNote, selectedCharity);
    setGuessValue("");
    setPaymentNote("");
  };

  if (!registrationOpen) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <p className="text-yellow-800 font-semibold">
          Registration is not yet open for this event
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Check back when registration opens to submit your guess
        </p>
      </div>
    );
  }

  if (!canGuess.allowed) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 space-y-4">
        <div>
          <p className="text-red-800 font-semibold">Unable to Submit Guess</p>
          <p className="text-sm text-red-700 mt-1">{canGuess.reason}</p>
        </div>

        <div className="bg-white rounded p-3 border border-red-100">
          <p className="text-sm font-medium">Your Donation Status:</p>
          <p className="text-sm text-gray-600 mt-1">
            Donated: <span className="font-semibold">${userDonationTotal.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Required: <span className="font-semibold">${event.entryFee.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Remaining: <span className="font-semibold">${Math.max(0, event.entryFee - userDonationTotal).toFixed(2)}</span>
          </p>
        </div>

        {onDonate && (
          <button
            onClick={onDonate}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Make a Donation
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded border">
      <h3 className="text-lg font-semibold">Submit Your Guess</h3>

      <div className="bg-green-50 border border-green-200 rounded p-3">
        <p className="text-green-800 font-semibold">✓ You're eligible to guess!</p>
        <p className="text-sm text-green-700 mt-1">
          You've donated ${userDonationTotal.toFixed(2)} (${event.entryFee.toFixed(2)} required)
        </p>
      </div>

      {error && <div className="text-red-600 bg-red-100 p-2 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium">Your Guess (Orders)</label>
        <input
          type="number"
          value={guessValue}
          onChange={(e) => setGuessValue(e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
          placeholder="Enter your peak orders prediction"
          step="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Charity Beneficiary</label>
        <select
          value={selectedCharity}
          onChange={(e) => setSelectedCharity(e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
        >
          {charities.map((charity) => (
            <option key={charity.id} value={charity.id}>
              {charity.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Payment Method</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="zelle"
              checked={paymentMethod === "zelle"}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            />
            Zelle
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="venmo"
              checked={paymentMethod === "venmo"}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            />
            Venmo
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Payment Note (optional)</label>
        <textarea
          value={paymentNote}
          onChange={(e) => setPaymentNote(e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
          placeholder="e.g., Transaction ID or notes"
          rows={2}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Guess
      </button>
    </form>
  );
}
