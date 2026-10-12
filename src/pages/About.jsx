import { Link } from "react-router-dom";
import perfil from "../img/perfil.jpg";

export default function About() {
    const doctor = {
        nombre: "Dr. José Miguel Plascencia Ramirez",
        especialidad: "Otorrinolaringología",
        subespecialidad: "Especialización en Cirugía de Cuello y Cara",
        ciudad: "Tepic, Nayarit",
        descripcion:
            "Especialista en Otorrinolaringología con formación en cirugía de cuello y cara. Brinda atención enfocada en la valoración precisa, diagnóstico claro y seguimiento médico personalizado.",
        cedulaProfesional: "12345678",
        cedulaEspecialidad: "87654321",
        enfoque: [
            "Consulta de valoración especializada",
            "Seguimiento postquirúrgico",
            "Control y tratamiento de padecimientos de oído, nariz y garganta",
        ],
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <div className="max-w-6xl mx-auto px-6 py-16">

                {/* Encabezado */}
                <div className="max-w-3xl">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Conócenos
                    </h1>
                </div>

                {/* Información principal */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Información del Doctor */}
                    <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                        <div className="flex items-start gap-6">

                            {/* Foto placeholder */}
                            <div className="h-24 w-24 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-medium">
                                <img
                                    src={perfil}
                                    alt="Dr. José Miguel Plascencia Ramírez"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold">
                                    {doctor.nombre}
                                </h2>
                                <p className="text-slate-600 mt-1">
                                    {doctor.especialidad}
                                </p>
                                <p className="text-slate-500 text-sm">
                                    {doctor.subespecialidad}
                                </p>
                                <p className="text-slate-500 text-sm mt-1">
                                    {doctor.ciudad}
                                </p>
                            </div>
                        </div>

                        <p className="mt-6 text-slate-600 leading-relaxed">
                            {doctor.descripcion}
                        </p>

                        {/* Enfoque */}
                        <div className="mt-8">
                            <h3 className="font-semibold text-slate-800">
                                Enfoque de consulta
                            </h3>

                            <ul className="mt-4 space-y-3 text-slate-600">
                                {doctor.enfoque.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="mt-2 h-2 w-2 rounded-full bg-slate-400" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Cédulas y datos profesionales */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <h3 className="font-semibold text-slate-800">
                            Datos Profesionales
                        </h3>

                        <div className="mt-6 space-y-6">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Cédula Profesional
                                </p>
                                <p className="text-lg font-semibold tracking-wide">
                                    {doctor.cedulaProfesional}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Cédula de Especialidad
                                </p>
                                <p className="text-lg font-semibold tracking-wide">
                                    {doctor.cedulaEspecialidad}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-200">
                                <p className="text-sm text-slate-500">
                                    Tipo de atención
                                </p>
                                <p className="text-slate-700 mt-1">
                                    Consultas enfocadas principalmente en valoración y seguimiento médico especializado.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-14 bg-slate-900 text-white rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-semibold">
                            Agenda tu consulta especializada
                        </h3>
                        <p className="text-slate-300 mt-2">
                            Programa tu valoración o seguimiento de manera rápida y segura.
                        </p>
                    </div>

                    <Link
                        to="/Contactanos"
                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
                    >
                        Agendar cita
                    </Link>
                </div>
            </div>
        </div>
    );
}