/**
 * Project Controller
 *
 * Orchestrates project-related actions. Controllers call `project.service.js`
 * to perform persistence and domain operations and translate service
 * level errors into HTTP responses.
 *
 * Exported functions:
 * - createProjectController
 * - getProjectsController
 * - getProjectByIdController
 * - getProjectsByStudentIdController
 * - assingAdministratorToProjectController
 * - deleteProjectController
 */
import {
    saveProject,
    getProjects,
    findProjectById,
    
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

// Administrator assignment is deprecated: administrators have global access and are
// not stored on projects. The old assign endpoint has been removed from routes.

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
    deleteProjectController
};

/**
 * @openapi
 * /project/create:
 *   post:
 *     tags: [Project]
 *     summary: Create a new project
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created
 */

/**
 * @openapi
 * /project/projects:
 *   get:
 *     tags: [Project]
 *     summary: Get all projects
 *     responses:
 *       200:
 *         description: List of projects
 */

/**
 * @openapi
 * /project/get/{id}:
 *   get:
 *     tags: [Project]
 *     summary: Get a project by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project object
 */

/**
 * @openapi
 * /project/student/{studentId}:
 *   get:
 *     tags: [Project]
 *     summary: Get projects for a student (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of projects
 */

/**
 * @openapi
 * /project/{projectId}/{administratorId}:
 *   put:
 *     tags: [Project]
 *     summary: Assign an administrator to a project (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *       - in: path
 *         name: administratorId
 *         required: true
 *     responses:
 *       200:
 *         description: Assignment result
 */

/**
 * @openapi
 * /project/{id}:
 *   delete:
 *     tags: [Project]
 *     summary: Delete a project (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */