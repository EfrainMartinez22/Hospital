import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

export default function adminRoutes(pool) {
  const r = Router();

  r.get("/dashboard", requireAuth, async (req, res) => {
    try {
      // Citas de hoy
      const appointmentsTodayQ = await pool.query(`
        SELECT COUNT(*)::int AS count
        FROM appointments
        WHERE date = CURRENT_DATE
      `);

      // Citas pendientes
      const pendingAppointmentsQ = await pool.query(`
        SELECT COUNT(*)::int AS count
        FROM appointments
        WHERE status = 'pendiente'
      `);

      // Total pacientes
      const patientsTotalQ = await pool.query(`
        SELECT COUNT(*)::int AS count
        FROM patients
      `);

      // Total galería
      const galleryTotalQ = await pool.query(`
        SELECT COUNT(*)::int AS count
        FROM gallery
      `);

      // Próximas citas
      const upcomingAppointmentsQ = await pool.query(`
        SELECT
          a.id,
          COALESCE(p.full_name, 'Paciente') AS patient_name,
          TO_CHAR(a.date, 'YYYY-MM-DD') AS date,
          a.time::text AS time,
          a.status
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        WHERE a.date >= CURRENT_DATE
        ORDER BY a.date ASC, a.time ASC
        LIMIT 10
      `);

      return res.json({
        stats: {
          appointments_today: appointmentsTodayQ.rows[0]?.count || 0,
          pending_appointments: pendingAppointmentsQ.rows[0]?.count || 0,
          patients_total: patientsTotalQ.rows[0]?.count || 0,
          gallery_total: galleryTotalQ.rows[0]?.count || 0,
        },
        upcoming_appointments: upcomingAppointmentsQ.rows,
      });
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);
      return res.status(500).json({ error: "No se pudo cargar el dashboard" });
    }
  });

  return r;
}