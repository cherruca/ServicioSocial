/**
 * Faculty Controller
 *
 * Handles faculty CRUD requests and delegates business logic to
 * `faculty.service.js`.
 *
 * Exported functions:
 * - createFacultyController
 * - getFacultiesController
 * - deleteFacultyController
 * - getFacultyByIdController
 */
import {
    saveFaculty,
    getFaculties,
    findFacultyById,
    // assignAdministratorToFaculty,
    deleteFaculty,
    findFacultyByName
} from '../services/faculty.service.js';
// import {
//     findAdministratorById
//     // deleteFacultyFromAdministrator
// } from '../services/administrator.service.js';

import createError from 'http-errors';
import {FacultyErrorCodes} from '../utils/errors/faculty.errorCodes.js';
// import { AdministratorErrorCodes } from '../utils/errors/administrator.errorCodes.js';

/* 
    in order to save to an entity try:
        - store the request body and use the service functions for the process
        - check if the entity already exists, throw an error if that's the case
        - save the entity and print success message
    catch:
        - get error type and print it
*/
export const createFacultyController = async (req, res, next) => {
    try {
        const faculty = req.body;
        const existFaculty= await findFacultyByName(faculty.name);
        if(existFaculty) throw createError(400, 'La facultad ya existe');

        const facultyCreated = await saveFaculty(faculty);
        res.status(201).json({ message: 'faculty created', data: facultyCreated });
    } catch (e) {
        switch(e.code)
        {
            case FacultyErrorCodes.FACULTY_NOT_FOUND:
                next(createError(404, 'La facultad no existe'));
                break;
            case FacultyErrorCodes.FACULTY_SEARCH_FAILED:
                next(createError(500, 'Error al buscar la facultad'));
                break;
            default:
                next(e);
        }
    }
}

/**
 * @openapi
 * /faculty/create:
 *   post:
 *     tags: [Faculty]
 *     summary: Create a faculty
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Faculty created
 */

/* 
    in order to get all the rows from an entity try:
        - use the service functions to get all the rows and store it in a variable
        - return it in JSON format
    catch:
        - get error type and print it
*/
export const getFacultiesController = async (req, res, next) => {
    try {
        const facultys = await getFaculties();
        res.status(200).json({ data: facultys });
    } catch (e) {
        switch(e.code){
            case FacultyErrorCodes.FACULTY_FETCH_FAILED:
                next(createError(500, 'Error al obtener las facultades'));
                break;
            default:
                next(e);
        }
    }
}

/**
 * @openapi
 * /faculty/faculties:
 *   get:
 *     tags: [Faculty]
 *     summary: Get all faculties
 *     responses:
 *       200:
 *         description: List of faculties
 */

/* 
    get one the rows from an entity by the ID, try:
        - use the service functions to get all the rows and store it in a variable
        - return it in JSON format
    catch:
        - get error type and print it
*/
export const getFacultyByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const thisFaculty = await findFacultyById(id);
        res.status(200).json({ data: thisFaculty });
    } catch (e) {
        switch(e.code){
            case FacultyErrorCodes.FACULTY_FETCH_FAILED:
                next(createError(500, 'Error al obtener la facultad por su ID'));
                break;
            default:
                next(e);
        }
    }
}

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
 *         description: Faculty object
 */

// export const assingAdministratorToFacultyController = async (req, res, next) => {
//     try {
//         const { administratorId, facultyId } = req.params;

//         const faculty = await findFacultyById(facultyId);

//         await findAdministratorById(administratorId);

//         const facultyUpdated = await assignAdministratorToFaculty(faculty, administratorId);
//         res.status(200).json({ message: 'Administrador asignado a la facultad', data: facultyUpdated });
//     } catch (e) {
//         switch (e.code) {
//             case FacultyErrorCodes.FACULTY_NOT_FOUND:
//                 next(createError(404, 'El facultad no existe'));
//                 break;
//             case FacultyErrorCodes.FACULTY_FETCH_BY_ID_FAILED:
//                 next(createError(500, 'Error al buscar el facultad por ID'));
//                 break;
//             case AdministratorErrorCodes.ADMINISTRATOR_NOT_FOUND:
//                 next(createError(404, 'El administrador no existe'));
//                 break;
//             case AdministratorErrorCodes.ADMINISTRATOR_FETCH_FAILED:
//                 next(createError(500, 'Error al obtener los administradors'));
//                 break;
//             case AdministratorErrorCodes.FACULTY_ALREADY_ASSIGNED:
//                 next(createError(400, 'El administrador ya fue asignado al facultad'));
//                 break;
//             case AdministratorErrorCodes.FACULTY_ASSIGN_FAILED:
//                 next(createError(500, 'Error al asignar el facultad al administrador'));
//                 break;
//             default:
//                 next(e);
//         }
//     }
// }

/* 
    in order to delete an specific row from the entity try this:
        - get the row id from the parameter in the request
        - check if the entity already exists, throw an error if that's the case
        - use the service functions to delete the row
        - print success message
    catch:
        - get error type and print it
*/
export const deleteFacultyController = async (req, res, next) => {
    try {
        const { id } = req.params

        await findFacultyById(id);

        // await deleteFacultyFromAdministrator(id);

        await deleteFaculty(id);
        res.status(200).json({ message: 'Facultad eliminado' })
    } catch (e) {
        switch(e.code){
            case FacultyErrorCodes.FACULTY_NOT_FOUND:
                next(createError(404, 'El facultad no existe'));
                break;
            case FacultyErrorCodes.FACULTY_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar el facultad por ID'));
                break;
            case FacultyErrorCodes.FACULTY_DELETE_FAILED:
                next(createError(500, 'Error al eliminar el facultad'));
                break;
            // case AdministratorErrorCodes.FACULTY_REMOVAL_FAILED:
            //     next(createError(500, 'Error al eliminar el administrador de los facultades'));
            //     break;
            default:
                next(e);
        }
    }
}

/**
 * @openapi
 * /faculty/{id}:
 *   delete:
 *     tags: [Faculty]
 *     summary: Delete a faculty
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
