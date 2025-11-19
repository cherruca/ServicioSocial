import { Router } from 'express';

import {
    createPetitionController,
    getPetitionsController,
    assingAdministratorToPetitionController,
    deletePetitionController,
    getPetitionByIdController,
    enrollProjectController   //IMPORTACIÓN NUEVA
} from '../controllers/petition.controller.js';

const petitionRouter = Router();
/* 
    handle requests to the controller
    send the respective data or parameters
*/

petitionRouter.post('/create', createPetitionController);

petitionRouter.post('/enroll', enrollProjectController);
petitionRouter.get('/petitions', getPetitionsController);
petitionRouter.get('/:id', getPetitionByIdController);
petitionRouter.put('/:petitionId/:administratorId', assingAdministratorToPetitionController);
petitionRouter.delete('/:id', deletePetitionController);
petitionRouter.delete('/unassign/:studentId/:projectId', unassignProjectFromPetitionController);


export { petitionRouter };
