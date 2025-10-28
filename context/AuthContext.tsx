"use client";

import { createContext, useContext, useState } from "react";
import api from "../lib/api";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post("/kdevfull/auth/login", {
        username,
        password,
      });

      console.log("✅ Token recibido:", res.data);

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err: any) {
      console.error("❌ Error login:", err.response?.data || err.message);
      throw new Error("Credenciales inválidas");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
