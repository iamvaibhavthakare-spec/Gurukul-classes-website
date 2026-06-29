import bcrypt from "bcryptjs";
import { z } from "zod";
import { signAdminToken } from "../middleware/auth.js";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(4),
});

export async function loginAdmin(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    const pool = req.app.locals.pool;
    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE email = ? AND status = 'active' LIMIT 1",
      [parsed.data.email.toLowerCase()],
    );

    const admin = rows[0];
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(parsed.data.password, admin.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signAdminToken(admin);
    await pool.query("UPDATE admins SET last_login_at = NOW() WHERE id = ?", [admin.id]);

    return res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminProfile(req, res) {
  return res.json({
    admin: {
      id: req.admin.sub,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
}
