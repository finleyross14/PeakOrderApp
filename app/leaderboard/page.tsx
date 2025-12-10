"use client";

import { useMemo, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { useData } from "../../components/DataProvider";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { guesses, activeEvent } = useData();
  const [extraDonation, setExtraDonation] = useState<Record<string, string>>({});

  // For MVP we assume a tiny local "user directory" based on demo users
  const userDirectory: Record<string, { name: string; team: string }> = {
    "leader-1": { name: "Alex Leader", team: "Executive Team" },
    "employee-1": { name: "Taylor Employee", team: "Team Phoenix" }
  };

  const guessesWithUser = guesses.map((g) => {
    const info = userDirectory[g.userId] ?? {
      name: "Unknown",
      team: "Unassigned"
    };
    return { ...g, userName: info.name, team: info.team };
  });

  // Team donation leaderboard
  const teamLeaderboard = useMemo(() => {
    const totals: Record<string, number> = {};
    guessesWithUser.forEach((g) => {
      if (!g.isPaid) return; // only count confirmed payments
      totals[g.team] = (totals[g.team] || 0) + g.totalDonation;
    });
    return Object.entries(totals)
      .map(([team, total]) => ({ team, total }))
      .sort((a, b) => b.total - a.total);
  }, [guessesWithUser]);

  // Closest guess standings (if final number set)
  const closestGuess = useMemo(() => {
    if (!activeEvent || activeEvent.finalPeakOrders == null) return null;
    const target = activeEvent.finalPeakOrders;
    if (!target) return null;

    const sorted = [...guessesWithUser].sort((a, b) => {
      const diffA = Math.abs(a.value - target);
      const diffB = Math.abs(b.value - target);
      if (diffA !== diffB) return diffA - diffB;
      if (a.totalDonation !== b.totalDonation) {
        return b.totalDonation - a.totalDonation; // higher donor wins tie
      }
      return a.createdAt.getTime() - b.createdAt.getTime(); // earlier wins final tie
    });

    return sorted[0] ?? null;
  }, [guessesWithUser, activeEvent]);

  const { addDonation } = useData();

  const handleDonateMore = (guessId: string) => {
    const val = Number(extraDonation[guessId]);
    if (!val || val <= 0) {
      alert("Enter a valid donation amount.");
      return;
    }
    addDonation(guessId, val);
    setExtraDonation((prev) => ({ ...prev, [guessId]: "" }));
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-700 text-sm">
          There are two competitions running:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
          <li>
            <span className="font-semibold">Team Donations:</span> team with the
            highest confirmed donations wins a gift card.
          </li>
          <li>
            <span className="font-semibold">Closest Guess:</span> individual
            closest to the final peak orders wins half the prize pot; the other
            half goes to a charity of their choice.
          </li>
        </ul>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-3">Team Donation Leaderboard</h2>
          {teamLeaderboard.length === 0 ? (
            <p className="text-sm text-gray-600">No confirmed donations yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="py-1">Rank</th>
                  <th className="py-1">Team</th>
                  <th className="py-1 text-right">Total Donated</th>
                </tr>
              </thead>
              <tbody>
                {teamLeaderboard.map((row, idx) => (
                  <tr
                    key={row.team}
                    className={idx === 0 ? "bg-red-50" : "hover:bg-gray-50"}
                  >
                    <td className="py-1">{idx + 1}</td>
                    <td className="py-1 font-medium">{row.team}</td>
                    <td className="py-1 text-right font-semibold">
                      ${row.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <h2 className="font-semibold mb-3">Closest Guess (preview)</h2>
          {!activeEvent || activeEvent.finalPeakOrders == null ? (
            <p className="text-sm text-gray-700">
              Leadership hasn&apos;t entered the final peak order number yet.
              Once they do, the closest guess will be highlighted here.
            </p>
          ) : closestGuess ? (
            <div className="text-sm space-y-1">
              <p className="text-xs text-gray-500">If the event ended now:</p>
              <p>
                <span className="font-semibold">{closestGuess.userName}</span>{" "}
                from <span className="font-semibold">{closestGuess.team}</span>{" "}
                is in the lead.
              </p>
              <p>
                Guess:{" "}
                <span className="font-semibold">{closestGuess.value}</span> ·
                Total Donated:{" "}
                <span className="font-semibold">
                  ${closestGuess.totalDonation.toFixed(2)}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-700">
              No eligible guesses yet. Make sure your payment is marked paid.
            </p>
          )}
        </div>
      </section>

      <section className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold mb-3">Your Entry & Extra Donations</h2>
        {user ? (
          <>
            {guessesWithUser.filter((g) => g.userId === user.id).length === 0 ? (
              <p className="text-sm text-gray-600">
                You haven&apos;t submitted a guess yet.{" "}
                <span className="underline">
                  Go to the Event tab to enter.
                </span>
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-gray-500 text-left">
                    <th className="py-1">Guess</th>
                    <th className="py-1">Total Donated</th>
                    <th className="py-1">Paid?</th>
                    <th className="py-1">Donate More</th>
                  </tr>
                </thead>
                <tbody>
                  {guessesWithUser
                    .filter((g) => g.userId === user.id)
                    .map((g) => (
                      <tr key={g.id} className="hover:bg-gray-50">
                        <td className="py-1">{g.value}</td>
                        <td className="py-1">${g.totalDonation.toFixed(2)}</td>
                        <td className="py-1">{g.isPaid ? "Yes" : "Pending"}</td>
                        <td className="py-1">
                          <div className="flex gap-1">
                            <input
                              type="number"
                              className="border rounded px-2 py-1 text-xs w-24"
                              placeholder="Amount"
                              value={extraDonation[g.id] ?? ""}
                              onChange={(e) =>
                                setExtraDonation((prev) => ({
                                  ...prev,
                                  [g.id]: e.target.value
                                }))
                              }
                            />
                            <button
                              className="text-xs px-2 py-1 rounded bg-primaryRed text-white hover:bg-red-700"
                              onClick={() => handleDonateMore(g.id)}
                            >
                              Add
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">
                            Send via Zelle/Venmo and leadership will confirm.
                          </p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-600">
            Log in above to view your entry and donate more.
          </p>
        )}
      </section>
    </div>
  );
}
