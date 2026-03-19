import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CITIES = {
    Tepic: {
        label: "Tepic, Nayarit",
        hospitales: [
            {
                name: "Puerta de Hierro Tepic",
                telefonoDisplay: "+52 311 191 0111",
                telefono: "523111910111",
                horario: ["Martes 3:00 PM – 6:00 PM", "Jueves 11:00 AM – 1:30 PM"],
                direccion: "Av. de la Salud 221, Ciudad Industrial, 63175 Tepic, Nay.",
            },
            {
                name: "San Rafael",
                telefonoDisplay: "+52 311 222 3344",
                telefono: "523112223344",
                horario: ["Lun–Vie 8:00–16:00"],
                direccion: "Av del Valle 91, Cd del Valle, 63157 Tepic, Nay.",
            },
        ],
    },
    Colima: {
        label: "Colima, Colima",
        hospitales: [
            {
                name: "Puerta de Hierro Colima",
                telefonoDisplay: "+52 312 987 6543",
                telefono: "523129876543",
                horario: ["Lun–Vie 10:00–19:00", "Dom 10:00–13:00"],
                direccion: "Calle Ignacio Sandoval 1699, Girasoles, 28018 Colima, Col.",
            },
        ],
    },
};

/** ✅ Select con estilo tipo StatCard (para evitar redundancia) */
function SelectCard({
    label,
    value,
    onChange,
    children,
    helper,
    disabled = false,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">{label}</div>
                {helper ? <div className="text-xs text-slate-400">{helper}</div> : null}
            </div>

            <div className="mt-3 relative">
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={[
                        "w-full appearance-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold shadow-sm outline-none transition",
                        "focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10",
                        disabled
                            ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                            : "bg-slate-50 text-slate-900 hover:bg-slate-100",
                    ].join(" ")}
                >
                    {children}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M7 10l5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function HorarioChips({ items = [] }) {
    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {items.map((t) => (
                <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                >
                    {t}
                </span>
            ))}
        </div>
    );
}

export default function ContactoView() {
    // ✅ Estado controlado para ciudad
    const [ciudad, setCiudad] = useState("Tepic");

    // ✅ Estado controlado para hospital (por índice)
    const [hospitalIndex, setHospitalIndex] = useState(0);

    // ✅ cfgCity depende de ciudad
    const cfgCity = useMemo(() => CITIES[ciudad], [ciudad]);

    // ✅ hospital depende de cfgCity + hospitalIndex
    const hospital = useMemo(() => {
        const list = cfgCity?.hospitales || [];
        const safeIndex = Math.min(Math.max(hospitalIndex, 0), list.length - 1);
        return list[safeIndex] || list[0];
    }, [cfgCity, hospitalIndex]);

    // ✅ al cambiar ciudad, reseteamos hospitalIndex a 0
    const onChangeCiudad = (e) => {
        const nextCity = e.target.value;
        setCiudad(nextCity);
        setHospitalIndex(0);
    };

    // ✅ al cambiar hospital, actualiza índice
    const onChangeHospital = (e) => {
        const idx = Number(e.target.value);
        setHospitalIndex(Number.isFinite(idx) ? idx : 0);
    };

    const whatsappLink = useMemo(() => {
        if (!hospital) return "#";
        const msg = `Hola, me gustaría agendar una valoración. ¿Me pueden dar información?`;
        return `https://wa.me/${hospital.telefono}?text=${encodeURIComponent(msg)}`;
    });

    const hospitalDisabled = cfgCity.hospitales.length === 1;

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <main>
                <section className="border-b border-slate-200">
                    <div className="mx-auto max-w-7xl px-4 py-14">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div>
                                {/* Header minimal premium */}
                                <div className="mt-2 max-w-2xl">
                                    <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
                                        Contacto y sedes de atención
                                    </h1>

                                    <p className="mt-4 text-base leading-relaxed text-slate-600">
                                        Consulta la información del hospital correspondiente y comunícate directamente por WhatsApp.
                                    </p>

                                    {/* detalle sutil */}
                                    <div className="mt-6 h-px w-24 bg-slate-200" />
                                </div>

                                {/* ✅ Selects estilo StatCard (y quitamos StatCards redundantes) */}
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                                    <SelectCard
                                        label="Ubicación"
                                        value={ciudad}
                                        onChange={onChangeCiudad}
                                        helper={cfgCity.label}
                                    >
                                        <option value="Tepic">Tepic</option>
                                        <option value="Colima">Colima</option>
                                    </SelectCard>

                                    <SelectCard
                                        label="Hospital"
                                        value={hospitalIndex}
                                        onChange={onChangeHospital}
                                        disabled={hospitalDisabled}
                                        helper={hospitalDisabled ? "Única opción en esta ciudad" : "Selecciona hospital"}
                                    >
                                        {cfgCity.hospitales.map((h, idx) => (
                                            <option key={h.name} value={idx}>
                                                {h.name}
                                            </option>
                                        ))}
                                    </SelectCard>
                                </div>
                            </div>

                            {/* panel visual minimal */}
                            <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-xs font-medium text-slate-500">
                                            Vista previa
                                        </div>
                                        <div className="mt-1 text-lg font-semibold">
                                            Hospital seleccionado
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-3">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                        <div className="text-xs text-slate-500">Dirección</div>
                                        <div className="mt-2 text-sm font-medium text-slate-900">
                                            {hospital?.direccion || "-"}
                                        </div>

                                        <div className="mt-3 h-px w-full bg-slate-200" />
                                        <div className="mt-3 text-xs text-slate-500">Horarios</div>
                                        <HorarioChips items={hospital?.horario || []} />
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-slate-500">WhatsApp</div>
                                            <div className="mt-1 text-base font-semibold text-slate-900">
                                                {hospital?.telefonoDisplay || "-"}
                                            </div>
                                        </div>
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition"
                                        >
                                            Enviar
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección contacto */}
                        <section id="contacto" className="mt-14">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-semibold">Contacto</div>
                                        <div className="mt-1 text-sm text-slate-600">
                                            Agenda tu valoración o solicita información por WhatsApp.
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                        <div className="text-xs text-slate-500">Sede</div>
                                        <div className="mt-2 text-sm font-semibold">{cfgCity.label}</div>

                                        <div className="mt-3 text-xs text-slate-500">Hospital</div>
                                        <div className="mt-1 text-sm font-semibold">{hospital?.name}</div>

                                        <div className="mt-4 text-xs text-slate-500">Dirección</div>
                                        <div className="mt-1 text-sm">{hospital?.direccion}</div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center flex flex-col items-center justify-center">
                                        <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                                            WhatsApp
                                        </div>
                                        <div className="mt-3 text-2xl font-semibold text-slate-900 tracking-tight">
                                            {hospital?.telefonoDisplay}
                                        </div>
                                        <div className="mt-4 h-1 w-10 rounded-full bg-teal-500/70" />
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                        <div className="text-xs text-slate-500">Horarios</div>
                                        <div className="mt-2 text-sm font-semibold text-slate-900">
                                            Horarios de atención
                                        </div>
                                        <HorarioChips items={hospital?.horario || []} />
                                        <div className="mt-3 text-xs text-slate-500">
                                            Atención con cita previa.
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <a
                                        className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-teal-600 text-white font-medium hover:bg-teal-700 transition shadow-sm"
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Enviar WhatsApp
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
            </main>
        </div>
    );
}