import { Petition } from '../models/petition.model.js'; 
import { PetitionErrorCodes } from '../utils/errors/petition.errorCodes.js'; 
import { ServiceError } from '../utils/errors/serviceError.js';

/* 
    in order to save to an entity, try:
        - get the object from the controller
        - save it in the entity
        - check the status message
    catch:
        - get error type and print it
*/
export const savePetition = async (petition) => {
    const newPetition = new Petition(petition);
    try {
        const petitionCreated = await newPetition.save();
        return petitionCreated;
    } catch (error) {
        console.log(error);
        throw new ServiceError('Error al crear la solicitud ', PetitionErrorCodes.PETITION_CREATION_FAILED);
    }
}

/* 
    in order to get all the rows from an entity, try:
        - use the entity functions to get all the rows and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const getPetitions = async () => {
    try {
        // const petitions = await Petition.find().populate('administrators');
        const petitions = await Petition.find().populate('students').populate('administrators').populate('projects');
        return petitions;
    } catch (error) {
        throw new ServiceError('Error al obtener las solicitudes ', PetitionErrorCodes.PETITION_FETCH_FAILED);
    }
}

/* 
    get an specific row from an entity using its name, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
// export const findPetitionByName = async (name) => {
//     try {
//         const petition = await Petition.findOne({ name });
//         return petition || null;
//     } catch (error) {
//         throw new ServiceError('Error al buscar la solicitud', PetitionErrorCodes.PETITION_SEARCH_FAILED);
//     }
// }

export const assignAdministratorToPetition = async (petition, administratorId) => {
    try {
        console.log("XD");
        const existAdministrator = petition.administrators.find(administrator => administrator.toString() === administratorId);

        if (existAdministrator) throw new ServiceError('El administrador ya fue asignado a la solicitud', PetitionErrorCodes.PETITION_ALREADY_ASSIGNED);

        petition.administrators.push(administratorId);
        const petitionUpdated = await petition.save();
        return petitionUpdated;
    } catch (error) {
        throw new ServiceError('Error al asignar el administrador a la solicitud', error.code|| PetitionErrorCodes.PETITION_ASSIGN_FAILED);
    }
}

/* 
    get an specific row from an entity using its id, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findPetitionById = async (id) => {
    try {
        const petition = await Petition.findById(id);
        if (!petition) throw new ServiceError('Solicitud no encontrada', PetitionErrorCodes.PETITION_NOT_FOUND);
        return petition;
    } catch (error) {
        throw new ServiceError('Error al buscar la solicitud por ID', error.code || PetitionErrorCodes.PETITION_FETCH_BY_ID_FAILED);
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
export const deletePetition = async (id) => {
    try {
        const petitionDelete = await Petition.findByIdAndDelete(id);
        if (!petitionDelete) throw new ServiceError('Solicitud no encontrada', PetitionErrorCodes.PETITION_NOT_FOUND);
        return petitionDelete;
    } catch (error) {
        throw new ServiceError('Error al eliminar la solicitud', error.code || PetitionErrorCodes.PETITION_DELETE_FAILED);
    }
}

export const unassignProjectFromPetition = async (petitionId, studentId, projectId) => {
    const petition = await Petition.findById(petitionId);
    petition.students = petition.students.filter(id => id.toString() !== studentId);
    petition.projects = petition.projects.filter(id => id.toString() !== projectId);
    await petition.save();
    return petition;
};

