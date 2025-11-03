import {
    saveAdministrator,
    getAdministrators,
    findAdministratorById,
    deleteAdministrator,
    findAdministratorByName
} from '../services/administrator.service.js';

import createError from 'http-errors';
import {AdministratorErrorCodes} from '../utils/errors/administrator.errorCodes.js';

/* 
    in order to save to an entity, try:
        - store the request body and use the service functions for the process
        - check if the entity already exists, throw an error if that's the case
        - save the entity and print success message
    catch:
        - get error type and print it
*/
export const createAdministratorController = async (req, res, next) => {
    try {
        const administrator = req.body;
        const existAdministrator= await findAdministratorByName(administrator.name);
        if(existAdministrator) throw createError(400, 'El administrador ya existe');

        const administratorCreated = await saveAdministrator(administrator);
        res.status(201).json({ message: 'administrator created', data: administratorCreated });
    } catch (e) {
        switch(e.code)
        {
            case AdministratorErrorCodes.ADMINISTRATOR_NOT_FOUND:
                next(createError(404, 'El administrador no existe'));
                break;
            case AdministratorErrorCodes.ADMINISTRATOR_SEARCH_FAILED:
                next(createError(500, 'Error al buscar el administrador'));
                break;
            default:
                next(e);
        }
    }
}

/* 
    in order to get all the rows from an entity, try:
        - use the service functions to get all the rows and store it in a variable
        - return it in JSON format
    catch:
        - get error type and print it
*/
export const getAdministratorsController = async (req, res, next) => {
    try {
        const administrators = await getAdministrators();
        res.status(200).json({ data: administrators });
    } catch (e) {
        switch(e.code){
            case AdministratorErrorCodes.ADMINISTRATOR_FETCH_FAILED:
                next(createError(500, 'Error al obtener los administradores'));
                break;
            default:
                next(e);
        }
    }
}

/* 
    get one the rows from an entity by the ID, try:
        - use the service functions to get all the rows and store it in a variable
        - return it in JSON format
    catch:
        - get error type and print it
*/
export const getAdministratorByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const thisAdministrator = await findAdministratorById(id);
        res.status(200).json({ data: thisAdministrator });
    } catch (e) {
        switch(e.code){
            case AdministratorErrorCodes.ADMINISTRATOR_FETCH_FAILED:
                next(createError(500, 'Error al obtener del administrador'));
                break;
            default:
                next(e);
        }
    }
}

/* 
    in order to delete an specific row from the entity, try this:
        - get the row id from the parameter in the request
        - check if the entity already exists, throw an error if that's the case
        - use the service functions to delete the row
        - print success message
    catch:
        - get error type and print it
*/
export const deleteAdministratorController = async (req, res, next) => {
    try {
        const { id } = req.params;

        await findAdministratorById(id);

        // await deleteAdministratorFromBook(id);

        await deleteAdministrator(id);
        res.status(200).json({ message: 'Administrador eliminado' })
    } catch (e) {
        switch(e.code){
            case AdministratorErrorCodes.ADMINISTRATOR_NOT_FOUND:
                next(createError(404, 'El administrador no existe'));
                break;
            case AdministratorErrorCodes.ADMINISTRATOR_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar el administrador por ID'));
                break;
            case AdministratorErrorCodes.ADMINISTRATOR_DELETE_FAILED:
                next(createError(500, 'Error al eliminar el administrador'));
                break;
            // case BookErrorCodes.ADMINISTRATOR_REMOVAL_FAILED:
            //     next(createError(500, 'Error al eliminar el libro de los administradores'));
            //     break;
            default:
                next(e);
        }
    }
}
