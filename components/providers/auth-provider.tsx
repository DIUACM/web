"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { StoredSession } from "@/lib/auth/types";
import { clearSession, loadSession, saveSession } from "@/lib/auth/storage";
import { login as apiLogin, logout as apiLogout } from "@/lib/api/services/auth";

type AuthContextType = {
  session: StoredSession | null;
  loading: boolean;
  login: (args: { identifier: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (updater: (u: StoredSession["user"]) => StoredSession["user"]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(loadSession());
    setLoading(false);
  }, []);

  const login = useCallback(async ({ identifier, password }: { identifier: string; password: string }) => {
    const res = await apiLogin({ identifier, password, device_name: "web" });
    const value: StoredSession = { token: res.token, user: res.user };
    setSession(value);
    saveSession(value);
  }, []);

  const logout = useCallback(async () => {
    const token = session?.token;
    try {
      if (token) await apiLogout(token);
    } catch {
      // ignore network/logical errors during logout
    }
    setSession(null);
    clearSession();
  }, [session?.token]);

  const setUser = useCallback((updater: (u: StoredSession["user"]) => StoredSession["user"]) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user: updater(prev.user) };
      saveSession(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ session, loading, login, logout, setUser }),
    [session, loading, login, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
