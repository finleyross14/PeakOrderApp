"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function NavBar() {
  const { user, loginAs, logout } = useAuth();

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primaryRed" />
          <span className="font-semibold text-lg">
            Peak Orders Charity Challenge
          </span>
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
          <Link href="/charities" className="hover:text-primaryRed text-sm">
            Charities
          </Link>
          {user?.role === "leader" && (
            <Link href="/admin" className="hover:text-primaryRed text-sm">
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 text-right">
                {user.name}
                <br />
                <span className="uppercase text-[10px] text-primaryRed font-semibold">
                  {user.role === "leader" ? "Leadership" : "Employee"}
                </span>
              </span>
              <button
                onClick={logout}
                className="text-xs border px-2 py-1 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => loginAs("employee")}
                className="text-xs border px-2 py-1 rounded hover:bg-red-50"
              >
                Login as Employee
              </button>
              <button
                onClick={() => loginAs("leader")}
                className="text-xs border px-2 py-1 rounded bg-primaryRed text-white hover:bg-red-700"
              >
                Login as Leadership
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
