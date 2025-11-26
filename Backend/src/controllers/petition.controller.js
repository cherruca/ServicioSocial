/**
 * Petition Controller
 *
 * Manages petition and enrollment flows. Keeps controllers lightweight
 * by delegating data operations to `petition.service.js` and related services.
 *
 * Exported functions:
 * - createPetitionController
 * - getPetitionsController
 * - deletePetitionController
 * - getPetitionByIdController
 * - enrollProjectController
 * - unassignProjectFromPetitionController
 * - isEnrolledController
 */
import {
    savePetition,
    getPetitions,
    findPetitionById,
    deletePetition,
    findPetitionByStudentAndProject,
    unassignProjectFromPetition,
    getPetitionsByStudentId
} from '../services/petition.service.js';
import {
    findAdministratorById
    // deleteProjectFromAdministrator
} from '../services/administrator.service.js';

import createError from 'http-errors';
import {PetitionErrorCodes} from '../utils/errors/petition.errorCodes.js';
import { AdministratorErrorCodes } from '../utils/errors/administrator.errorCodes.js';
import { Petition } from '../models/petition.model.js';
import { Project } from '../models/project.model.js';
import { findAdministratorByEmail } from '../services/administrator.service.js';


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

/**
 * @openapi
 * /petition/create:
 *   post:
 *     tags: [Petition]
 *     summary: Create a petition
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Petition'
 *     responses:
 *       201:
 *         description: Petition created
 */

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

export const getMyPetitionsController = async (req, res, next) => {
    try {
        // req.user is attached by attachUserFromGoogleToken middleware
        const email = req.user && req.user.email;
        if (!email) return res.status(200).json({ data: [] });

        // find student by email
        const { findStudentByEmail } = await import('../services/student.service.js');
        const student = await findStudentByEmail(email);
        if (!student) return res.status(200).json({ data: [] });

        const petitions = await getPetitionsByStudentId(student._id);
        return res.status(200).json({ data: petitions });
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /petition/petitions:
 *   get:
 *     tags: [Petition]
 *     summary: Get all petitions
 *     responses:
 *       200:
 *         description: List of petitions
 */

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

/**
 * @openapi
 * /petition/{id}:
 *   get:
 *     tags: [Petition]
 *     summary: Get a petition by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Petition object
 */

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
        // Deprecated: petitions no longer store assigned administrators.
        // Administrators have global access and can act on any petition.
        return res.status(400).json({ message: 'Operation not supported: petitions do not store assigned administrators' });
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

/**
 * @openapi
 * /petition/{petitionId}/{administratorId}:
 *   put:
 *     tags: [Petition]
 *     summary: Assign an administrator to a petition (protected)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petitionId
 *         required: true
 *       - in: path
 *         name: administratorId
 *         required: true
 *     responses:
 *       200:
 *         description: Assignment result
 */

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

/**
 * @openapi
 * /petition/{id}:
 *   delete:
 *     tags: [Petition]
 *     summary: Delete a petition
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */

/* 
    controller to enroll a student to a project:
        - validate data
        - prevent duplicate enrollments
        - create a new petition
*/
export const enrollProjectController = async (req, res, next) => {
    try {
        const { studentId, projectId } = req.body;

        if (!studentId || !projectId) {
            return next(createError(400, "Datos incompletos"));
        }

        // verificar si ya existe una solicitud igual
        const existing = await Petition.findOne({
            students: studentId,
            projects: projectId
        });

        if (existing) {
            return next(createError(400, "Ya enviaste una solicitud para este proyecto"));
        }

        const petitionData = {
            date: Date.now(),
            status: 'pending', // pendiente
            students: [studentId],
            projects: [projectId]
        };

        const created = await savePetition(petitionData);

        res.status(201).json({
            message: "Solicitud enviada correctamente",
            data: created
        });

    } catch (e) {
        next(createError(500, "Error al inscribirse al proyecto"));
    }
};

/**
 * @openapi
 * /petition/enroll:
 *   post:
 *     tags: [Petition]
 *     summary: Enroll a student to a project (creates a petition)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Petition created
 */

export const unassignProjectFromPetitionController = async (req, res, next) => {
    try {
        const { studentId, projectId } = req.params;

        const petition = await findPetitionByStudentAndProject(studentId, projectId);
        if (!petition) throw createError(404, "La inscripción no existe");

        await unassignProjectFromPetition(petition._id, studentId, projectId);

        res.status(200).json({ message: "Inscripción eliminada correctamente" });
    } catch (e) {
        next(e);
    }
};

/**
 * @openapi
 * /petition/unassign/{studentId}/{projectId}:
 *   delete:
 *     tags: [Petition]
 *     summary: Unassign a project from a petition
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *       - in: path
 *         name: projectId
 *         required: true
 *     responses:
 *       200:
 *         description: Unassigned
 */

export const isEnrolledController = async (req, res, next) => {
    try {
        const { studentId, projectId } = req.params;

        const petition = await findPetitionByStudentAndProject(studentId, projectId);

        res.status(200).json({
            enrolled: !!petition
        });

    } catch (e) {
        next(e);
    }
};

/**
 * Approve a pending petition: atomically add student to project (if capacity),
 * decrement capacity, and mark petition approved by admin.
 */
export const approvePetitionController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const petition = await findPetitionById(id);
        if (!petition) return next(createError(404, 'La solicitud no existe'));
        if (petition.status !== 'pending') return next(createError(400, 'La solicitud no está pendiente'));

        const studentId = petition.students[0];
        const projectId = petition.projects[0];

        // Atomic update: only succeed if capacity > 0 and student not already in students
        const updatedProject = await Project.findOneAndUpdate(
            { _id: projectId, capacity: { $gt: 0 }, students: { $ne: studentId } },
            { $inc: { capacity: -1 }, $addToSet: { students: studentId } },
            { new: true }
        );

        if (!updatedProject) {
            return next(createError(400, 'Capacidad insuficiente o el estudiante ya está inscrito'));
        }

        // mark approved
        petition.status = 'approved';
        petition.approvedAt = new Date();
        await petition.save();

        res.status(200).json({ message: 'Solicitud aprobada', data: { petition, project: updatedProject } });
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /petition/{id}/approve:
 *   patch:
 *     tags: [Petition]
 *     summary: Approve a petition (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Petition approved
 */

/**
 * Reject a pending petition: mark petition rejected and optionally record reason.
 */
export const rejectPetitionController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};
        const petition = await findPetitionById(id);
        if (!petition) return next(createError(404, 'La solicitud no existe'));
        if (petition.status !== 'pending') return next(createError(400, 'La solicitud no está pendiente'));

        petition.status = 'rejected';
        petition.approvedAt = new Date();
        petition.rejectionReason = reason || '';
        await petition.save();

        res.status(200).json({ message: 'Solicitud rechazada', data: petition });
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /petition/{id}/reject:
 *   patch:
 *     tags: [Petition]
 *     summary: Reject a petition (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Petition rejected
 */

/**
 * @openapi
 * /petition/isEnrolled/{studentId}/{projectId}:
 *   get:
 *     tags: [Petition]
 *     summary: Check if a student is enrolled in a project
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *       - in: path
 *         name: projectId
 *         required: true
 *     responses:
 *       200:
 *         description: Enrollment status
 */



