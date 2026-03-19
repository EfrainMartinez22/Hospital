import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold text-slate-900">
        {value ?? 0}
      </h3>
      {description ? (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/admin/dashboard");

        if (!mounted) return;

        setStats(data.stats || {});
        setUpcomingAppointments(data.upcoming_appointments || []);
      } catch (err) {
        console.error("DASHBOARD ERROR:", err);
        if (mounted) {
          setError(err.message || "No se pudo cargar el dashboard");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="text-slate-600">Cargando dashboard...</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-600">
          Panel administrativo
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Resumen general
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          Supervisa rápidamente la actividad del consultorio y consulta la agenda próxima.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard
          title="Citas hoy"
          value={stats?.appointments_today}
          description="Consultas registradas para hoy"
        />
        <StatCard
          title="Próximas citas"
          value={stats?.upcoming_total}
          description="Citas futuras programadas"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Próximas citas</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-3 pr-4 font-medium">Paciente</th>
                <th className="py-3 pr-4 font-medium">Fecha</th>
                <th className="py-3 pr-4 font-medium">Hora</th>
                <th className="py-3 pr-4 font-medium">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500">
                    No hay próximas citas
                  </td>
                </tr>
              ) : (
                upcomingAppointments.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-4 pr-4 text-slate-800">
                      {item.patient_name}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{item.date}</td>
                    <td className="py-4 pr-4 text-slate-600">{item.time}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === "confirmada"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "pendiente"
                              ? "bg-amber-100 text-amber-700"
                              : item.status === "cancelada"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}