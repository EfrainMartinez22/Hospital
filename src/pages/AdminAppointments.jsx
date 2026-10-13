import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Clock3,
  Pencil,
  X,
  Calendar,
  Plus,
} from "lucide-react";
import { apiFetch } from "../lib/api";
import AppointmentCalendar from "../components/AppointmentCalendar";

function typeLabel(type) {
  if (type === 1) return "Primera vez";
  if (type === 2) return "Subsecuente";
  return "Sin tipo";
}

function CreateAppointmentModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    phone: "",
    date: "",
    time: "",
    appointment_type: 1,
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "date" || field === "appointment_type") {
        next.time = "";
      }

      return next;
    });
  }

  async function loadAvailableSlots(date, appointmentType) {
    if (!date || !appointmentType) {
      setAvailableSlots([]);
      return;
    }

    try {
      setSlotsLoading(true);
      setError("");

      const params = new URLSearchParams({
        date,
        appointment_type: String(appointmentType),
      });

      const data = await apiFetch(
        `/appointments/available-slots?${params.toString()}`
      );
      setAvailableSlots(data.items || []);
    } catch (err) {
      setAvailableSlots([]);
      setError(err.message || "No se pudieron cargar los horarios disponibles");
    } finally {
      setSlotsLoading(false);
    }
  }

  useEffect(() => {
    loadAvailableSlots(form.date, form.appointment_type);
  }, [form.date, form.appointment_type]);

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.date) {
      setError("Selecciona una fecha disponible.");
      return;
    }

    if (!form.time) {
      setError("Selecciona una hora disponible.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiFetch("/appointments", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : null,
          appointment_type: Number(form.appointment_type),
        }),
      });

      onCreated(data.item);
      onClose();
    } catch (err) {
      setError(err.message || "No se pudo crear la cita");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Nueva cita</h3>
            <p className="mt-1 text-sm text-slate-500">
              Selecciona un día disponible y luego una hora válida según la agenda del doctor.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <AppointmentCalendar
              key={form.hospital_id}
              hospitalId={form.hospital_id}
              value={form.date}
              onChange={(date) => updateField("date", date)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <label className="block text-sm text-slate-700">Nombre</label>
              <input
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Nombre"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Apellido</label>
              <input
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Apellido"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Edad</label>
              <input
                type="number"
                min="0"
                value={form.age}
                onChange={(e) => updateField("age", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Edad"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Teléfono</label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Teléfono"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Fecha seleccionada</label>
              <input
                value={form.date}
                readOnly
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-600 outline-none"
                placeholder="Selecciona un día en el calendario"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Tipo de cita</label>
              <select
                value={form.appointment_type}
                onChange={(e) => updateField("appointment_type", Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value={1}>Primera vez (15 min)</option>
                <option value={2}>Subsecuente (7 min)</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm text-slate-700">Hora disponible</label>
              <select
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-teal-200"
                required
                disabled={!form.date || slotsLoading || availableSlots.length === 0}
              >
                <option value="">
                  {!form.date
                    ? "Selecciona primero un día"
                    : slotsLoading
                      ? "Cargando horarios..."
                      : availableSlots.length === 0
                        ? "No hay horarios disponibles"
                        : "Selecciona una hora"}
                </option>

                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-slate-500">
                Solo se muestran horarios válidos dentro de la agenda configurada.
              </p>
            </div>

            {error ? (
              <div className="sm:col-span-2 lg:col-span-1 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="sm:col-span-2 lg:col-span-1 flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Crear cita"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditAppointmentModal({ item, onClose, onSaved }) {
  const [date, setDate] = useState(item?.date || "");
  const [time, setTime] = useState(item?.time || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const data = await apiFetch(`/appointments/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ date, time }),
      });

      onSaved(data.item);
      onClose();
    } catch (err) {
      setError(err.message || "No se pudo actualizar la cita");
    } finally {
      setLoading(false);
    }
  }

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Editar cita
            </h3>
            <p className="mt-1 text-sm text-slate-500">{item.full_name}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm text-slate-700">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-teal-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700">Hora</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-teal-200"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAppointments() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  async function loadAppointments(search = "", date = "") {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("q", search.trim().toLowerCase());
      }

      if (date) {
        params.set("date", date);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch(`/appointments${queryString}`);

      setItems(data.items || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredCount = useMemo(() => items.length, [items]);

  function handleSearch(e) {
    e.preventDefault();

    if (selectedDate && selectedDate < today) {
      setError("No puedes consultar citas de días anteriores.");
      return;
    }

    loadAppointments(query, selectedDate);
  }

  function handleSaved(updatedItem) {
    setItems((prev) =>
      prev.map((it) => (it.id === updatedItem.id ? updatedItem : it))
    );
  }

  function handleCreated(newItem) {
    setItems((prev) =>
      [...prev, newItem].sort((a, b) => {
        const dateA = `${a.date} ${a.time}`;
        const dateB = `${b.date} ${b.time}`;
        return dateA.localeCompare(dateB);
      })
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <CalendarDays size={26} />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-600">
                Gestión de agenda
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Citas
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                Busca citas por paciente o teléfono, filtra por fecha y registra
                consultas dentro de los horarios configurados del doctor.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Plus size={18} />
            Nueva cita
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 xl:flex-row xl:items-center"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, apellido o teléfono"
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-teal-200"
            />
          </div>

          <div className="relative w-full xl:w-64">
            <Calendar
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => {
                setError("");
                setSelectedDate(e.target.value);
              }}
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-teal-200"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700"
          >
            Filtrar
          </button>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedDate("");
              setError("");
              loadAppointments("", "");
            }}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Limpiar
          </button>
        </form>

        {error ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <p className="mt-3 text-sm text-slate-500">
          {filteredCount} cita{filteredCount === 1 ? "" : "s"} encontrada
          {filteredCount === 1 ? "" : "s"}.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        {loading ? (
          <div className="text-slate-600">Cargando citas...</div>
        ) : items.length === 0 ? (
          <div className="text-slate-500">No hay citas registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-3 pr-4 font-medium">Paciente</th>
                  <th className="py-3 pr-4 font-medium">Edad</th>
                  <th className="py-3 pr-4 font-medium">Teléfono</th>
                  <th className="py-3 pr-4 font-medium">Fecha</th>
                  <th className="py-3 pr-4 font-medium">Hora</th>
                  <th className="py-3 pr-4 font-medium">Tipo</th>
                  <th className="py-3 pr-0 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-4 pr-4 text-slate-800">{item.full_name}</td>
                    <td className="py-4 pr-4 text-slate-600">{item.age ?? "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">{item.phone || "-"}</td>
                    <td className="py-4 pr-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-slate-400" />
                        {item.date}
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock3 size={16} className="text-slate-400" />
                        {item.time}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${item.appointment_type === 1
                            ? "bg-teal-100 text-teal-700"
                            : item.appointment_type === 2
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {typeLabel(item.appointment_type)}
                      </span>
                    </td>
                    <td className="py-4 pr-0">
                      <button
                        onClick={() => setEditing(item)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {creating ? (
        <CreateAppointmentModal
          onClose={() => setCreating(false)}
          onCreated={handleCreated}
        />
      ) : null}

      {editing ? (
        <EditAppointmentModal
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      ) : null}
    </div>
  );
}