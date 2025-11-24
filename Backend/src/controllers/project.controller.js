import {
    saveProject,
    getProjects,
    findProjectById,
    assignAdministratorToProject,
    deleteProject,
    findProjectByName,
    getProjectsByStudentId
} from '../services/project.service.js';
import {
    findAdministratorById
    // deleteProjectFromAdministrator
} from '../services/administrator.service.js';

import createError from 'http-errors';
import {ProjectErrorCodes} from '../utils/errors/project.errorCodes.js';
import { AdministratorErrorCodes } from '../utils/errors/administrator.errorCodes.js';


/* 
    in order to save to an entity try:
        - store the request body and use the service functions for the process
        - check if the entity already exists, throw an error if that's the case
        - save the entity and print success message
    catch:
        - get error type and print it
*/
const createProjectController = async (req, res, next) => {
    try {
        const project = req.body;
        const existProject = await findProjectByName(project.name);
        if (existProject) throw createError(400, 'El proyecto ya existe');

        const projectCreated = await saveProject(project);
        res.status(201).json({ message: 'project created', data: projectCreated });
    } catch (e) {
        switch (e.code) {
            case ProjectErrorCodes.PROJECT_NOT_FOUND:
                next(createError(404, 'El proyecto no existe'));
                break;
            case ProjectErrorCodes.PROJECT_SEARCH_FAILED:
                next(createError(500, 'Error al buscar el proyecto'));
                break;
            default:
                next(e);
        }
    }
};

/* 
    in order to get all the rows from an entity try:
        - use the service functions to get all the rows and store it in a variable
        - return it in JSON format
    catch:
        - get error type and print it
*/
const getProjectsController = async (req, res, next) => {
    try {
        const projects = await getProjects();
        res.status(200).json({ data: projects });
    } catch (e) {
        switch (e.code) {
            case ProjectErrorCodes.PROJECT_FETCH_FAILED:
                next(createError(500, 'Error al obtener los proyectos'));
                break;
            default:
                next(e);
        }
    }
};

/* 
    get one the rows from an entity by the ID, try:
        - use the service functions to get all the rows and store it in a variable
        - return it in JSON format
    catch:
        - get error type and print it
*/
const getProjectByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const thisProject = await findProjectById(id);
        res.status(200).json({ data: thisProject });
    } catch (e) {
        switch (e.code) {
            case ProjectErrorCodes.PROJECT_FETCH_FAILED:
                next(createError(500, 'Error al obtener el proyecto por su ID'));
                break;
            default:
                next(e);
        }
    }
};

const getProjectsByStudentIdController = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const projects = await getProjectsByStudentId(studentId);
        res.status(200).json({ data: projects });
    } catch (e) {
        switch (e.code) {
            case ProjectErrorCodes.PROJECT_FETCH_FAILED:
                next(createError(500, 'Error al obtener los proyectos del estudiante'));
                break;
            default:
                next(e);
        }
    }
};

const assingAdministratorToProjectController = async (req, res, next) => {
    try {
        const { administratorId, projectId } = req.params;

        const project = await findProjectById(projectId);

        await findAdministratorById(administratorId);

        const projectUpdated = await assignAdministratorToProject(project, administratorId);
        res.status(200).json({ message: 'Administrador asignado al proyecto', data: projectUpdated });
    } catch (e) {
        switch (e.code) {
            case ProjectErrorCodes.PROJECT_NOT_FOUND:
                next(createError(404, 'El proyecto no existe'));
                break;
            case ProjectErrorCodes.PROJECT_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar el proyecto por ID'));
                break;
            case AdministratorErrorCodes.ADMINISTRATOR_NOT_FOUND:
                next(createError(404, 'El administrador no existe'));
                break;
            case AdministratorErrorCodes.ADMINISTRATOR_FETCH_FAILED:
                next(createError(500, 'Error al obtener los administradors'));
                break;
            case AdministratorErrorCodes.PROJECT_ALREADY_ASSIGNED:
                next(createError(400, 'El administrador ya fue asignado al proyecto'));
                break;
            case AdministratorErrorCodes.PROJECT_ASSIGN_FAILED:
                next(createError(500, 'Error al asignar el proyecto al administrador'));
                break;
            default:
                next(e);
        }
    }
};

/* 
    in order to delete an specific row from the entity try this:
        - get the row id from the parameter in the request
        - check if the entity already exists, throw an error if that's the case
        - use the service functions to delete the row
        - print success message
    catch:
        - get error type and print it
*/
const deleteProjectController = async (req, res, next) => {
    try {
        const { id } = req.params

        await findProjectById(id);

        // await deleteProjectFromAdministrator(id);

        await deleteProject(id);
        res.status(200).json({ message: 'Proyecto eliminado' })
    } catch (e) {
        switch (e.code) {
            case ProjectErrorCodes.PROJECT_NOT_FOUND:
                next(createError(404, 'El proyecto no existe'));
                break;
            case ProjectErrorCodes.PROJECT_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar el proyecto por ID'));
                break;
            case ProjectErrorCodes.PROJECT_DELETE_FAILED:
                next(createError(500, 'Error al eliminar el proyecto'));
                break;
            // case AdministratorErrorCodes.PROJECT_REMOVAL_FAILED:
            //     next(createError(500, 'Error al eliminar el administrador de los proyectoes'));
            //     break;
            default:
                next(e);
        }
    }
};

export {
    createProjectController,
    getProjectsController,
    getProjectByIdController,
    getProjectsByStudentIdController,
    assingAdministratorToProjectController,
    deleteProjectController
};


