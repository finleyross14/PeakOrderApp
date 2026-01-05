"use client";

import React, { useState } from "react";
import { Event } from "../lib/types";

interface CreateEventFormProps {
  charities: { id: string; name: string }[];
  onCreateEvent: (event: Omit<Event, "id">) => void;
}

export default function CreateEventForm({ charities, onCreateEvent }: CreateEventFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [proFee, setProFee] = useState("");
  const [registrationOpensAt, setRegistrationOpensAt] = useState("");
  const [selectedCharities, setSelectedCharities] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleCharityToggle = (charityId: string) => {
    setSelectedCharities((prev) =>
      prev.includes(charityId) ? prev.filter((id) => id !== charityId) : [...prev, charityId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !startDate || !endDate || !entryFee || !registrationOpensAt) {
      setError("Please fill in all required fields");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const regOpens = new Date(registrationOpensAt);

    if (start >= end) {
      setError("Event start must be before event end");
      return;
    }

    if (regOpens >= start) {
      setError("Registration must open before event starts");
      return;
    }

    // Events are created as pending approval by backend
    const newEvent: Omit<Event, "id"> = {
      name,
      description,
      start,
      end,
      entryFee: parseFloat(entryFee),
      proFee: parseFloat(proFee) || 0,
      registrationOpensAt: regOpens,
      charityIds: selectedCharities,
      isActive: false, // will be activated after backend approval
      createdBy: "pending-approval",
      createdAt: new Date(),
    };

    onCreateEvent(newEvent);

    // Reset form
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setEntryFee("");
    setProFee("");
    setRegistrationOpensAt("");
    setSelectedCharities([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded border">
      <h2 className="text-xl font-semibold">Create New Event</h2>

      <p className="text-sm text-gray-600">Events you create will be submitted for backend approval before going live.</p>

      {error && <div className="text-red-600 bg-red-100 p-2 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium">Event Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
          placeholder="e.g., Q4 2024 Peak Orders Challenge"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
          placeholder="Optional event description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Registration Opens *</label>
          <input
            type="datetime-local"
            value={registrationOpensAt}
            onChange={(e) => setRegistrationOpensAt(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Event Starts *</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Event Ends *</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Entry Fee ($) *</label>
          <input
            type="number"
            step="0.01"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Pro Access Fee ($)</label>
          <input
            type="number"
            step="0.01"
            value={proFee}
            onChange={(e) => setProFee(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Select Charities</label>
        <div className="space-y-2 mt-2">
          {charities.map((charity) => (
            <label key={charity.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCharities.includes(charity.id)}
                onChange={() => handleCharityToggle(charity.id)}
                className="rounded"
              />
              {charity.name}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Event
      </button>
    </form>
  );
}
