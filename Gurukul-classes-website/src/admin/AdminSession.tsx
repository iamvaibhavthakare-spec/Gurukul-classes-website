import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { adminFetchJson, loginAdmin } from "./api";
import {
  clearAdminToken,
  getAdminToken,
  getStoredAdminProfile,
  setAdminToken,
  setStoredAdminProfile,
} from "./auth";
import type { AdminProfile } from "./types";

interface AdminSessionValue {
  admin: AdminProfile | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  reload: () => Promise<void>;
}

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(getStoredAdminProfile());
  const [ready, setReady] = useState(false);

  async function reload() {
    const token = getAdminToken();
    if (!token) {
      setAdmin(null);
      setReady(true);
      return;
    }

    try {
      const response = await adminFetchJson<{ admin: AdminProfile }>("/api/admin/me");
      setAdmin(response.admin);
      setStoredAdminProfile(response.admin);
    } catch {
      clearAdminToken();
      setAdmin(null);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  async function login(email: string, password: string) {
    const response = await loginAdmin(email, password);
    setAdminToken(response.token);
    setStoredAdminProfile(response.admin);
    setAdmin(response.admin);
    setReady(true);
  }

  function logout() {
    clearAdminToken();
    setAdmin(null);
  }

  return (
    <AdminSessionContext.Provider value={{ admin, ready, login, logout, reload }}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (!context) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }
  return context;
}
