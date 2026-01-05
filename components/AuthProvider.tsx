"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  joinAsGuest: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const joinAsGuest = (name: string) => {
    const id = `guest-${new Date().getTime()}`;
    setUser({ id, name });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, joinAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
