const API = (import.meta.env.VITE_API_URL || "")
  .replace(/\/+$/, "");

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  if (!API) {
    throw new Error(
      "No está configurada la URL del backend (VITE_API_URL)"
    );
  }

  const url = `${API}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const text = await res.text();

    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        `El backend devolvió una respuesta no válida (HTTP ${res.status})`
      );
    }

    if (!res.ok) {
      throw new Error(
        data?.error ||
        data?.message ||
        `Error HTTP ${res.status}`
      );
    }

    return data;

  } catch (error) {
    console.error("Error al consultar API:", {
      url,
      message: error.message,
    });

    throw error;
  }
}