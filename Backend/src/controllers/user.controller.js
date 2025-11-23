import { jwtDecode } from 'jwt-decode'; 
import {
    saveUser,
    getUsers,
    findUserById,
    assignCareerToUser,
    deleteUser,
    findUserByEmail
} from '../services/user.service.js';
import {
   findCareerById
    // deleteUserFromCareer
} from '../services/career.service.js';

import createError from 'http-errors';
import {UserErrorCodes} from '../utils/errors/user.errorCodes.js';
import { CareerErrorCodes } from '../utils/errors/career.errorCodes.js';

/* 
    in order to save to an entity try:
        - store the request body and use the service functions for the process
        - check if the entity already exists, throw an error if that's the case
        - save the entity and print success message
    catch:
        - get error type and print it
*/
export const createUserController = async (req, res, next) => {
    try {
        const user = req.body;
        const existUser= await findUserByEmail(user.email);
        if(existUser) throw createError(400, 'El usuario ya existe');

        const userCreated = await saveUser(user);
        res.status(201).json({ message: 'User created', data: userCreated });
    } catch (e) {
        switch(e.code)
        {
            case UserErrorCodes.USER_NOT_FOUND:
                next(createError(404, 'El usuario no existe'));
                break;
            case UserErrorCodes.USER_SEARCH_FAILED:
                next(createError(500, 'Error al buscar el usuario'));
                break;
            default:
                next(e);
        }
    }
}


export const getUsersController = async (req, res, next) => {
    try {
        const users = await getUsers();
        res.status(200).json({ data: users });
    } catch (e) {
        switch(e.code){
            case UserErrorCodes.USER_FETCH_FAILED:
                next(createError(500, 'Error al obtener los usuarios'));
                break;
            default:
                next(e);
        }
    }
}


export const getUserByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const thisUser = await findUserById(id);
        res.status(200).json({ data: thisUser });
    } catch (e) {
        switch(e.code){
            case UserErrorCodes.USER_FETCH_FAILED:
                next(createError(500, 'Error al obtener el usuario por su ID'));
                break;
            default:
                next(e);
        }
    }
}


export const getUserFromToken = async (req, res, next) => {
    try {
        const { token } = req.body;

        const decoded = jwtDecode(token);

        const thisUser = await findUserByEmail(decoded.email);
        res.status(200).json({ data: thisUser });

    } catch (e) {
        switch(e.code){
            case UserErrorCodes.USER_FETCH_FAILED:
                next(createError(500, 'Error al obtener el usuario a través del token'));
                break;
            default:
                next(e);
        }
    }
}



export const assingCareerToUserController = async (req, res, next) => {
    try {
        const { userId, careerId  } = req.params;

        const user = await findUserById(userId);

        await findCareerById(careerId);

        const userUpdated = await assignCareerToUser(user, careerId);
        res.status(200).json({ message: 'Carrera asignada al usuario', data: userUpdated });
    } catch (e) {
        switch (e.code) {
            case UserErrorCodes.USER_NOT_FOUND:
                next(createError(404, 'El usuario no existe'));
                break;
            case UserErrorCodes.USER_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar el usuario por ID'));
                break;
            case CareerErrorCodes.CAREER_NOT_FOUND:
                next(createError(404, 'El carrera no existe'));
                break;
            case CareerErrorCodes.CAREER_FETCH_FAILED:
                next(createError(500, 'Error al obtener los carreras'));
                break;
            case CareerErrorCodes.USER_ALREADY_ASSIGNED:
                next(createError(400, 'El carrera ya fue asignada al usuario'));
                break;
            case CareerErrorCodes.USER_ASSIGN_FAILED:
                next(createError(500, 'Error al asignar el usuario a la carrera'));
                break;
            default:
                next(e);
        }
    }
}


export const deleteUserController = async (req, res, next) => {
    try {
        const { id } = req.params

        await findUserById(id);

        // await deleteUserFromCareer(id);

        await deleteUser(id);
        res.status(200).json({ message: 'Usuario eliminado' })
    } catch (e) {
        switch(e.code){
            case UserErrorCodes.USER_NOT_FOUND:
                next(createError(404, 'El usuario no existe'));
                break;
            case UserErrorCodes.USER_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar el usuario por ID'));
                break;
            case UserErrorCodes.USER_DELETE_FAILED:
                next(createError(500, 'Error al eliminar el usuario'));
                break;
            // case CareerErrorCodes.USER_REMOVAL_FAILED:
            //     next(createError(500, 'Error al eliminar el carrera de los usuarios'));
            //     break;
            default:
                next(e);
        }
    }
}

