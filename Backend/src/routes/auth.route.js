import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { attachUserFromGoogleToken } from '../middleware/auth.middleware.js';

const authRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Verify Google ID token and return app token/user
 *     description: |
 *       Accepts Google ID token via `Authorization: Bearer <token>` or the
 *       `token` field in the JSON body. Uses server-side verification.
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
 *         description: Authenticated
 */
authRouter.post('/login', attachUserFromGoogleToken, login);

export { authRouter };
