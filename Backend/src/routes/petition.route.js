import { Router } from 'express';
import attachUserFromGoogleToken, { requireAuth } from '../middleware/auth.middleware.js';

import {
    createPetitionController,
    getPetitionsController,
    deletePetitionController,
    getPetitionByIdController,
    enrollProjectController,  //IMPORTACIÓN NUEVA
    unassignProjectFromPetitionController,
    isEnrolledController 
} from '../controllers/petition.controller.js';
import { getMyPetitionsController } from '../controllers/petition.controller.js';
import { approvePetitionController, rejectPetitionController } from '../controllers/petition.controller.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

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

// Get petitions for the authenticated student
petitionRouter.get('/my', attachUserFromGoogleToken, requireAuth, getMyPetitionsController);

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



// Admin actions: approve / reject
petitionRouter.patch('/:id/approve', attachUserFromGoogleToken, requireAdmin, approvePetitionController);
petitionRouter.patch('/:id/reject', attachUserFromGoogleToken, requireAdmin, rejectPetitionController);

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
