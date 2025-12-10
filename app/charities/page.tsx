"use client";

import { useData } from "../../components/DataProvider";

export default function CharitiesPage() {
  const { charities } = useData();

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-2xl font-bold mb-2">Charities</h1>
        <p className="text-sm text-gray-700">
          These are the organizations we support through the Peak Orders Charity Challenge.
          Participants&apos; entry fees and donations contribute to these causes.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {charities.map((c) => (
          <div
            key={c.id}
            className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-lg mb-1">{c.name}</h2>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                {c.category}
              </p>
              <p className="text-sm text-gray-700 mb-3">{c.description}</p>
            </div>
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primaryRed hover:underline"
            >
              Visit website →
            </a>
          </div>
        ))}
      </section>
    </div>
  );
}
