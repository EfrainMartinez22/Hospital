import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import doctorImg from "../img/doctor.jpg"; // ✅ ajusta si tu ruta cambia

const LOCATION_CONFIG = {
  Tepic: {
    label: "Tepic, Nayarit",
    hospitales: [
      {
        name: "Puerta de Hierro",
        telefonoWa: "523111910111", // ⚠️ cambia si aplica
        telefonoDisplay: "+52 311 191 0111",
        horario: [
          { dia: "Martes", horas: "3:00 PM – 6:00 PM" },
          { dia: "Jueves", horas: "11:00 AM – 1:30 PM" },
        ],
      },
      {
        name: "San Rafael",
        telefonoWa: "523112222222", // ⚠️ CAMBIA POR EL REAL
        telefonoDisplay: "+52 311 222 2222",
        horario: [{ dia: "Lunes", horas: "1:00 PM – 5:00 PM" }],
      },
    ],
  },
  Colima: {
    label: "Colima, Colima",
    hospitales: [
      {
        name: "Puerta de Hierro",
        telefonoWa: "523121234567", // ⚠️ CAMBIA POR EL REAL
        telefonoDisplay: "+52 312 123 4567",
        horario: [{ dia: "Viernes", horas: "1:00 PM – 3:00 PM" }],
      },
    ],
  },
};

const PROC = [
  { key: "rinoplastia", name: "Rinoplastia", icon: "👃", desc: "Armonía facial y función respiratoria." },
  { key: "blefaroplastia", name: "Blefaroplastia", icon: "👁️", desc: "Mirada más descansada y natural." },
  { key: "lifting-facial", name: "Lifting facial", icon: "✨", desc: "Rejuvenecimiento con resultados sutiles." },
  { key: "mentoplastia", name: "Mentoplastia", icon: "🧩", desc: "Proporción y balance del perfil." },
  { key: "bichectomia", name: "Bichectomía", icon: "💠", desc: "Definición del tercio medio." },
  { key: "rejuvenecimiento-facial", name: "Rejuvenecimiento facial", icon: "🫧", desc: "Mejora global con enfoque clínico." },
];

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-slate-500">{label}</div>

      <div className="mt-2 relative">
        <select
          value={value}
          onChange={onChange}
          className="
            w-full appearance-none
            rounded-xl border border-slate-200
            bg-white px-3.5 py-3 pr-10
            text-[15px] font-medium text-slate-900
            shadow-sm
            outline-none
            transition
            hover:border-slate-300 hover:shadow
            focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15
          "
        >
          {children}
        </select>

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </label>
  );
}

function getHospitalByName(ciudadKey, hospitalName) {
  const list = LOCATION_CONFIG[ciudadKey].hospitales;
  return list.find((h) => h.name === hospitalName) || list[0];
}

