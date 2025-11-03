import { Router } from 'express';
import {
    createPetitionController,
    getPetitionsController,
    assingAdministratorToPetitionController,
    deletePetitionController,
    getPetitionByIdController
} from '../controllers/petition.controller.js';

const petitionRouter = Router();

/*
    handle requests to the controller
    send the respective data or parameters
*/
petitionRouter.post('/create', createPetitionController);
petitionRouter.get('/petitions', getPetitionsController);
petitionRouter.get('/get/:id', getPetitionByIdController);
petitionRouter.put('/:petitionId/:administratorId', assingAdministratorToPetitionController);
petitionRouter.delete('/:id', deletePetitionController);

export { petitionRouter };