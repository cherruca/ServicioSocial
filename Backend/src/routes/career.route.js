import { Router } from 'express';
import {
    createCareerController,
    getCareersController,
    assingFacultyToCareerController,
    deleteCareerController,
    getCareerByIdController
} from '../controllers/career.controller.js';

const careerRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Career
 *     description: Career endpoints
 */
careerRouter.post('/create', createCareerController);

/**
 * @openapi
 * /career/careers:
 *   get:
 *     tags: [Career]
 *     summary: List careers
 *     responses:
 *       200:
 *         description: List
 */
careerRouter.get('/careers', getCareersController);

/**
 * @openapi
 * /career/get/{id}:
 *   get:
 *     tags: [Career]
 *     summary: Get career by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Career
 */
careerRouter.get('/get/:id', getCareerByIdController);

/**
 * @openapi
 * /career/{careerId}/{facultyId}:
 *   put:
 *     tags: [Career]
 *     summary: Assign faculty to career
 *     parameters:
 *       - in: path
 *         name: careerId
 *         required: true
 *       - in: path
 *         name: facultyId
 *         required: true
 *     responses:
 *       200:
 *         description: Assigned
 */
careerRouter.put('/:careerId/:facultyId', assingFacultyToCareerController);

careerRouter.delete('/:id', deleteCareerController);

export { careerRouter };