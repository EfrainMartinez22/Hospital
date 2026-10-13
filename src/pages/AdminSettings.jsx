
import { useEffect, useState } from "react";
import {
  Settings,
  Clock3,
  Building2,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const DAYS = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sábado" },
  { id: 0, name: "Domingo" },
];

function defaultSchedule() {
  return Object.fromEntries(
    DAYS.map(({ id }) => [
      id,
      { enabled: false, start: "09:00", end: "14:00" },
    ])
  );
}

function normalizeSchedule(rows = []) {
  const result = defaultSchedule();

  for (const row of rows) {
    const weekday = Number(row.weekday);

    if (weekday >= 0 && weekday <= 6) {
      result[weekday] = {
        enabled: Boolean(row.active),
        start: String(row.start_time || "09:00").slice(0, 5),
        end: String(row.end_time || "14:00").slice(0, 5),
      };
    }
  }

  return result;
}

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Error HTTP ${response.status}`
    );
  }

  return data;
}

export default function AdminSettings() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [schedulesByHospital, setSchedulesByHospital] = useState({});
  const [firstTimeMinutes, setFirstTimeMinutes] = useState(15);
  const [followUpMinutes, setFollowUpMinutes] = useState(7);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSettings() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/settings");

      const hospitalList = data.hospitals || [];
      const allSchedules = data.schedules || [];
      const types = data.appointment_types || [];

      const grouped = {};

      for (const hospital of hospitalList) {
        grouped[hospital.id] = normalizeSchedule(
          allSchedules.filter(
            (row) =>
              Number(row.hospital_id) === Number(hospital.id)
          )
        );
      }

      setHospitals(hospitalList);
      setSchedulesByHospital(grouped);

      setSelectedHospital((previous) =>
        hospitalList.some(
          (h) => String(h.id) === String(previous)
        )
          ? previous
          : String(hospitalList[0]?.id || "")
      );

      const first = types.find((t) => Number(t.id) === 1);
      const follow = types.find((t) => Number(t.id) === 2);

      setFirstTimeMinutes(Number(first?.duration_minutes ?? 15));
      setFollowUpMinutes(Number(follow?.duration_minutes ?? 7));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const currentSchedule =
    schedulesByHospital[selectedHospital] || defaultSchedule();

  function updateDay(weekday, field, value) {
    setSchedulesByHospital((previous) => ({
      ...previous,
      [selectedHospital]: {
        ...(previous[selectedHospital] || defaultSchedule()),
        [weekday]: {
          ...(
            previous[selectedHospital]?.[weekday] || {
              enabled: false,
              start: "09:00",
              end: "14:00",
            }
          ),
          [field]: value,
        },
      },
    }));

    setSuccess("");
  }

  async function saveSettings() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const first = Number(firstTimeMinutes);
      const follow = Number(followUpMinutes);

      if (
        !Number.isInteger(first) ||
        !Number.isInteger(follow) ||
        first < 1 ||
        follow < 1
      ) {
        throw new Error(
          "Las duraciones deben ser números enteros mayores a cero."
        );
      }

      const schedules = DAYS.filter(
        ({ id }) => currentSchedule[id]?.enabled
      ).map(({ id }) => ({
        weekday: id,
        start_time: currentSchedule[id].start,
        end_time: currentSchedule[id].end,
        active: true,
      }));

      for (const row of schedules) {
        if (row.start_time >= row.end_time) {
          throw new Error(
            "La hora de inicio debe ser menor que la hora de fin."
          );
        }
      }

      // Guardar horarios del hospital seleccionado.
      await apiRequest(
        `/settings/hospitals/${selectedHospital}/schedules`,
        {
          method: "PUT",
          body: JSON.stringify({ schedules }),
        }
      );

      // Las duraciones se muestran pero no se envían todavía:
      // requieren una ruta backend que actualice appointment_types
      // y que appointments.routes.js consulte esas duraciones.
      setSuccess(
        "Horarios guardados correctamente. Las duraciones aún requieren habilitar su guardado en el backend."
      );

      await loadSettings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

  if (loading && hospitals.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <RefreshCw className="h-7 w-7 animate-spin text-slate-400" />
        <span className="ml-3 text-slate-600">
          Cargando configuración...
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <div>
        <div className="flex items-center gap-3">
          <Settings className="h-7 w-7 text-slate-700" />
          <h1 className="text-2xl font-bold text-slate-900">
            Configuración
          </h1>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Administra las duraciones de citas y los horarios
          de atención de cada hospital.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Clock3 size={20} className="text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">
            Duración de las citas
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Primera vez (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="240"
              value={firstTimeMinutes}
              onChange={(e) =>
                setFirstTimeMinutes(e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subsecuente (minutos)
            </label>
            <input
              type="number"
              min="1"
              max="240"
              value={followUpMinutes}
              onChange={(e) =>
                setFollowUpMinutes(e.target.value)
              }
              className={inputClass}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-amber-700">
          Las duraciones se consultan desde Aiven. Para
          guardar cambios necesitamos actualizar también
          el backend de citas.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Building2 size={20} className="text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">
            Hospital
          </h2>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Selecciona una sede
        </label>

        <select
          className={inputClass}
          value={selectedHospital}
          onChange={(e) =>
            setSelectedHospital(e.target.value)
          }
        >
          {hospitals.map((hospital) => (
            <option key={hospital.id} value={hospital.id}>
              {hospital.name} — {hospital.city}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <h2 className="mb-5 text-lg font-semibold text-slate-900">
          Horarios de atención
        </h2>

        <div className="space-y-3">
          {DAYS.map(({ id, name }) => {
            const row = currentSchedule[id];

            return (
              <div
                key={id}
                className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[130px_1fr_1fr]"
              >
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(row.enabled)}
                    onChange={(e) =>
                      updateDay(
                        id,
                        "enabled",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 accent-slate-900"
                  />
                  {name}
                </label>

                <div>
                  <label className="mb-1 block text-xs text-slate-500">
                    Inicio
                  </label>
                  <input
                    type="time"
                    disabled={!row.enabled}
                    value={row.start}
                    onChange={(e) =>
                      updateDay(id, "start", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-500">
                    Fin
                  </label>
                  <input
                    type="time"
                    disabled={!row.enabled}
                    value={row.end}
                    onChange={(e) =>
                      updateDay(id, "end", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveSettings}
          disabled={saving || !selectedHospital}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}
