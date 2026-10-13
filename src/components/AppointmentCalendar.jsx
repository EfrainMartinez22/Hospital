
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

const WEEK_DAYS = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function toISODate(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function getDayClass(status, selectable, selected) {
  if (!selectable) {
    return "border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed";
  }

  if (selected) {
    return "border border-slate-900 bg-slate-900 text-white";
  }

  if (status === "green") {
    return "border border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
  }

  if (status === "yellow") {
    return "border border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-200";
  }

  if (status === "red") {
    return "border border-red-200 bg-red-100 text-red-700 hover:bg-red-200";
  }

  return "border border-slate-200 bg-white text-slate-700";
}

export default function AppointmentCalendar({
  value,
  onChange,
  hospitalId,
}) {
  const now = new Date();

  const [viewYear, setViewYear] = useState(
    now.getFullYear()
  );

  const [viewMonth, setViewMonth] = useState(
    now.getMonth() + 1
  );

  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      setAvailability([]);
      setError("");

      if (!hospitalId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const params = new URLSearchParams({
          year: String(viewYear),
          month: String(viewMonth),
          hospital_id: String(hospitalId),
        });

        const data = await apiFetch(
          `/appointments/availability-calendar?${params.toString()}`
        );

        if (!cancelled) {
          setAvailability(
            Array.isArray(data.items) ? data.items : []
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "ERROR CALENDARIO:",
            err
          );

          setAvailability([]);

          setError(
            err.message ||
              "No se pudo cargar la disponibilidad."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [viewYear, viewMonth, hospitalId]);

  const availabilityMap = useMemo(() => {
    const map = new Map();

    for (const item of availability) {
      map.set(item.date, item);
    }

    return map;
  }, [availability]);

  const firstDayOfMonth = new Date(
    viewYear,
    viewMonth - 1,
    1
  );

  const daysInMonth = new Date(
    viewYear,
    viewMonth,
    0
  ).getDate();

  const startWeekday = firstDayOfMonth.getDay();

  const monthLabel = new Date(
    viewYear,
    viewMonth - 1,
    1
  ).toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  function changeMonth(direction) {
    const next = new Date(
      viewYear,
      viewMonth - 1 + direction,
      1
    );

    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth() + 1);
  }

  const cells = [];

  for (let i = 0; i < startWeekday; i++) {
    cells.push(
      <div
        key={`empty-${i}`}
        className="aspect-square rounded-2xl border border-transparent"
      />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = toISODate(
      viewYear,
      viewMonth,
      day
    );

    const item = availabilityMap.get(iso);

    const selectable =
      !loading &&
      !error &&
      Boolean(item?.selectable);

    const status = item?.status || "disabled";

    const remaining =
      Number(item?.remaining_slots) || 0;

    const selected = value === iso;

    cells.push(
      <button
        key={iso}
        type="button"
        disabled={!selectable}
        onClick={() => {
          if (selectable) {
            onChange(iso);
          }
        }}
        title={
          selectable
            ? `${remaining} horarios disponibles`
            : "No disponible"
        }
        className={`aspect-square rounded-2xl p-2 text-left transition ${getDayClass(
          status,
          selectable,
          selected
        )}`}
      >
        <div className="flex h-full flex-col justify-between">
          <span className="text-sm font-semibold">
            {day}
          </span>

          {selectable && (
            <span className="text-[10px] leading-tight opacity-80">
              {remaining} disp.
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
        >
          <ChevronLeft size={18} />
        </button>

        <h4 className="text-sm font-semibold capitalize text-slate-900">
          {monthLabel}
        </h4>

        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="pb-1 text-center text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            {day}
          </div>
        ))}

        {cells}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          Muchas disponibles
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          Pocas disponibles
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          Quedan 1 o 2
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          No disponible
        </div>
      </div>

      {!hospitalId && (
        <p className="mt-3 text-xs text-amber-700">
          Selecciona un hospital para consultar la disponibilidad.
        </p>
      )}

      {loading && (
        <p className="mt-3 text-xs text-slate-500">
          Cargando disponibilidad...
        </p>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
