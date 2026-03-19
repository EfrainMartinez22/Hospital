import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Users,
  Image as ImageIcon,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Resumen", icon: LayoutDashboard, end: true },
  { to: "/admin/citas", label: "Citas", icon: CalendarDays },
  { to: "/admin/pacientes", label: "Pacientes", icon: Users },
  { to: "/admin/galeria", label: "Galería", icon: ImageIcon },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings },
];

function SidebarLink({ to, label, icon: Icon, end = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-teal-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const roleLabel = useMemo(() => {
    if (user?.role === "doctor") return "Doctor";
    if (user?.role === "admin") return "Administrador";
    return user?.role || "Usuario";
  }, [user]);

  const displayName = user?.full_name || "Administrador";

  function handleLogout() {
    logout();
    nav("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <LayoutDashboard size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Panel administrativo
                </h2>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 px-4 py-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Sesión activa
              </p>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">
                {displayName}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{roleLabel}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <SidebarLink key={item.to} {...item} />
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Hospital Admin
                  </h2>
                  <p className="text-sm text-slate-500">Panel administrativo</p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="border-b border-slate-200 px-4 py-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Sesión activa
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">
                    {displayName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{roleLabel}</p>
                </div>
              </div>

              <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => (
                  <SidebarLink
                    key={item.to}
                    {...item}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </nav>

              <div className="border-t border-slate-200 p-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpen(true)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 lg:hidden"
                >
                  <Menu size={20} />
                </button>

                <div>
                  <p className="text-sm text-slate-500">Bienvenido</p>
                  <h1 className="text-lg font-semibold text-slate-900">
                    {displayName}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
                  <Bell size={18} />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}