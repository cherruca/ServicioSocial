import { Router } from 'express';
import {
    createCareerController,
    getCareersController,
    assingFacultyToCareerController,
    deleteCareerController,
    getCareerByIdController
} from '../controllers/career.controller.js';

const careerRouter = Router();

/*
    handle requests to the controller
    send the respective data or parameters
*/
careerRouter.post('/create', createCareerController);
careerRouter.get('/careers', getCareersController);
careerRouter.get('/get/:id', getCareerByIdController);
careerRouter.put('/:careerId/:facultyId', assingFacultyToCareerController);
careerRouter.delete('/:id', deleteCareerController);

export { careerRouter };