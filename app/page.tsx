"use client";

import Link from "next/link";
import { useData } from "../components/DataProvider";

export default function HomePage() {
  const { activeEvent } = useData();

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Guess the Peak Orders.
          <span className="text-primaryRed"> Support charity.</span>
        </h1>
        <p className="text-gray-700 mb-4">
          Enter your guess for our company&apos;s highest single-day internet
          orders for the event, donate to climb the leaderboard, and
          compete for prizes while giving back.
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
          <li>$10 to enter and lock in your guess.</li>
          <li>Donate more to climb the leaderboard.</li>
          <li>Closest guess wins half the prize pot; the other half goes to a charity of their choice.</li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/events"
            className="px-4 py-2 rounded bg-primaryRed text-white font-semibold hover:bg-red-700"
          >
            Join the Event
          </Link>
          <Link
            href="/leaderboard"
            className="px-4 py-2 rounded border border-primaryRed text-primaryRed font-semibold hover:bg-red-50"
          >
            View Leaderboard
          </Link>
        </div>
      </section>
      <section className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-3">Current Event Snapshot</h2>
        {activeEvent ? (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-lg">{activeEvent.name}</p>
            <p className="text-gray-700">{activeEvent.description}</p>
            <p className="text-gray-600">
              Entry Fee: <span className="font-semibold">${activeEvent.entryFee}</span> ·
              Pro Insights: <span className="font-semibold">${activeEvent.proFee}</span>
            </p>
            <p className="text-xs text-gray-500">
              Event window: {activeEvent.start.toDateString()} –{" "}
              {activeEvent.end.toDateString()}
            </p>
          </div>
        ) : (
          <p>No active event right now. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
