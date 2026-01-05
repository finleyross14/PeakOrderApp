"use client";

// Admin UI intentionally removed. All admin actions are performed in the backend.
export default function AdminPage() {
  return (
    <div className="p-6 bg-white border rounded">
      <h1 className="text-xl font-semibold">Admin UI Removed</h1>
      <p className="text-sm text-gray-600">Admin functions (confirming payments, setting final peak orders, etc.) are now handled via backend tools. If you need to perform admin actions, please use the backend interface.</p>
    </div>
  );
}
