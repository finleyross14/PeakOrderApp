"use client";

import { useAuth } from "../../components/AuthProvider";
import { useData } from "../../components/DataProvider";

export default function AdminPage() {
  const { user } = useAuth();
  const { activeEvent, guesses, setFinalPeakOrders, markGuessPaid } = useData();

  if (!user || user.role !== "leader") {
    return <p>You must be logged in as Leadership to view this page.</p>;
  }

  if (!activeEvent) {
    return <p>No active event configured.</p>;
  }

  const handleSetFinal = () => {
    const raw = prompt("Enter final peak orders number for this event:");
    if (!raw) return;
    const value = Number(raw);
    if (!value || value <= 0) {
      alert("Invalid number.");
      return;
    }
    setFinalPeakOrders(value);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border rounded-2xl p-5 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-sm text-gray-700 mb-2">
          Manage the current event, confirm payments, and enter the final peak order number.
        </p>
        <div className="text-sm text-gray-700">
          <p>
            <span className="font-semibold">Active event:</span>{" "}
            {activeEvent.name}
          </p>
          <p className="text-xs text-gray-500">
            Final peak orders:{" "}
            {activeEvent.finalPeakOrders != null
              ? activeEvent.finalPeakOrders.toLocaleString()
              : "Not set"}
          </p>
        </div>
        <button
          onClick={handleSetFinal}
          className="mt-3 px-4 py-2 rounded bg-primaryRed text-white text-sm font-semibold hover:bg-red-700"
        >
          Set / Update Final Peak Orders
        </button>
      </section>

      <section className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold mb-3 text-sm">Entries & Payment Status</h2>
        {guesses.length === 0 ? (
          <p className="text-sm text-gray-600">No entries yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-gray-500 text-left">
                <th className="py-1">User ID</th>
                <th className="py-1">Guess</th>
                <th className="py-1">Total Donated</th>
                <th className="py-1">Method</th>
                <th className="py-1">Note</th>
                <th className="py-1">Paid</th>
              </tr>
            </thead>
            <tbody>
              {guesses.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="py-1">{g.userId}</td>
                  <td className="py-1">{g.value}</td>
                  <td className="py-1">${g.totalDonation.toFixed(2)}</td>
                  <td className="py-1">{g.paymentMethod}</td>
                  <td className="py-1 text-xs">{g.paymentNote}</td>
                  <td className="py-1">
                    <button
                      onClick={() => markGuessPaid(g.id, !g.isPaid)}
                      className={`px-2 py-1 rounded text-xs ${
                        g.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {g.isPaid ? "Paid" : "Mark Paid"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
