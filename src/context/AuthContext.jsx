import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

// Quita barras finales para evitar URLs como //auth/login.
const API = (import.meta.env.VITE_API_URL || "http://localhost:4000")
  .trim()
  .replace(/\/+$/, "");

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
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(safeParseUser);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(email).trim().toLowerCase(),
          password,
        }),
      });

      const raw = await response.text();
      let data;

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          `El servidor no devolvió JSON (HTTP ${response.status}). Revisa VITE_API_URL y la ruta /auth/login.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || `Error al iniciar sesión (HTTP ${response.status})`
        );
      }

      // Algunas APIs devuelven solo el token, sin el objeto user.
      const accessToken = data?.token || data?.accessToken || data?.access_token;
      if (typeof accessToken !== "string" || !accessToken.trim()) {
        throw new Error("El backend respondió correctamente, pero no devolvió un token.");
      }

      let currentUser = data?.user || data?.usuario || null;

      // Si el login no incluye el usuario, intenta obtenerlo del endpoint /users/me.
      // Si ese endpoint no existe, se conserva la sesión con el token.
      if (!currentUser) {
        try {
          const meResponse = await fetch(`${API}/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (meResponse.ok) {
            const meData = await meResponse.json();
            currentUser = meData?.user || meData?.usuario || meData || null;
          }
        } catch {
          // /users/me es opcional para esta corrección.
        }
      }

      localStorage.setItem("token", accessToken);
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("user");
      }

      setToken(accessToken);
      setUser(currentUser);
      return { ...data, token: accessToken, user: currentUser };
    } catch (error) {
      if (error instanceof TypeError && /fetch|network/i.test(error.message)) {
        throw new Error(
          "No se pudo conectar con Railway desde el navegador. Comprueba VITE_API_URL y la configuración de CORS."
        );
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, login, logout, isAuthed: Boolean(token) }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
}
