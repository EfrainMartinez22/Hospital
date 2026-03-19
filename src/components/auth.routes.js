import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default function authRoutes(pool) {
    const r = Router();

    r.post("/login", async (req, res) => {
        const { email, password } = req.body;

        const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        const user = rows[0];
        if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
        });
    });

    return r;
}