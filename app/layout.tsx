import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from "../components/AuthProvider";
import { DataProvider } from "../components/DataProvider";
import { NavBar } from "../components/NavBar";

export const metadata = {
  title: "Peak Orders Charity Challenge",
  description: "Guess the peak orders, support charity, and climb the leaderboard."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        <AuthProvider>
          <DataProvider>
            <NavBar />
            <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
