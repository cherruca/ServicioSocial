/**
 * Project Service
 *
 * Responsible for data access and business rules for Project entities.
 * Controllers should use these functions instead of directly interacting
 * with Mongoose models.
 *
 * Public functions:
 * - saveProject(project)
 * - getProjects()
 * - findProjectById(id)
 * - assignAdministratorToProject(project, administratorId)
 * - deleteProject(id)
 * - findProjectByName(name)
 * - getProjectsByStudentId(studentId)
 */
import { Project } from '../models/project.model.js';
import { ProjectErrorCodes } from '../utils/errors/project.errorCodes.js';
import { ServiceError } from '../utils/errors/serviceError.js';

/* 
    in order to save to an entity, try:
        - get the object from the controller
        - save it in the entity
        - check the status message
    catch:
        - get error type and print it
*/
export const saveProject = async (project) => {
    // console.log(project);
    const newProject = new Project(project);
    try {
        const projectCreated = await newProject.save();
        return projectCreated;
    } catch (error) {
        console.log(error);
        throw new ServiceError('Error al crear el proyecto ', ProjectErrorCodes.PROJECT_CREATION_FAILED);
    }
}



/* 
    in order to get all the rows from an entity, try:
        - use the entity functions to get all the rows and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const getProjects = async () => {
    try {
        // Administrators are global — projects no longer track assigned administrators
        const projects = await Project.find().populate('students');
        return projects;
    } catch (error) {
        throw new ServiceError('Error al obtener los proyectos ', ProjectErrorCodes.PROJECT_FETCH_FAILED);
    }
}

/* 
    get an specific row from an entity using its name, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findProjectByName = async (name) => {
    try {
        const project = await Project.findOne({ name });
        return project || null;
    } catch (error) {
        throw new ServiceError('Error al buscar el proyecto', ProjectErrorCodes.PROJECT_SEARCH_FAILED);
    }
}

// assignAdministratorToProject removed: administrators are global and not stored on projects.

/* 
    get an specific row from an entity using its id, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findProjectById = async (id) => {
    try {
        const project = await Project.findById(id);
        if (!project) throw new ServiceError('Proyecto no encontrado', ProjectErrorCodes.PROJECT_NOT_FOUND);
        return project;
    } catch (error) {
        throw new ServiceError('Error al buscar el proyecto por ID', error.code || ProjectErrorCodes.PROJECT_FETCH_BY_ID_FAILED);
    }
}

/**
 * Get projects where a specific student is assigned
 * @param {string} studentId
 * @returns {Promise<Array>} list of projects
 */
export const getProjectsByStudentId = async (studentId) => {
    try {
        const projects = await Project.find({ students: studentId }).populate('students');
        return projects;
    } catch (error) {
        throw new ServiceError('Error al obtener los proyectos del estudiante', ProjectErrorCodes.PROJECT_FETCH_FAILED);
    }
}

// export const deleteAdministratorFromProject = async (administratorId) => {
//     try {
//         const updatesProjects = await Project.updateMany({ administrators: administratorId }, { $pull: { administrators: administratorId } });
//         if (!updatesProjects) throw new ServiceError('No se encontraron proyectoes con el administrador especificado', ProjectErrorCodes.NO_PROJECTS_FOUND);
//         return updatesProjects;
//     } catch (error) {
//         throw new ServiceError('Error al eliminar el administrador de los proyectoes', error.code || ProjectErrorCodes.BOOK_DELETE_FAILED);
//     }
// }

/* 
    in order to delete an specific row from the entity, try:
        - receive the row id from the controller
        - check if the entity already exists, throw an error if that's the case
        - use the service functions to delete the row
        - print success message
    catch:
        - get error type and print it
*/
export const deleteProject = async (id) => {
    try {
        const projectDelete = await Project.findByIdAndDelete(id);
        if (!projectDelete) throw new ServiceError('Proyecto no encontrado', ProjectErrorCodes.PROJECT_NOT_FOUND);
        return projectDelete;
    } catch (error) {
        throw new ServiceError('Error al eliminar el proyecto', error.code || ProjectErrorCodes.PROJECT_DELETE_FAILED);
    }
}