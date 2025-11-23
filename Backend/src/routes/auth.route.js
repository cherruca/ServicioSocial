import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { attachUserFromGoogleToken } from '../middleware/auth.middleware.js';

const authRouter = Router();


authRouter.post('/login', attachUserFromGoogleToken, login);

export { authRouter };
