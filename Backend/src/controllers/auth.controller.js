/**
 * Auth Controller
 *
 * Responsible for authentication flows. The `login` controller verifies
 * a Google ID token (via the `attachUserFromGoogleToken` middleware) and
 * ensures a persistent identity exists for the application (creates a
 * Student for UCA emails or a User otherwise).
 *
 * Exported functions:
 * - login(req, res, next)
 */

import { attachUserFromGoogleToken } from "../middleware/auth.middleware.js";
import { findUserByEmail, saveUser } from "../services/user.service.js";
import {
  findStudentByEmail,
  saveStudent,
} from "../services/student.service.js";


// Controller to handle login with Google ID token.
// If a persistent user does not exist, create one with sensible defaults.
export const login = async (req, res, next) => {
  console.log("[auth.login] ===== START =====");
  console.log("[auth.login] method:", req.method);
  console.log("[auth.login] path:", req.path);
  console.log("[auth.login] req.user exists:", !!req.user);

  // If middleware wasn't run yet, try attaching the user here.
  if (typeof req.user === "undefined") {
    try {
      await attachUserFromGoogleToken(req, res, () => {});
    } catch (err) {
      //console.error('[auth.login] attachUserFromGoogleToken threw', err && err.stack ? err.stack : err);
      return next(err);
    }
  }

  if (!req.user) {
    //console.log('[auth.login] no user attached after token verification');
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Try to find a persistent user by email.
    /*console.log('[auth.login] verified payload:', {
      sub: req.user.sub,
      email: req.user.email,
      name: req.user.name,
    });*/

    // Decide whether to create a Student or a User.
    // If a persistent `User` already exists with this email, prefer it (this allows admin users
    // to use UCA emails without being shadowed by Student records).
    const email = req.user.email || "";

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      // Return the existing User (could be 'administrator' or other roles)
      const userRole = existingUser.role || "student";
      const normalizedRole =
        typeof userRole === "string" && userRole.toLowerCase().includes("admin")
          ? "administrator"
          : userRole;
      return res.json({
        user: existingUser,
        created: false,
        type: "user",
        role: normalizedRole,
      });
    }

    // For UCA emails we'll fall back to Student records if no User exists.
    if (email.endsWith("@uca.edu.sv")) {
      const existingStudent = await findStudentByEmail(email);
      console.log(
        "[auth.login] existing student search result:",
        existingStudent ? `found id=${existingStudent._id}` : "not found"
      );
      if (existingStudent) {
        // Normalize role: if student has role='admin', return 'administrator' for frontend consistency
        const studentRole = existingStudent.role || "student";
        const normalizedRole =
          typeof studentRole === "string" &&
          studentRole.toLowerCase().includes("admin")
            ? "administrator"
            : studentRole;
        console.log(
          `[auth.login] returning existing student role=${studentRole} -> normalized=${normalizedRole}`
        );
        return res.json({
          user: existingStudent,
          created: false,
          type: "student",
          role: normalizedRole,
        });
      }

      const payload = req.user || {};
      const carnet = (payload.email || "").split("@")[0] || payload.sub || "";
      const newStudentObj = {
        carnet: carnet,
        name: payload.name || payload.email || "Estudiante",
        hours: 0,
        picture: payload.picture || "",
        email: payload.email || "",
        careers: [],
        role: "student",
      };
      //console.log('[auth.login] creating new student with:', newStudentObj);
      const createdStudent = await saveStudent(newStudentObj);
      //console.log('[auth.login] student created id=', createdStudent?._id);
      return res
        .status(201)
        .json({
          user: createdStudent,
          created: true,
          type: "student",
          role: "student",
        });
    }

    // Fallback: create a generic User record
    const existing = await findUserByEmail(email);
    //console.log('[auth.login] existing user search result:', existing ? `found id=${existing._id}` : 'not found');
    if (existing) {
      const userRole = existing.role || "student";
      const normalizedRole =
        typeof userRole === "string" && userRole.toLowerCase().includes("admin")
          ? "administrator"
          : userRole;
      return res.json({
        user: existingStudent,
        created: false,
        type: "student",
        role: normalizedRole,
      });
    }

    const payload = req.user || {};
    const newUserObj = {
      carnet: payload.sub || "",
      name: payload.name || payload.email || "User",
      email: payload.email || "",
      role: "student",
      picture: payload.picture || "",
      careers: [],
    };

    //console.log('[auth.login] creating new user with:', newUserObj);
    const created = await saveUser(newUserObj);
    //console.log('[auth.login] user created id=', created?._id);
    return res
      .status(201)
      .json({ user: created, created: true, type: "user", role: "student" });
  } catch (error) {
    //console.error('[auth.login] error during login flow:', error && error.stack ? error.stack : error);
    return next(error);
  }
};

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Verify Google ID token and create or return application identity
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 */

export default { login };
