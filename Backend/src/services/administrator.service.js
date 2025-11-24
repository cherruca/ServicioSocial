/**
 * Administrator Service
 *
 * Manages persistence and domain logic for Administrator entities.
 * Keep business rules here and return domain objects or throw ServiceError.
 */
import { Administrator } from '../models/administrator.model.js';
import { AdministratorErrorCodes } from '../utils/errors/administrator.errorCodes.js';
import { ServiceError } from '../utils/errors/serviceError.js';

/* 
    in order to save to an entity, try:
        - get the object from the controller
        - save it in the entity
        - check the status message
    catch:
        - get error type and print it
*/
export const saveAdministrator = async (administrator) => {
    // console.log(administrator);
    const newAdministrator = new Administrator(administrator);
    try {
        const administratorCreated = await newAdministrator.save();
        return administratorCreated;
    } catch (error) {
        console.log(error);
        throw new ServiceError('Error al crear el administrador ', AdministratorErrorCodes.ADMINISTRATOR_CREATION_FAILED);
    }
}

/* 
    in order to get all the rows from an entity, try:
        - use the entity functions to get all the rows and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const getAdministrators = async () => {
    try {
        // const administrators = await Administrator.find().populate('books');
        const administrators = await Administrator.find();
        return administrators;
    } catch (error) {
        throw new ServiceError('Error al obtener los administradors ', AdministratorErrorCodes.ADMINISTRATOR_FETCH_FAILED);
    }
}

/* 
    get an specific row from an entity using its name, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findAdministratorByName = async (name) => {
    try {
        const administrator = await Administrator.findOne({ name });
        return administrator || null;
    } catch (error) {
        throw new ServiceError('Error al buscar el administrador', AdministratorErrorCodes.ADMINISTRATOR_SEARCH_FAILED);
    }
}

// export const assignBookToAdministrator = async (administrator, bookId) => {
//     try {
//         const existBook = administrator.books.find(book => book.toString() === bookId);
//         if (existBook) throw new ServiceError('El libro ya fue asignado al administrador', AdministratorErrorCodes.BOOK_ALREADY_ASSIGNED);

//         administrator.books.push(bookId);
//         const administratorUpdated = await administrator.save();
//         return administratorUpdated;
//     } catch (error) {
//         throw new ServiceError('Error al asignar el libro al administrador', error.code|| AdministratorErrorCodes.BOOK_ASSIGN_FAILED);
//     }
// }

/* 
    get an specific row from an entity using its id, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findAdministratorById = async (id) => {
    try {

        const administrator = await Administrator.findById(id);
        if (!administrator) throw new ServiceError('Administrador no encontrado', AdministratorErrorCodes.ADMINISTRATOR_NOT_FOUND);
        return administrator;
    } catch (error) {
        console.log(error);
        throw new ServiceError('Error al buscar el administrador por ID', error.code || AdministratorErrorCodes.ADMINISTRATOR_FETCH_BY_ID_FAILED);
    }
}

// export const deleteBookFromAdministrator = async (bookId) => {
//     try {
//         const updatesAdministrators = await Administrator.updateMany({ books: bookId }, { $pull: { books: bookId } });
//         if (!updatesAdministrators) throw new ServiceError('No se encontraron administradores con el libro especificado', AdministratorErrorCodes.NO_ADMINISTRATORS_FOUND);
//         return updatesAdministrators;
//     } catch (error) {
//         throw new ServiceError('Error al eliminar el libro de los administradores', error.code || AdministratorErrorCodes.BOOK_DELETE_FAILED);
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
export const deleteAdministrator = async (id) => {
    try {
        const administratorDelete = await Administrator.findByIdAndDelete(id);
        if (!administratorDelete) throw new ServiceError('Administrador no encontrado', AdministratorErrorCodes.ADMINISTRATOR_NOT_FOUND);
        return administratorDelete;
    } catch (error) {
        throw new ServiceError('Error al eliminar el administrador', error.code || AdministratorErrorCodes.ADMINISTRATOR_DELETE_FAILED);
    }
}

