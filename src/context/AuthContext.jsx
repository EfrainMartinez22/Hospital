import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function safeParseUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => safeParseUser());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const emailNorm = String(email).trim().toLowerCase();

      console.log("API URL:", API);
      console.log("LOGIN BODY:", { email: emailNorm, password });

      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNorm, password }),
      });

      const data = await r.json().catch(() => ({}));
      console.log("LOGIN RESPONSE:", r.status, data);

      if (!r.ok) {
        throw new Error(data?.error || data?.message || "Credenciales inválidas");
      }

      if (!data?.token || !data?.user) {
        throw new Error("Respuesta inválida del servidor");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      isAuthed: !!token,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
};