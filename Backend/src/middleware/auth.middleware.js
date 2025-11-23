import { OAuth2Client } from 'google-auth-library';

// Verify Google ID tokens server-side using google-auth-library.
// Requires `GOOGLE_CLIENT_ID` in environment variables.

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const extractToken = (req) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || req.headers['x-access-token'] || req.headers['token'];

  let token = null;
  if (authHeader) {
    token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  }

  if (!token && req.body && req.body.token) {
    token = req.body.token;
  }

  return token;
};

// Attach verified Google token payload to req.user when present and valid.
export const attachUserFromGoogleToken = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    // Debug: show partial token and configured client id
    try {
      //const short = typeof token === 'string' ? `${token.slice(0, 10)}...${token.slice(-10)}` : 'n/a';
      //console.log(`[auth] verifying token ${short} against GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID}`);
    } catch (e) {
      // ignore logging errors
    }

    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    req.user = {
      raw: payload,
      sub: payload.sub,
      email: payload.email || null,
      name: payload.name || null,
      picture: payload.picture || null,
    };
    return next();
  } catch (err) {
    // Invalid token: log the error (for debugging), set user to null and continue.
    try {
      //console.error('[auth] token verification failed:', err && err.message ? err.message : err);
    } catch (e) {}
    req.user = null;
    return next();
  }
};

// Middleware to enforce authentication: returns 401 if there's no valid user attached.
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};

export default attachUserFromGoogleToken;
