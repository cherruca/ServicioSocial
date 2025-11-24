import {
    saveCareer,
    getCareers,
    findCareerById,
    assignFacultyToCareer,
    deleteCareer,
    findCareerByName
} from '../services/career.service.js';
import {
    findFacultyById
    // deleteCareerFromFaculty
} from '../services/faculty.service.js';

import createError from 'http-errors';
import {CareerErrorCodes} from '../utils/errors/career.errorCodes.js';
import { FacultyErrorCodes } from '../utils/errors/faculty.errorCodes.js';

/* 
    in order to save to an entity try:
        - store the request body and use the service functions for the process
        - check if the entity already exists, throw an error if that's the case
        - save the entity and print success message
    catch:
        - get error type and print it
*/
export const createCareerController = async (req, res, next) => {
    try {
        const career = req.body;
        const existCareer= await findCareerByName(career.name);
        if(existCareer) throw createError(400, 'La carrera ya existe');

        const careerCreated = await saveCareer(career);
        res.status(201).json({ message: 'career created', data: careerCreated });
    } catch (e) {
        switch(e.code)
        {
            case CareerErrorCodes.CAREER_NOT_FOUND:
                next(createError(404, 'La carrera no existe'));
                break;
            case CareerErrorCodes.CAREER_SEARCH_FAILED:
                next(createError(500, 'Error al buscar la carrera'));
                break;
            default:
                next(e);
        }
    }
}

export const getCareersController = async (req, res, next) => {
    try {
        const careers = await getCareers();
        res.status(200).json({ data: careers });
    } catch (e) {
        switch(e.code){
            case CareerErrorCodes.CAREER_FETCH_FAILED:
                next(createError(500, 'Error al obtener las carreras'));
                break;
            default:
                next(e);
        }
    }
}


export const getCareerByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const thisCareer = await findCareerById(id);
        res.status(200).json({ data: thisCareer });
    } catch (e) {
        switch(e.code){
            case CareerErrorCodes.CAREER_FETCH_FAILED:
                next(createError(500, 'Error al obtener la carrera por su ID'));
                break;
            default:
                next(e);
        }
    }
}


export const assingFacultyToCareerController = async (req, res, next) => {
    try {
        const { facultyId, careerId } = req.params;

        const career = await findCareerById(careerId);

        await findFacultyById(facultyId);

        const careerUpdated = await assignFacultyToCareer(career, facultyId);
        res.status(200).json({ message: 'Facultad asignada a la carrera', data: careerUpdated });
    } catch (e) {
        switch (e.code) {
            case CareerErrorCodes.CAREER_NOT_FOUND:
                next(createError(404, 'La carrera no existe'));
                break;
            case CareerErrorCodes.CAREER_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar la carrera por ID'));
                break;
            case FacultyErrorCodes.FACULTY_NOT_FOUND:
                next(createError(404, 'El administrador no existe'));
                break;
            case FacultyErrorCodes.FACULTY_FETCH_FAILED:
                next(createError(500, 'Error al obtener los administradors'));
                break;
            case FacultyErrorCodes.CAREER_ALREADY_ASSIGNED:
                next(createError(400, 'El administrador ya fue asignado al carrera'));
                break;
            case FacultyErrorCodes.CAREER_ASSIGN_FAILED:
                next(createError(500, 'Error al asignar la carrera al administrador'));
                break;
            default:
                next(e);
        }
    }
}

export const deleteCareerController = async (req, res, next) => {
    try {
        const { id } = req.params

        await findCareerById(id);

        // await deleteCareerFromFaculty(id);

        await deleteCareer(id);
        res.status(200).json({ message: 'Carrera eliminada' })
    } catch (e) {
        switch(e.code){
            case CareerErrorCodes.CAREER_NOT_FOUND:
                next(createError(404, 'La carrera no existe'));
                break;
            case CareerErrorCodes.CAREER_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar la carrera por ID'));
                break;
            case CareerErrorCodes.CAREER_DELETE_FAILED:
                next(createError(500, 'Error al eliminar la carrera'));
                break;
            // case FacultyErrorCodes.CAREER_REMOVAL_FAILED:
            //     next(createError(500, 'Error al eliminar el administrador de los carreraes'));
            //     break;
            default:
                next(e);
        }
    }
}
