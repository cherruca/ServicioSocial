import { User } from "../models/user.model.js";
import { UserErrorCodes } from "../utils/errors/user.errorCodes.js";
import { ServiceError } from "../utils/errors/serviceError.js";

/* 
    in order to save to an entity, try:
        - get the object from the controller
        - save it in the entity
        - check the status message
    catch:
        - get error type and print it
*/
export const saveUser = async (user) => {
  const newUser = new User(user);
  try {
    const userCreated = await newUser.save();
    return userCreated;
  } catch (error) {
    console.log(error);
    throw new ServiceError(
      "Error al crear el usuario ",
      UserErrorCodes.USER_CREATION_FAILED
    );
  }
};

/* 
    in order to get all the rows from an entity, try:
        - use the entity functions to get all the rows and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const getUsers = async () => {
  try {
    // const users = await User.find().populate('administrators');
    const users = await User.find().populate('careers');
    return users;
  } catch (error) {
    throw new ServiceError(
      "Error al obtener los usuarios ",
      UserErrorCodes.USER_FETCH_FAILED
    );
  }
};

/* 
    get an specific row from an entity using its property (a string), try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user || null;
  } catch (error) {
    throw new ServiceError(
      "Error al buscar el usuario",
      UserErrorCodes.USER_SEARCH_FAILED
    );
  }
};

/* 
    to assign a foreign key to the entity, try:
        - get the foreign key and search if it's already assigned
        - if it's not assigned, push it to the array of foreign keys
        - save the changes and return success status
    catch:
        - get error type and print it
*/
export const assignCareerToUser = async (user, careerId) => {
  try {
    const existCareer = user.careers.find(
      (career) => career.toString() === careerId
    );
    if (existCareer)
      throw new ServiceError(
        "La carrera ya fue asignada al estudiante ",
        UserErrorCodes.CAREER_ALREADY_ASSIGNED
      );

    user.careers.push(careerId);
    const userUpdated = await user.save();
    return userUpdated;
  } catch (error) {
    throw new ServiceError(
      "Error al asignar la carrera al proyecto",
      error.code || UserErrorCodes.CAREER_ASSIGN_FAILED
    );
  }
};

/* 
    get an specific row from an entity using its id, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user)
      throw new ServiceError(
        "Usuario no encontrado",
        UserErrorCodes.USER_NOT_FOUND
      );
    return user;
  } catch (error) {
    throw new ServiceError(
      "Error al buscar el usuario por ID",
      error.code || UserErrorCodes.USER_FETCH_BY_ID_FAILED
    );
  }
};

/* 
    in order to delete an specific row from the entity, try:
        - receive the row id from the controller
        - check if the entity already exists, throw an error if that's the case
        - use the service functions to delete the row
        - print success message
    catch:
        - get error type and print it
*/
export const deleteUser = async (id) => {
  try {
    const userDelete = await User.findByIdAndDelete(id);
    if (!userDelete)
      throw new ServiceError(
        "Usuario no encontrado",
        UserErrorCodes.USER_NOT_FOUND
      );
    return userDelete;
  } catch (error) {
    throw new ServiceError(
      "Error al eliminar el usuario",
      error.code || UserErrorCodes.USER_DELETE_FAILED
    );
  }
};
