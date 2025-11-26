import { Router } from 'express';
import {
    createFacultyController,
    getFacultiesController,
    // assingAdministratorToFacultyController,
    deleteFacultyController,
    getFacultyByIdController
} from '../controllers/faculty.controller.js';

const facultyRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Faculty
 *     description: Faculty management
 */
facultyRouter.post('/create', createFacultyController);

/**
 * @openapi
 * /faculty/faculties:
 *   get:
 *     tags: [Faculty]
 *     summary: List faculties
 *     responses:
 *       200:
 *         description: List
 */
facultyRouter.get('/faculties', getFacultiesController);

/**
 * @openapi
 * /faculty/get/{id}:
 *   get:
 *     tags: [Faculty]
 *     summary: Get faculty by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Faculty
 */
facultyRouter.get('/get/:id', getFacultyByIdController);

// facultyRouter.put('/:facultyId/:administratorId', assingAdministratorToFacultyController);
facultyRouter.delete('/:id', deleteFacultyController);

export { facultyRouter };