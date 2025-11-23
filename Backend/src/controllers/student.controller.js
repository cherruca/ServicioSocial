import {
    saveStudent,
    getStudents,
    findStudentById,
    assignCareerToStudent,
    deleteStudent,
    findStudentByName
} from '../services/student.service.js';
import {
   findCareerById
    // deleteStudentFromCareer
} from '../services/career.service.js';

import createError from 'http-errors';
import {StudentErrorCodes} from '../utils/errors/student.errorCodes.js';
import { CareerErrorCodes } from '../utils/errors/career.errorCodes.js';

/* 
    in order to save to an entity try:
        - store the request body and use the service functions for the process
        - check if the entity already exists, throw an error if that's the case
        - save the entity and print success message
    catch:
        - get error type and print it
*/
export const createStudentController = async (req, res, next) => {
    try {
        const student = req.body;
        const existStudent= await findStudentByName(student.name);
        if(existStudent) throw createError(400, 'El estudiante ya existe');

        const studentCreated = await saveStudent(student);
        res.status(201).json({ message: 'Student created', data: studentCreated });
    } catch (e) {
        switch(e.code)
        {
            case StudentErrorCodes.STUDENT_NOT_FOUND:
                next(createError(404, 'El estudiante no existe'));
                break;
            case StudentErrorCodes.STUDENT_SEARCH_FAILED:
                next(createError(500, 'Error al buscar el estudiante'));
                break;
            default:
                next(e);
        }
    }
}


export const getStudentsController = async (req, res, next) => {
    try {
        const students = await getStudents();
        res.status(200).json({ data: students });
    } catch (e) {
        switch(e.code){
            case StudentErrorCodes.STUDENT_FETCH_FAILED:
                next(createError(500, 'Error al obtener los estudiantes'));
                break;
            default:
                next(e);
        }
    }
}


export const getStudentByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const thisStudent = await findStudentById(id);
        res.status(200).json({ data: thisStudent });
    } catch (e) {
        switch(e.code){
            case StudentErrorCodes.STUDENT_FETCH_FAILED:
                next(createError(500, 'Error al obtener el estudiante por su ID'));
                break;
            default:
                next(e);
        }
    }
}


export const assingCareerToStudentController = async (req, res, next) => {
    try {
        const { studentId, careerId  } = req.params;

        const student = await findStudentById(studentId);

        await findCareerById(careerId);

        const studentUpdated = await assignCareerToStudent(student, careerId);
        res.status(200).json({ message: 'Carrera asignada al estudiante', data: studentUpdated });
    } catch (e) {
        switch (e.code) {
            case StudentErrorCodes.STUDENT_NOT_FOUND:
                next(createError(404, 'El estudiante no existe'));
                break;
            case StudentErrorCodes.STUDENT_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar el estudiante por ID'));
                break;
            case CareerErrorCodes.CAREER_NOT_FOUND:
                next(createError(404, 'El carrera no existe'));
                break;
            case CareerErrorCodes.CAREER_FETCH_FAILED:
                next(createError(500, 'Error al obtener los carreras'));
                break;
            case CareerErrorCodes.STUDENT_ALREADY_ASSIGNED:
                next(createError(400, 'El carrera ya fue asignada al estudiante'));
                break;
            case CareerErrorCodes.STUDENT_ASSIGN_FAILED:
                next(createError(500, 'Error al asignar el estudiante a la carrera'));
                break;
            default:
                next(e);
        }
    }
}


export const deleteStudentController = async (req, res, next) => {
    try {
        const { id } = req.params

        await findStudentById(id);

        // await deleteStudentFromCareer(id);

        await deleteStudent(id);
        res.status(200).json({ message: 'Estudiante eliminado' })
    } catch (e) {
        switch(e.code){
            case StudentErrorCodes.STUDENT_NOT_FOUND:
                next(createError(404, 'El estudiante no existe'));
                break;
            case StudentErrorCodes.STUDENT_FETCH_BY_ID_FAILED:
                next(createError(500, 'Error al buscar el estudiante por ID'));
                break;
            case StudentErrorCodes.STUDENT_DELETE_FAILED:
                next(createError(500, 'Error al eliminar el estudiante'));
                break;
            // case CareerErrorCodes.STUDENT_REMOVAL_FAILED:
            //     next(createError(500, 'Error al eliminar el carrera de los estudiantees'));
            //     break;
            default:
                next(e);
        }
    }
}

