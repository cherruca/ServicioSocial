import { attachUserFromGoogleToken } from '../middleware/auth.middleware.js';
import { findUserByEmail, saveUser } from '../services/user.service.js';
import { findStudentByEmail, saveStudent } from '../services/student.service.js';

// Controller to handle login with Google ID token.
// If a persistent user does not exist, create one with sensible defaults.
export const login = async (req, res, next) => {
  //console.log('[auth.login] incoming request', { path: req.path, method: req.method });
  // log short auth header / body token for tracing (do not log full token in production)
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (authHeader) {
      //const short = typeof authHeader === 'string' ? `${authHeader.slice(0, 20)}...${authHeader.slice(-10)}` : 'n/a';
      //console.log('[auth.login] Authorization header:', short);
    } else if (req.body && req.body.token) {
      const t = req.body.token;
      //const short = typeof t === 'string' ? `${t.slice(0, 20)}...${t.slice(-10)}` : 'n/a';
      //console.log('[auth.login] token in body:', short);
    }
  } catch (e) {
    console.warn('[auth.login] failed to read auth header for logging');
  }

  // If middleware wasn't run yet, try attaching the user here.
  if (typeof req.user === 'undefined') {
    try {
      await attachUserFromGoogleToken(req, res, () => {});
    } catch (err) {
      //console.error('[auth.login] attachUserFromGoogleToken threw', err && err.stack ? err.stack : err);
      return next(err);
    }
  }

  if (!req.user) {
    //console.log('[auth.login] no user attached after token verification');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Try to find a persistent user by email.
    /*console.log('[auth.login] verified payload:', {
      sub: req.user.sub,
      email: req.user.email,
      name: req.user.name,
    });*/

    // Decide whether to create a Student or a User. For UCA emails we'll create Student records.
    const email = req.user.email || '';
    if (email.endsWith('@uca.edu.sv')) {
      const existingStudent = await findStudentByEmail(email);
      console.log('[auth.login] existing student search result:', existingStudent ? `found id=${existingStudent._id}` : 'not found');
      if (existingStudent) {
        return res.json({ user: existingStudent, created: false, type: 'student' });
      }

      const payload = req.user || {};
      const carnet = (payload.email || '').split('@')[0] || payload.sub || '';
      const newStudentObj = {
        carnet: carnet,
        name: payload.name || payload.email || 'Estudiante',
        hours: 0,
        picture: payload.picture || '',
        email: payload.email || '',
        careers: [],
      };
      //console.log('[auth.login] creating new student with:', newStudentObj);
      const createdStudent = await saveStudent(newStudentObj);
      //console.log('[auth.login] student created id=', createdStudent?._id);
      return res.status(201).json({ user: createdStudent, created: true, type: 'student' });
    }

    // Fallback: create a generic User record
    const existing = await findUserByEmail(email);
    //console.log('[auth.login] existing user search result:', existing ? `found id=${existing._id}` : 'not found');
    if (existing) {
      return res.json({ user: existing, created: false, type: 'user' });
    }

    const payload = req.user || {};
    const newUserObj = {
      carnet: payload.sub || '',
      name: payload.name || payload.email || 'User',
      email: payload.email || '',
      role: 'student',
      picture: payload.picture || '',
      careers: [],
    };

    //console.log('[auth.login] creating new user with:', newUserObj);
    const created = await saveUser(newUserObj);
    //console.log('[auth.login] user created id=', created?._id);
    return res.status(201).json({ user: created, created: true, type: 'user' });
  } catch (error) {
    //console.error('[auth.login] error during login flow:', error && error.stack ? error.stack : error);
    return next(error);
  }
};

export default { login };
