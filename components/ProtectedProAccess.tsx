"use client";

import React from "react";
import { Event } from "../lib/types";
import { canUserAccessPro, getUserEventDonationTotal } from "../lib/donationVerification";

interface ProtectedProAccessProps {
  event: Event;
  userId: string;
  userDonationTotal: number;
  onGrantPro?: () => void;
  onDonate?: () => void;
  children?: React.ReactNode; // Pro content to display if user has access
}

export default function ProtectedProAccess({
  event,
  userId,
  userDonationTotal,
  onGrantPro,
  onDonate,
  children,
}: ProtectedProAccessProps) {
  const dummyDonation = {
    id: "dummy",
    userId,
    eventId: event.id,
    amount: userDonationTotal,
    paymentMethod: "zelle" as const,
    isPaid: true,
    createdAt: new Date(),
  };

  const proCheck = canUserAccessPro(userId, event.id, event, [dummyDonation]);
  const requiredForPro = event.entryFee + event.proFee;

  if (proCheck.allowed) {
    return (
      <div className="bg-white rounded border">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b">
          <p className="text-purple-900 font-semibold">✓ Pro Access Unlocked</p>
          <p className="text-sm text-purple-700 mt-1">
            You have access to advanced analytics and insights
          </p>
        </div>
        <div className="p-4">{children}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded border space-y-4 p-4">
      <div className="bg-purple-50 border border-purple-200 rounded p-4">
        <p className="text-purple-900 font-semibold">Pro Access Required</p>
        <p className="text-sm text-purple-700 mt-1">{proCheck.reason}</p>
      </div>

      <div className="bg-gray-50 rounded p-3 border">
        <p className="text-sm font-medium text-gray-700">Donation Progress:</p>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current:</span>
            <span className="font-semibold">${userDonationTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Required:</span>
            <span className="font-semibold">${requiredForPro.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Additional needed:</span>
            <span className="font-semibold text-purple-600">
              ${Math.max(0, requiredForPro - userDonationTotal).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(100, (userDonationTotal / requiredForPro) * 100)}%`,
            }}
          ></div>
        </div>
      </div>

      {onDonate && (
        <button
          onClick={onDonate}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
        >
          Make an Additional Donation
        </button>
      )}

      {onGrantPro && (
        <button
          onClick={onGrantPro}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-medium"
        >
          Unlock Pro Access
        </button>
      )}
    </div>
  );
}
