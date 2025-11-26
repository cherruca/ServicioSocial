import { Router } from 'express';
import attachUserFromGoogleToken, { requireAuth } from '../middleware/auth.middleware.js';
import {
    createProjectController,
    getProjectsController,
    deleteProjectController,
    getProjectByIdController,
    getProjectsByStudentIdController
} from '../controllers/project.controller.js';

const projectRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Project
 *     description: Project endpoints
 */
// Protect create/assign/delete operations; public routes remain public
/**
 * @openapi
 * /project/create:
 *   post:
 *     tags: [Project]
 *     summary: Create a project (protected)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Project created
 */
projectRouter.post('/create', attachUserFromGoogleToken, requireAuth, createProjectController);

/**
 * @openapi
 * /project/projects:
 *   get:
 *     tags: [Project]
 *     summary: Get all projects
 *     responses:
 *       200:
 *         description: List of projects
 */
projectRouter.get('/projects', getProjectsController);

/**
 * @openapi
 * /project/get/{id}:
 *   get:
 *     tags: [Project]
 *     summary: Get project by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Project object
 */
projectRouter.get('/get/:id', getProjectByIdController);

/**
 * @openapi
 * /project/{projectId}/{administratorId}:
 *   put:
 *     tags: [Project]
 *     summary: Assign administrator to project (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *       - in: path
 *         name: administratorId
 *         required: true
 *     responses:
 *       200:
 *         description: Assigned
 */

/**
 * @openapi
 * /project/{id}:
 *   delete:
 *     tags: [Project]
 *     summary: Delete a project (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
projectRouter.delete('/:id', attachUserFromGoogleToken, requireAuth, deleteProjectController);

/**
 * @openapi
 * /project/student/{studentId}:
 *   get:
 *     tags: [Project]
 *     summary: Get projects by student id (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *     responses:
 *       200:
 *         description: Projects list
 */
projectRouter.get('/student/:studentId', attachUserFromGoogleToken, requireAuth, getProjectsByStudentIdController);

export { projectRouter };