function HorarioChips({ items }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={`${it.dia}-${it.horas}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
        >
          <span className="text-slate-500">🕒</span>
          <span className="text-slate-900">{it.dia}</span>
          <span className="text-slate-400">·</span>
          <span>{it.horas}</span>
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [ciudad, setCiudad] = useState("Tepic");
  const [hospitalName, setHospitalName] = useState(
    LOCATION_CONFIG.Tepic.hospitales[0].name
  );

  const onChangeCiudad = (e) => {
    const nextCity = e.target.value;
    setCiudad(nextCity);
    setHospitalName(LOCATION_CONFIG[nextCity].hospitales[0].name);
  };

  const cfgCity = LOCATION_CONFIG[ciudad];
  const hospital = useMemo(
    () => getHospitalByName(ciudad, hospitalName),
    [ciudad, hospitalName]
  );

  const whatsappLink = useMemo(() => {
    const text = `Hola, estoy interesado en una valoración en ${cfgCity.label} (${hospital.name}). ¿Me pueden dar información?`;
    return `https://wa.me/${hospital.telefonoWa}?text=${encodeURIComponent(text)}`;
  }, [cfgCity.label, hospital.name, hospital.telefonoWa]);

  return (
    <div className="bg-white">
      {/* HERO PREMIUM */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-[0.8] scale-[1.02]"
          style={{ backgroundImage: `url(${doctorImg})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
        <div className="absolute inset-0 [background:radial-gradient(80%_80%_at_30%_30%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.75)_100%)]" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />

        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="max-w-xl"
            >
              <p className="text-teal-300 font-semibold text-sm tracking-wide uppercase">
                Cirugía Plástica Facial
              </p>

              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white">
                Resultados naturales,
                <span className="block text-white/80">seguros y proporcionales.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-white/80">
                Enfoque clínico y estético. Valoración completa y acompañamiento
                durante todo el proceso.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-teal-600 text-white font-medium hover:bg-teal-700 transition shadow-lg shadow-teal-900/30"
                >
                  Agendar valoración
                </a>

                <Link
                  to="/galeria"
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-white/25 bg-white/10 backdrop-blur-md text-white font-medium hover:bg-white/15 transition"
                >
                  Ver resultados
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-white/50" />
          Desliza para ver más
        </div>
      </section>

      {/* Procedimientos */}
      <section id="procedimientos" className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Procedimientos
            </h2>
            <p className="mt-1 text-slate-600">
              Opciones más solicitadas en cirugía facial.
            </p>
          </div>

          <Link
            to="/galeria"
            className="text-sm text-teal-700 hover:text-teal-800 transition"
          >
            Ver resultados →
          </Link>
        </div>

        {/* ✅ Cards premium clicables -> /galeria?proc=... */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PROC.map((p) => (
            <motion.div
              key={p.key}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
              }}
            >
              <Link
                to={`/galeria?proc=${encodeURIComponent(p.key)}`}
                className="
                  group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white
                  p-6 shadow-sm transition-all duration-300
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60
                  hover:border-slate-300
                  focus:outline-none focus:ring-4 focus:ring-teal-500/20
                "
                aria-label={`Ver resultados de ${p.name}`}
                title={`Ver resultados de ${p.name}`}
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-slate-900/5" />
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="
                      h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50
                      flex items-center justify-center text-xl
                      transition
                      group-hover:border-teal-200 group-hover:bg-teal-50
                    "
                  >
                    {p.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-lg leading-snug">
                      {p.name}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Ver resultados</span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 opacity-80 group-hover:opacity-100 transition">
                    Abrir galería
                    <span className="transition group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-slate-900">Contacto</h2>
          <p className="mt-2 text-slate-600">
            Agenda tu valoración o solicita información por WhatsApp.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">
                  Sede de atención
                </div>
                <div className="text-xs text-slate-500">Selecciona tu ubicación</div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectField label="Ubicación" value={ciudad} onChange={onChangeCiudad}>
                  <option value="Tepic">Tepic</option>
                  <option value="Colima">Colima</option>
                </SelectField>

                <SelectField
                  label="Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                >
                  {cfgCity.hospitales.map((h) => (
                    <option key={h.name} value={h.name}>
                      {h.name}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className="mt-3 text-sm text-slate-600">
                <span className="font-medium text-slate-900">{cfgCity.label}</span>
                <span className="text-slate-400"> · </span>
                <span className="text-slate-700">{hospital.name}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center transition hover:shadow-md hover:border-slate-300">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                WhatsApp
              </div>
              <div className="mt-3 text-2xl font-semibold text-slate-900 tracking-tight">
                {hospital.telefonoDisplay}
              </div>
              {/* detalle decorativo sutil */}
              <div className="mt-4 h-1 w-10 rounded-full bg-teal-500/70" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs text-slate-500">Horario</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Horarios de atención
              </div>
              <HorarioChips items={hospital.horario} />
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

            <Link
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 border border-slate-200 bg-white text-slate-900 font-medium hover:bg-slate-50 transition shadow-sm"
              to="/galeria"
            >
              Ver galería
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}