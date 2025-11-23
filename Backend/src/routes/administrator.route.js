import { Router } from 'express';
import {
    createAdministratorController,
    getAdministratorsController,
    deleteAdministratorController,
    getAdministratorByIdController
} from '../controllers/administrator.controller.js';

const administratorRouter = Router();


administratorRouter.post('/create', createAdministratorController);


administratorRouter.get('/administrators', getAdministratorsController);

// administratorRouter.put('/:administratorId/:administratorId', assingAdministratorToAdministratorController);
administratorRouter.get('/get/:id', getAdministratorByIdController);
administratorRouter.delete('/:id', deleteAdministratorController);

export { administratorRouter };