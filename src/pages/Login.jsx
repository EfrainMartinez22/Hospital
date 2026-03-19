import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login("ingefrainmart@gmail.com", "Daniela.180");
      nav("/admin", { replace: true });
    } catch (err) {
      setError(err?.message || "Error al iniciar sesión");
    }
  };
  /* const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      nav("/admin", { replace: true });
    } catch (err) {
      setError(err?.message || "Error al iniciar sesión");
    }
  }; */

  return (
    <div className="flex items-center justify-center p-6 py-12 bg-slate-50">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6"
      >
        <h1 className="text-2xl font-semibold text-slate-900">Acceso</h1>
        <p className="text-slate-600 text-sm mt-1">Panel del consultorio</p>

        <label className="block mt-5 text-sm text-slate-700">Email</label>
        <input
          className="mt-2 w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-200"
          placeholder="correo@dominio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
          required
        />

        <label className="block mt-4 text-sm text-slate-700">Contraseña</label>
        <div className="mt-2 flex items-stretch gap-2">
          <input
            className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-200"
            placeholder="Tu contraseña"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm"
          >
            {showPass ? "Ocultar" : "Ver"}
          </button>
        </div>

        {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full bg-teal-600 text-white font-medium rounded-xl p-3 hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}