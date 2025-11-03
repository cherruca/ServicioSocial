import {
    savePetition,
    getPetitions,
    findPetitionById,
    deletePetition,
    assignAdministratorToPetition
} from '../services/petition.service.js';
import {
    findAdministratorById
    // deleteProjectFromAdministrator
} from '../services/administrator.service.js';

import createError from 'http-errors';
import {PetitionErrorCodes} from '../utils/errors/petition.errorCodes.js';
import { AdministratorErrorCodes } from '../utils/errors/administrator.errorCodes.js';

/* 
    in order to save to an entity, try:
        - store the request body and use the service functions for the process
        - check if the entity already exists, throw an error if that's the case
        - save the entity and print success message
    catch:
        - get error type and print it
*/
export const createPetitionController = async (req, res, next) => {
    try {
        const petition = req.body;
        // const existPetition= await findPetitionByName(petition.name);
        // if(existPetition) throw createError(400, 'La solicitud ya existe');

        const petitionCreated = await savePetition(petition);
        res.status(201).json({ message: 'petition created', data: petitionCreated });
    } catch (e) {
        switch(e.code)
        {
            case PetitionErrorCodes.PETITION_NOT_FOUND:
                next(createError(404, 'La solicitud no existe'));
                break;
            case PetitionErrorCodes.PETITION_SEARCH_FAILED:
                next(createError(500, 'Error al buscar la solicitud'));
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
export const getPetitionsController = async (req, res, next) => {
    try {
        const petitions = await getPetitions();
        res.status(200).json({ data: petitions });
    } catch (e) {
        switch(e.code){
            case PetitionErrorCodes.PETITION_FETCH_FAILED:
                next(createError(500, 'Error al obtener las solicitudes'));
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
export const getPetitionByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const thisPetition = await findPetitionById(id);
        res.status(200).json({ data: thisPetition });
    } catch (e) {
        switch(e.code){
            case PetitionErrorCodes.PETITION_FETCH_FAILED:
                next(createError(500, 'Error al obtener la solicitud'));
                break;
            default:
                next(e);
        }
    }
}

/* 
    to assign a foreign key to the entity, try:
        - get the foreign key and search if it's already assigned
        - if it's not assigned, push it to the array of foreign keys
        - save the changes and return success status
    catch:
        - get error type and print it
*/
export const assingAdministratorToPetitionController = async (req, res, next) => {
    try {
        const { petitionId, administratorId } = req.params;

        const petition = await findPetitionById(petitionId);

        await findAdministratorById(administratorId);

        const petitionUpdated = await assignAdministratorToPetition(petition, administratorId);
        res.status(200).json({ message: 'Administrador asignado a la solicitud', data: petitionUpdated });
    } catch (e) {
        switch (e.code) {
            case PetitionErrorCodes.PETITION_NOT_FOUND:
                next(createError(404, 'La solicitud no existe'));
                break;
            case PetitionErrorCodes.PETITION_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar la solicitud por ID'));
                break;
            case AdministratorErrorCodes.ADMINISTRATOR_NOT_FOUND:
                next(createError(404, 'El administrador no existe'));
                break;
            case AdministratorErrorCodes.ADMINISTRATOR_FETCH_FAILED:
                next(createError(500, 'Error al obtener los administradors'));
                break;
            case AdministratorErrorCodes.PETITION_ALREADY_ASSIGNED:
                next(createError(400, 'El administrador ya fue asignado a la solicitud'));
                break;
            case AdministratorErrorCodes.PETITION_ASSIGN_FAILED:
                next(createError(500, 'Error al asignar la solicitud al administrador'));
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
export const deletePetitionController = async (req, res, next) => {
    try {
        const { id } = req.params;

        await findPetitionById(id);

        // await deletePetitionFromBook(id);

        await deletePetition(id);
        res.status(200).json({ message: 'Solicitud eliminado' })
    } catch (e) {
        switch(e.code){
            case PetitionErrorCodes.PETITION_NOT_FOUND:
                next(createError(404, 'La solicitud no existe'));
                break;
            case PetitionErrorCodes.PETITION_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar la solicitud por ID'));
                break;
            case PetitionErrorCodes.PETITION_DELETE_FAILED:
                next(createError(500, 'Error al eliminar la solicitud'));
                break;
            // case BookErrorCodes.PETITION_REMOVAL_FAILED:
            //     next(createError(500, 'Error al eliminar el libro de las solicitudes'));
            //     break;
            default:
                next(e);
        }
    }
}
