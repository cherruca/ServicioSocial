import createError from 'http-errors';
import { findAdministratorByEmail } from '../services/administrator.service.js';

/**
 * requireAdmin middleware
 * Ensures the authenticated user corresponds to an Administrator record.
 */
const requireAdmin = async (req, res, next) => {
  try {
    const email = req.user?.email;
    if (!email) return next(createError(401, 'Unauthorized'));
    // First try the explicit Administrator collection
    const admin = await findAdministratorByEmail(email);
    if (admin) {
      req.admin = admin;
      return next();
    }

    // Fallback: check User and Student services for a role flag
    try {
      const { findUserByEmail } = await import('../services/user.service.js');
      const user = await findUserByEmail(email);
      const userRole = user?.role;
      if (user && typeof userRole === 'string' && userRole.toLowerCase().includes('admin')) {
        req.admin = user;
        return next();
      }
    } catch (e) {
      // ignore missing user service or errors here; we'll try student next
    }

    try {
      const { findStudentByEmail } = await import('../services/student.service.js');
      const student = await findStudentByEmail(email);
      const studentRole = student?.role;
      if (student && typeof studentRole === 'string' && studentRole.toLowerCase().includes('admin')) {
        req.admin = student;
        return next();
      }
    } catch (e) {
      // ignore
    }

    return next(createError(403, 'Forbidden - admin only'));
  } catch (err) {
    next(err);
  }
};

export { requireAdmin };
