"use client";

import { useAuth } from "../../components/AuthProvider";
import { useData } from "../../components/DataProvider";

export default function ProPage() {
  const { user } = useAuth();
  const { activeEvent, historicalData, proAccess, grantPro } = useData();

  if (!activeEvent) {
    return <p>No active event to show Pro insights for.</p>;
  }
  const hasPro =
    !!user &&
    proAccess.some(
      (p) => p.userId === user.id && p.eventId === activeEvent.id
    );

  const average =
    historicalData.reduce((sum, d) => sum + d.peakOrders, 0) /
    historicalData.length;
  const min = Math.min(...historicalData.map((d) => d.peakOrders));
  const max = Math.max(...historicalData.map((d) => d.peakOrders));
  const last = historicalData[historicalData.length - 1];

  const suggestedLow = Math.round(last.peakOrders * 1.05);
  const suggestedHigh = Math.round(last.peakOrders * 1.25);

  return (
    <div className="space-y-6">
      <section className="bg-white border rounded-2xl p-5 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Pro Insights</h1>
        <p className="text-sm text-gray-700 mb-2">
          Unlock historical peak-order data and suggested guess ranges to hone
          in your entry.
        </p>
        <p className="text-xs text-gray-500">
          Pro access is ${activeEvent.proFee} for this event and lasts for the
          duration of the event.
        </p>

        {!user ? (
          <p className="mt-3 text-sm text-gray-700">
            Log in above to unlock Pro.
          </p>
        ) : hasPro ? (
          <p className="mt-3 text-sm text-green-700 font-semibold">
            You have Pro access for this event.
          </p>
        ) : (
          <button
            onClick={grantPro}
            className="mt-3 px-4 py-2 rounded bg-primaryRed text-white text-sm font-semibold hover:bg-red-700"
          >
            I&apos;ve paid ${activeEvent.proFee} – unlock Pro
          </button>
        )}
      </section>

      {hasPro && (
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-sm">
            <h2 className="font-semibold mb-3">
              Historical Peak Orders (Demo Data)
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-gray-500 text-left">
                  <th className="py-1">Year</th>
                  <th className="py-1">Peak Orders</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((d) => (
                  <tr key={d.year}>
                    <td className="py-1">{d.year}</td>
                    <td className="py-1">{d.peakOrders.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border rounded-2xl p-5 text-sm shadow-sm">
            <h2 className="font-semibold mb-3">Quick Stats & Suggested Range</h2>
            <p>Average peak (demo): {Math.round(average).toLocaleString()}</p>
            <p>Min: {min.toLocaleString()}</p>
            <p>Max: {max.toLocaleString()}</p>
            <div className="mt-3 bg-yellow-50 border border-accentYellow rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Suggested range</p>
              <p className="font-semibold text-lg">
                {suggestedLow.toLocaleString()} –{" "}
                {suggestedHigh.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Based on last year’s peak and a projected growth factor.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
