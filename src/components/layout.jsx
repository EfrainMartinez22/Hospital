import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import evoLogo from "../img/evoweb.png";
import { useEffect, useState } from "react";

export default function Layout() {
  const { token, user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Bloquea scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const navClass = ({ isActive }) =>
    `
      relative px-3 py-2 text-sm font-medium transition
      ${isActive ? "text-white" : "text-white/90 hover:text-white"}
      after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-[2px]
      after:rounded-full after:transition after:duration-300
      ${isActive ? "after:bg-white/90" : "after:bg-transparent hover:after:bg-white/40"}
    `;

  const closeMobile = () => setMobileOpen(false);

  const MobileLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={closeMobile}
      className="rounded-xl px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition"
    >
      {children}
    </Link>
  );

  const MobileAnchor = ({ href, children }) => (
    <a
      href={href}
      onClick={closeMobile}
      className="rounded-xl px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition"
    >
      {children}
    </a>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header
        className={[
          "sticky top-0 z-50 backdrop-blur-md transition-all duration-300",
          scrolled ? "bg-teal-600/95 shadow-md" : "bg-teal-500/90",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link to="/" onClick={closeMobile} className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <span className="text-teal-700 font-bold">MP</span>
            </div>

            <div className="min-w-0 leading-tight">
              <div className="text-white font-semibold tracking-wide truncate">
                Miguel Plascencia
              </div>
              <div className="text-white/90 text-[11px] sm:text-xs truncate">
                Cirugía Plástica · Estética · Reconstructiva
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center">
            <NavLink to="/" className={navClass}>
              Inicio
            </NavLink>
            <NavLink to="/galeria" className={navClass}>
              Resultados
            </NavLink>
            <NavLink to="/nosotros" className={navClass}>
              Conocenos
            </NavLink>
            <NavLink to="/Contactanos" className={navClass}>
              Contactanos
            </NavLink>
            <NavLink to="/login" className={navClass}>
              Acceso
            </NavLink>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 hover:bg-white/15 transition"
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          className={[
            "md:hidden overflow-hidden transition-[max-height,opacity] duration-300",
            mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className="px-4 pb-4">
            <div className="rounded-2xl border border-white/10 bg-black/15 backdrop-blur-md p-3">
              <div className="grid gap-1">
                <MobileLink to="/">Inicio</MobileLink>
                <MobileLink to="/galeria">Resultados</MobileLink>
                <MobileAnchor href="#procedimientos">Procedimientos</MobileAnchor>
                <MobileLink href="/">Conocenos</MobileLink>
                <MobileAnchor href="#contacto">Contacto</MobileAnchor>
                <MobileLink to="/login">Acceso</MobileLink>
              </div>

              <div className="mt-3 h-px bg-white/10" />

              <div className="mt-3 flex gap-2">
                <a
                  href="#contacto"
                  onClick={closeMobile}
                  className="flex-1 inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-white text-teal-700 font-semibold text-sm hover:bg-white/90 transition"
                >
                  Agendar
                </a>
                <Link
                  to="/galeria"
                  onClick={closeMobile}
                  className="flex-1 inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition"
                >
                  Galería
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      {mobileOpen && (
        <button
          aria-label="Cerrar menú"
          onClick={closeMobile}
          className="fixed inset-0 z-40 md:hidden bg-black/30"
        />
      )}

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10">

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} Clínica Facial. Todos los derechos reservados.
            </div>

            <a
              href="https://tusitio.com" // ⚠️ cambia por tu link real
              target="_blank"
              rel="noreferrer"
              className="
                group inline-flex items-center gap-2
                rounded-full border border-slate-200 bg-slate-50
                px-3 py-1.5
                text-xs text-slate-500
                hover:text-slate-900 hover:border-slate-300 hover:bg-white
                transition
              "
              aria-label="Desarrollado por EvoWeb"
              title="Desarrollado por EvoWeb"
            >
              <span className="text-slate-500 group-hover:text-slate-700 transition">
                Desarrollado por
              </span>

              <img
                src={evoLogo}
                alt="EvoWeb"
                className="h-4 w-auto opacity-70 group-hover:opacity-100 transition"
              />

              <span className="font-semibold tracking-wide text-slate-700 group-hover:text-slate-900 transition">
                EvoWeb
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}