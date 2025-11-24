import { Router } from 'express';
import {
    createAdministratorController,
    getAdministratorsController,
    deleteAdministratorController,
    getAdministratorByIdController
} from '../controllers/administrator.controller.js';

const administratorRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Administrator
 *     description: Administrator management
 */
administratorRouter.post('/create', createAdministratorController);

/**
 * @openapi
 * /administrator/administrators:
 *   get:
 *     tags: [Administrator]
 *     summary: List administrators
 *     responses:
 *       200:
 *         description: List
 */
administratorRouter.get('/administrators', getAdministratorsController);

// administratorRouter.put('/:administratorId/:administratorId', assingAdministratorToAdministratorController);
administratorRouter.get('/get/:id', getAdministratorByIdController);
administratorRouter.delete('/:id', deleteAdministratorController);

export { administratorRouter };