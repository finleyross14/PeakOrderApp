"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { useData } from "../../components/DataProvider";
import { Charity } from "../../lib/types";
import Countdown from "../../components/Countdown";
import ProtectedGuessForm from "../../components/ProtectedGuessForm";
import CreateEventForm from "../../components/CreateEventForm";
import { getUserEventDonationTotal, isRegistrationOpen } from "../../lib/donationVerification";

export default function EventPage() {
  const { user } = useAuth();
  const { activeEvent, charities, donations, addEvent, recordDonation } = useData();
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  if (!user) {
    return <p className="text-red-600 text-lg">Enter your name to view events.</p>;
  }

  if (showCreateEvent) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowCreateEvent(false)}
          className="text-blue-600 hover:underline"
        >
          ← Back to Events
        </button>
        <CreateEventForm
          charities={charities}
          onCreateEvent={(event) => {
            addEvent(event);
            setShowCreateEvent(false);
            alert("Event created and submitted for backend approval!");
          }}
        />
      </div>
    );
  }

  if (!activeEvent) {
    return (
      <div className="space-y-4 bg-white p-6 rounded border">
        <h2 className="text-xl font-semibold">Events</h2>
        <p className="text-gray-600">No active event right now.</p>
        <button
          onClick={() => setShowCreateEvent(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Event
        </button>
      </div>
    );
  }

  const eventCharities: Charity[] = charities.filter((c) =>
    activeEvent.charityIds.includes(c.id)
  );

  const userDonationTotal = getUserEventDonationTotal(user.id, activeEvent.id, donations);
  const registrationIsOpen = isRegistrationOpen(activeEvent);

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <section className="bg-white rounded border p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{activeEvent.name}</h1>
            <p className="text-gray-700 mt-2">{activeEvent.description}</p>
          </div>
          <button
            onClick={() => setShowCreateEvent(true)}
            className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
          >
            + Create Event
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Entry Fee</p>
            <p className="font-semibold text-lg">${activeEvent.entryFee.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Pro Access Fee</p>
            <p className="font-semibold text-lg">${activeEvent.proFee.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Your Donated</p>
            <p className="font-semibold text-lg">${userDonationTotal.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* Countdown to Registration */}
      {!registrationIsOpen && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Registration Opens Soon</h2>
          <Countdown targetDate={activeEvent.registrationOpensAt} />
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Guess Form */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Submit Your Guess</h2>
          <ProtectedGuessForm
            event={activeEvent}
            userId={user.id}
            charities={eventCharities}
            userDonationTotal={userDonationTotal}
            onSubmitGuess={(value, paymentMethod, paymentNote, charityId) => {
              // Record the donation first
              recordDonation(user.id, activeEvent.id, activeEvent.entryFee, paymentMethod, paymentNote);
              alert("Guess submitted! The backend will verify your donation and activate your entry.");
            }}
            onDonate={() => setShowDonationForm(true)}
          />
        </div>

        {/* Info & Donation Section */}
        <div className="space-y-4">
          {/* Event Info */}
          <div className="bg-white rounded border p-4">
            <h3 className="font-semibold mb-2">Event Details</h3>
            <div className="text-sm space-y-1 text-gray-700">
              <p>
                <strong>Registered Charities:</strong>{" "}
                {eventCharities.map((c) => c.name).join(", ")}
              </p>
              <p>
                <strong>Event Window:</strong>{" "}
                {activeEvent.start.toLocaleDateString()} -{" "}
                {activeEvent.end.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Donation Form */}
          {showDonationForm && (
            <div className="bg-green-50 rounded border border-green-200 p-4">
              <h3 className="font-semibold mb-3">Make an Additional Donation</h3>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Amount ($)"
                className="w-full border rounded px-2 py-1 mb-2"
                step="0.01"
              />
              <button
                onClick={() => {
                  if (!donationAmount || parseFloat(donationAmount) <= 0) {
                    alert("Please enter a valid amount");
                    return;
                  }
                  recordDonation(
                    user.id,
                    activeEvent.id,
                    parseFloat(donationAmount),
                    "zelle"
                  );
                  setDonationAmount("");
                  setShowDonationForm(false);
                  alert("Donation recorded! Thank you for your generosity.");
                }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Record Donation
              </button>
              <button
                onClick={() => setShowDonationForm(false)}
                className="w-full mt-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Payment Instructions */}
          <div className="bg-blue-50 rounded border border-blue-200 p-4">
            <h3 className="font-semibold mb-2">Payment Instructions</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <strong>Zelle:</strong> <span className="font-mono">payments@company.com</span>
              </p>
              <p>
                <strong>Venmo:</strong> <span className="font-mono">@CompanyCharity</span>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                (Replace with your actual payment details)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
