import { Router } from 'express';
import {
    createFacultyController,
    getFacultiesController,
    // assingAdministratorToFacultyController,
    deleteFacultyController,
    getFacultyByIdController
} from '../controllers/faculty.controller.js';

const facultyRouter = Router();


facultyRouter.post('/create', createFacultyController);


facultyRouter.get('/faculties', getFacultiesController);


facultyRouter.get('/get/:id', getFacultyByIdController);

// facultyRouter.put('/:facultyId/:administratorId', assingAdministratorToFacultyController);
facultyRouter.delete('/:id', deleteFacultyController);

export { facultyRouter };