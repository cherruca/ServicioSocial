import { Router } from 'express';
import {
    createProjectController,
    getProjectsController,
    assingAdministratorToProjectController,
    deleteProjectController,
    getProjectByIdController
} from '../controllers/project.controller.js';

const projectRouter = Router();

/*
    handle requests to the controller
    send the respective data or parameters
*/
projectRouter.post('/create', createProjectController);
projectRouter.get('/projects', getProjectsController);
projectRouter.get('/get/:id', getProjectByIdController);
projectRouter.put('/:projectId/:administratorId', assingAdministratorToProjectController);
projectRouter.delete('/:id', deleteProjectController);

export { projectRouter };