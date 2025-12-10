"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Role, User } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  loginAs: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const demoUsers: Record<Role, User> = {
  leader: {
    id: "leader-1",
    name: "Alex Leader",
    role: "leader",
    team: "Executive Team"
  },
  employee: {
    id: "employee-1",
    name: "Taylor Employee",
    role: "employee",
    team: "Team Phoenix"
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loginAs = (role: Role) => {
    setUser(demoUsers[role]);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginAs, logout }}>
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
