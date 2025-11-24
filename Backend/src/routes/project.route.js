import { Router } from 'express';
import attachUserFromGoogleToken, { requireAuth } from '../middleware/auth.middleware.js';
import {
    createProjectController,
    getProjectsController,
    assingAdministratorToProjectController,
    deleteProjectController,
    getProjectByIdController,
    getProjectsByStudentIdController
} from '../controllers/project.controller.js';

const projectRouter = Router();


projectRouter.post('/create', attachUserFromGoogleToken, requireAuth, createProjectController);


projectRouter.get('/projects', getProjectsController);


projectRouter.get('/get/:id', getProjectByIdController);


projectRouter.put('/:projectId/:administratorId', attachUserFromGoogleToken, requireAuth, assingAdministratorToProjectController);


projectRouter.delete('/:id', attachUserFromGoogleToken, requireAuth, deleteProjectController);


projectRouter.get('/student/:studentId', attachUserFromGoogleToken, requireAuth, getProjectsByStudentIdController);

export { projectRouter };