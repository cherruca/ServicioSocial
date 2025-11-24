import { Router } from 'express';
import attachUserFromGoogleToken, { requireAuth } from '../middleware/auth.middleware.js';

import {
    createPetitionController,
    getPetitionsController,
    assingAdministratorToPetitionController,
    deletePetitionController,
    getPetitionByIdController,
    enrollProjectController,  //IMPORTACIÓN NUEVA
    unassignProjectFromPetitionController,
    isEnrolledController 
} from '../controllers/petition.controller.js';

const petitionRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Petition
 *     description: Petition and enrollment endpoints
 */
//petitionRouter.post('/create', createPetitionController);

/**
 * @openapi
 * /petition/enroll:
 *   post:
 *     tags: [Petition]
 *     summary: Enroll a project to a petition
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Enrollment result
 */
petitionRouter.post('/enroll', enrollProjectController);

/**
 * @openapi
 * /petition/petitions:
 *   get:
 *     tags: [Petition]
 *     summary: Get all petitions
 *     responses:
 *       200:
 *         description: List of petitions
 */
petitionRouter.get('/petitions', getPetitionsController);

/**
 * @openapi
 * /petition/{id}:
 *   get:
 *     tags: [Petition]
 *     summary: Get petition by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Petition object
 */
petitionRouter.get('/:id', getPetitionByIdController);

/**
 * @openapi
 * /petition/{petitionId}/{administratorId}:
 *   put:
 *     tags: [Petition]
 *     summary: Assign administrator to petition (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petitionId
 *         required: true
 *       - in: path
 *         name: administratorId
 *         required: true
 *     responses:
 *       200:
 *         description: Assigned
 */
petitionRouter.put('/:petitionId/:administratorId', attachUserFromGoogleToken, requireAuth, assingAdministratorToPetitionController);

/**
 * @openapi
 * /petition/{id}:
 *   delete:
 *     tags: [Petition]
 *     summary: Delete a petition
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
petitionRouter.delete('/:id', deletePetitionController);

// cambiar endpoint a patch
/**
 * @openapi
 * /petition/unassign/{studentId}/{projectId}:
 *   delete:
 *     tags: [Petition]
 *     summary: Unassign a project from a petition
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *       - in: path
 *         name: projectId
 *         required: true
 *     responses:
 *       200:
 *         description: Unassigned
 */
petitionRouter.delete('/unassign/:studentId/:projectId', unassignProjectFromPetitionController);

/**
 * @openapi
 * /petition/isEnrolled/{studentId}/{projectId}:
 *   get:
 *     tags: [Petition]
 *     summary: Check enrollment status (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *       - in: path
 *         name: projectId
 *         required: true
 *     responses:
 *       200:
 *         description: Enrollment boolean
 */
petitionRouter.get('/isEnrolled/:studentId/:projectId', attachUserFromGoogleToken, requireAuth, isEnrolledController);


export { petitionRouter };
