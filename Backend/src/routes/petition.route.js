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



petitionRouter.post('/enroll', enrollProjectController);


petitionRouter.get('/petitions', getPetitionsController);


petitionRouter.get('/:id', getPetitionByIdController);


petitionRouter.put('/:petitionId/:administratorId', attachUserFromGoogleToken, requireAuth, assingAdministratorToPetitionController);


petitionRouter.delete('/:id', deletePetitionController);


petitionRouter.delete('/unassign/:studentId/:projectId', unassignProjectFromPetitionController);


petitionRouter.get('/isEnrolled/:studentId/:projectId', attachUserFromGoogleToken, requireAuth, isEnrolledController);


export { petitionRouter };
