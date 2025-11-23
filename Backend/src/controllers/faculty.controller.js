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

