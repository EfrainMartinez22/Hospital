import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/layout";
import LayoutAdmin from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Conocenos from "./pages/About";
import Contact from "./pages/Contact";
import AdminAppointments from "./pages/AdminAppointments";

function NoAuth() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600 shadow-sm">
        No autorizado
      </div>
    </div>
  );
}

function AdminPlaceholder({ title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-500">Módulo en construcción.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Páginas públicas */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/no-autorizado" element={<NoAuth />} />
            <Route path="/nosotros" element={<Conocenos />} />
            <Route path="/contactanos" element={<Contact />} />
          </Route>

          {/* Panel admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<LayoutAdmin />}>
              <Route index element={<Admin />} />
              <Route path="citas" element={<AdminAppointments />} />
              <Route
                path="pacientes"
                element={<AdminPlaceholder title="Pacientes" />}
              />
              <Route
                path="galeria"
                element={<AdminPlaceholder title="Galería" />}
              />
              <Route
                path="configuracion"
                element={<AdminPlaceholder title="Configuración" />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}