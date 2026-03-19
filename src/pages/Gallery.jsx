import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const PROC_LABELS = {
  rinoplastia: "Rinoplastia",
  blefaroplastia: "Blefaroplastia",
  "lifting-facial": "Lifting facial",
  mentoplastia: "Mentoplastia",
  bichectomia: "Bichectomía",
  "rejuvenecimiento-facial": "Rejuvenecimiento facial",
};

// Normaliza strings
function norm(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Obtiene la key del procedimiento desde el item
function getProcKey(it) {
  const candidate =
    it?.procedure_key ??
    it?.procedure ??
    it?.category ??
    it?.tag ??
    it?.tipo ??
    it?.proc;

  const v = norm(candidate);

  if (v) return v;

  const t = norm(it?.title);
  if (t.includes("rino")) return "rinoplastia";
  if (t.includes("blef")) return "blefaroplastia";
  if (t.includes("lifting")) return "lifting-facial";
  if (t.includes("mento")) return "mentoplastia";
  if (t.includes("bich")) return "bichectomia";
  if (t.includes("reju")) return "rejuvenecimiento-facial";

  return "";
}

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search } = useLocation();

  const proc = useMemo(() => {
    const p = new URLSearchParams(search).get("proc");
    return p ? norm(p) : "";
  }, [search]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    const url = proc
      ? `${API}/gallery?proc=${encodeURIComponent(proc)}`
      : `${API}/gallery`;

    fetch(url)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          throw new Error(data?.error || "Error al cargar la galería");
        }
        return data;
      })
      .then((data) => {
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error(error);
        if (!alive) return;
        setItems([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [proc]);

  const procLabel = PROC_LABELS[proc] || (proc ? proc : "");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                Galería
              </h1>
              <p className="mt-2 text-slate-500">
                Resultados organizados por procedimiento.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {proc && (
                <>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                    Filtrado por:{" "}
                    <span className="font-semibold text-slate-900">
                      {procLabel}
                    </span>
                  </span>

                  <Link
                    to="/galeria"
                    className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium text-teal-700 hover:text-teal-800 transition"
                    title="Quitar filtro"
                  >
                    Quitar filtro
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 pt-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-60 w-full bg-slate-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-4/5 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
            {proc
              ? `Aún no hay imágenes para ${procLabel}.`
              : "Aún no hay imágenes en la galería."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it) => {
              const key = getProcKey(it);
              const label = PROC_LABELS[key] || key || "";

              return (
                <div
                  key={it.id}
                  className="
                    group relative rounded-2xl overflow-hidden
                    border border-slate-200 bg-white shadow-sm
                    transition hover:border-slate-300 hover:shadow-md
                  "
                >
                  <div className="relative">
                    <img
                      src={it.image_url}
                      alt={it.title || "Foto de galería"}
                      className="w-full h-60 object-cover transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-90" />

                    {label && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-full border border-white/60 bg-white/85 backdrop-blur px-3 py-1 text-xs font-medium text-slate-800">
                          {label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {it.title && (
                      <div className="font-semibold text-slate-900">
                        {it.title}
                      </div>
                    )}

                    {it.description && (
                      <div className="text-slate-500 text-sm mt-1">
                        {it.description}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {it.created_at
                          ? new Date(it.created_at).toLocaleDateString("es-MX")
                          : "Ver detalles"}
                      </span>

                      <span className="text-sm font-medium text-teal-700 opacity-80 group-hover:opacity-100 transition">
                        Abrir →
                      </span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-teal-500/10 group-hover:ring-4 transition" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}