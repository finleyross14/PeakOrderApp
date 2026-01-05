"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

export function NavBar() {
  const { user, joinAsGuest, logout } = useAuth();
  const [name, setName] = useState("");

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primaryRed" />
          <span className="font-semibold text-lg">Peak Orders Charity Challenge</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-primaryRed text-sm">
            Home
          </Link>
          <Link href="/events" className="hover:text-primaryRed text-sm">
            Event
          </Link>
          <Link href="/leaderboard" className="hover:text-primaryRed text-sm">
            Leaderboard
          </Link>
          <Link href="/pro" className="hover:text-primaryRed text-sm">
            Pro
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{user.name}</span>
              <button
                onClick={logout}
                className="text-xs border px-2 py-1 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="text-sm border rounded px-2 py-1"
              />
              <button
                onClick={() => {
                  if (name.trim()) {
                    joinAsGuest(name.trim());
                    setName("");
                  }
                }}
                className="text-xs border px-2 py-1 rounded bg-primaryRed text-white hover:bg-red-700"
              >
                Join as Guest
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
