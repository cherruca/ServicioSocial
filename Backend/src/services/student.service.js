/**
 * Student Service
 *
 * Provides persistence and domain operations for Student entities.
 * Keep business rules here and return domain objects or throw ServiceError.
 *
 * Public functions typically used by controllers:
 * - saveStudent(student)
 * - getStudents()
 * - findStudentByEmail(email)
 * - findStudentById(id)
 * - assignCareerToStudent(student, careerId)
 * - deleteStudent(id)
 */
import { Student } from "../models/student.model.js";
import { StudentErrorCodes } from "../utils/errors/student.errorCodes.js";
import { ServiceError } from "../utils/errors/serviceError.js";

/* 
    in order to save to an entity, try:
        - get the object from the controller
        - save it in the entity
        - check the status message
    catch:
        - get error type and print it
*/
export const saveStudent = async (student) => {
  const newStudent = new Student(student);
  try {
    const studentCreated = await newStudent.save();
    return studentCreated;
  } catch (error) {
    console.log(error);
    throw new ServiceError(
      "Error al crear el estudiante ",
      StudentErrorCodes.STUDENT_CREATION_FAILED
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
export const getStudents = async () => {
  try {
    // const students = await Student.find().populate('administrators');
    const students = await Student.find().populate('careers');
    return students;
  } catch (error) {
    throw new ServiceError(
      "Error al obtener los estudiantes ",
      StudentErrorCodes.STUDENT_FETCH_FAILED
    );
  }
};

/* 
    get an specific row from an entity using its name, try:
        - use the entity functions to find the row and store it in a variable
        - return it
    catch:
        - get error type and print it
*/
export const findStudentByName = async (name) => {
  try {
    const student = await Student.findOne({ name });
    return student || null;
  } catch (error) {
    throw new ServiceError(
      "Error al buscar el estudiante",
      StudentErrorCodes.STUDENT_SEARCH_FAILED
    );
  }
};

export const findStudentByEmail = async (email) => {
  try {
    const student = await Student.findOne({ email });
    return student || null;
  } catch (error) {
    throw new ServiceError(
      "Error al buscar el estudiante por email",
      StudentErrorCodes.STUDENT_SEARCH_FAILED
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
export const assignCareerToStudent = async (student, careerId) => {
  try {
    const existCareer = student.careers.find(
      (career) => career.toString() === careerId
    );
    if (existCareer)
      throw new ServiceError(
        "La carrera ya fue asignada al estudiante ",
        StudentErrorCodes.CAREER_ALREADY_ASSIGNED
      );

    student.careers.push(careerId);
    const studentUpdated = await student.save();
    return studentUpdated;
  } catch (error) {
    throw new ServiceError(
      "Error al asignar la carrera al proyecto",
      error.code || StudentErrorCodes.CAREER_ASSIGN_FAILED
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
export const findStudentById = async (id) => {
  try {
    const student = await Student.findById(id);
    if (!student)
      throw new ServiceError(
        "Estudiante no encontrado",
        StudentErrorCodes.STUDENT_NOT_FOUND
      );
    return student;
  } catch (error) {
    throw new ServiceError(
      "Error al buscar el estudiante por ID",
      error.code || StudentErrorCodes.STUDENT_FETCH_BY_ID_FAILED
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
export const deleteStudent = async (id) => {
  try {
    const studentDelete = await Student.findByIdAndDelete(id);
    if (!studentDelete)
      throw new ServiceError(
        "Estudiante no encontrado",
        StudentErrorCodes.STUDENT_NOT_FOUND
      );
    return studentDelete;
  } catch (error) {
    throw new ServiceError(
      "Error al eliminar el estudiante",
      error.code || StudentErrorCodes.STUDENT_DELETE_FAILED
    );
  }
};
