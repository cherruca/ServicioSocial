/**
 * Career Service
 *
 * Encapsulates data operations for Career entities.
 *
 * Public functions:
 * - saveCareer(career)
 * - getCareers()
 * - findCareerById(id)
 * - assingFacultyToCareer(career, facultyId)
 * - deleteCareer(id)
 */
import { Career } from '../models/career.model.js';
import { CareerErrorCodes } from '../utils/errors/career.errorCodes.js';
import { ServiceError } from '../utils/errors/serviceError.js';

/* 
    in order to save to an entity, try:
        - get the object from the controller
        - save it in the entity
        - check the status message
    catch:
        - get error type and print it
*/
export const saveCareer = async (career) => {
    // console.log(career);
    const newCareer = new Career(career);
    try {
        const careerCreated = await newCareer.save();
        return careerCreated;
    } catch (error) {
        console.log(error);
        throw new ServiceError('Error al crear la carrera ', CareerErrorCodes.CAREER_CREATION_FAILED);
    }
}

/* 
    in order to get all the rows from an entity, try:
        - use the entity functions to get all the rows and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const getCareers = async () => {
    try {
        // const careers = await Career.find().populate('faculty');
        const careers = await Career.find().populate('faculty');
        return careers;
    } catch (error) {
        throw new ServiceError('Error al obtener las carreras ', CareerErrorCodes.CAREER_FETCH_FAILED);
    }
}

/* 
    get an specific row from an entity using its name, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findCareerByName = async (name) => {
    try {
        const career = await Career.findOne({ name });
        return career || null;
    } catch (error) {
        throw new ServiceError('Error al buscar la carrera', CareerErrorCodes.CAREER_SEARCH_FAILED);
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
export const assignFacultyToCareer = async (career, facultyId) => {
    try {
        const existFaculty = career.faculty.find(faculty => faculty.toString() === facultyId);
        if (existFaculty) throw new ServiceError('La facultad ya fue asignada a la carrera', CareerErrorCodes.FACULTY_ALREADY_ASSIGNED);

        career.faculty.push(facultyId);
        const careerUpdated = await career.save();
        return careerUpdated;
    } catch (error) {
        throw new ServiceError('Error al asignar la facultad a la carrera', error.code|| CareerErrorCodes.FACULTY_ASSIGN_FAILED);
    }
}

// export const deleteFacultyFromCareer = async (facultyId) => {
//     try {
//         const updatesCareers = await Career.updateMany({ faculty: facultyId }, { $pull: { faculty: facultyId } });
//         if (!updatesCareers) throw new ServiceError('No se encontraron carreras con la facultad especificada ', CareerErrorCodes.NO_CAREERS_FOUND);
//         return updatesCareers;
//     } catch (error) {
//         throw new ServiceError('Error al eliminar la facultad de las carreras ', error.code || CareerErrorCodes.BOOK_DELETE_FAILED);
//     }
// }

/* 
    get an specific row from an entity using its id, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findCareerById = async (id) => {
    try {
        const career = await Career.findById(id);
        if (!career) throw new ServiceError('Carrera no encontrada', CareerErrorCodes.CAREER_NOT_FOUND);
        return career;
    } catch (error) {
        throw new ServiceError('Error al buscar la carrera por ID', error.code || CareerErrorCodes.CAREER_FETCH_BY_ID_FAILED);
    }
}

/* 
    in order to delete an specific row from the entity, try:
        - receive the row id from the controller
        - check if the entity already exists, throw an error if that's the case
        - use the service functions to delete the row
        - print success message
    catch:
        - get error type and print it
*/
export const deleteCareer = async (id) => {
    try {
        const careerDelete = await Career.findByIdAndDelete(id);
        if (!careerDelete) throw new ServiceError('Carrera no encontrada', CareerErrorCodes.CAREER_NOT_FOUND);
        return careerDelete;
    } catch (error) {
        throw new ServiceError('Error al eliminar la carrera', error.code || CareerErrorCodes.CAREER_DELETE_FAILED);
    }
}

