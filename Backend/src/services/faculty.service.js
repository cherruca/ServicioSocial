/**
 * Faculty Service
 *
 * Provides faculty data access and domain rules. Controllers call into
 * these functions to keep HTTP concerns separate from persistence.
 *
 * Public functions:
 * - saveFaculty(faculty)
 * - getFaculties()
 * - findFacultyById(id)
 * - deleteFaculty(id)
 */
import { Faculty } from '../models/faculty.model.js';
import { FacultyErrorCodes } from '../utils/errors/faculty.errorCodes.js';
import { ServiceError } from '../utils/errors/serviceError.js';

/* 
    in order to save to an entity, try:
        - get the object from the controller
        - save it in the entity
        - check the status message
    catch:
        - get error type and print it
*/
export const saveFaculty = async (faculty) => {
    // console.log(faculty);
    const newFaculty = new Faculty(faculty);
    try {
        const facultyCreated = await newFaculty.save();
        return facultyCreated;
    } catch (error) {
        console.log(error);
        throw new ServiceError('Error al crear la facultad ', FacultyErrorCodes.FACULTY_CREATION_FAILED);
    }
}

/* 
    in order to get all the rows from an entity, try:
        - use the entity functions to get all the rows and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const getFaculties = async () => {
    try {
        // const faculties = await Faculty.find().populate('administrators');
        const faculties = await Faculty.find();
        return faculties;
    } catch (error) {
        throw new ServiceError('Error al obtener las facultades ', FacultyErrorCodes.FACULTY_FETCH_FAILED);
    }
}

/* 
    get an specific row from an entity using its name, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findFacultyByName = async (name) => {
    try {
        const faculty = await Faculty.findOne({ name });
        return faculty || null;
    } catch (error) {
        throw new ServiceError('Error al buscar la facultad', FacultyErrorCodes.FACULTY_SEARCH_FAILED);
    }
}

// export const assignAdministratorToFaculty = async (faculty, administratorId) => {
//     try {
//         const existAdministrator = faculty.administrators.find(administrator => administrator.toString() === administratorId);
//         if (existAdministrator) throw new ServiceError('El administrador ya fue asignado al facultad', FacultyErrorCodes.BOOK_ALREADY_ASSIGNED);

//         faculty.administrators.push(administratorId);
//         const facultyUpdated = await faculty.save();
//         return facultyUpdated;
//     } catch (error) {
//         throw new ServiceError('Error al asignar el administrador a la facultad', error.code|| FacultyErrorCodes.BOOK_ASSIGN_FAILED);
//     }
// }

/* 
    get an specific row from an entity using its id, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findFacultyById = async (id) => {
    try {
        const faculty = await Faculty.findById(id);
        if (!faculty) throw new ServiceError('Facultad no encontrada', FacultyErrorCodes.FACULTY_NOT_FOUND);
        return faculty;
    } catch (error) {
        throw new ServiceError('Error al buscar la facultad por ID', error.code || FacultyErrorCodes.FACULTY_FETCH_BY_ID_FAILED);
    }
}

// export const deleteAdministratorFromFaculty = async (administratorId) => {
//     try {
//         const updatesFaculties = await Faculty.updateMany({ administrators: administratorId }, { $pull: { administrators: administratorId } });
//         if (!updatesFaculties) throw new ServiceError('No se encontraron facultades con el administrador especificado', FacultyErrorCodes.NO_FACULTYS_FOUND);
//         return updatesFaculties;
//     } catch (error) {
//         throw new ServiceError('Error al eliminar el administrador de los facultades', error.code || FacultyErrorCodes.BOOK_DELETE_FAILED);
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
export const deleteFaculty = async (id) => {
    try {
        const facultyDelete = await Faculty.findByIdAndDelete(id);
        if (!facultyDelete) throw new ServiceError('Facultad no encontrada', FacultyErrorCodes.FACULTY_NOT_FOUND);
        return facultyDelete;
    } catch (error) {
        throw new ServiceError('Error al eliminar la facultad', error.code || FacultyErrorCodes.FACULTY_DELETE_FAILED);
    }
}

