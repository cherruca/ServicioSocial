/**
 * User Controller
 *
 * Contains controllers that orchestrate requests for User entities.
 * Each controller delegates persistence to `user.service.js` and
 * maps service errors to HTTP responses.
 *
 * Exported functions:
 * - createUserController(req, res, next)
 * - getUsersController(req, res, next)
 * - getUserByIdController(req, res, next)
 * - getUserFromToken(req, res, next)
 * - assingCareerToUserController(req, res, next)
 * - deleteUserController(req, res, next)
 */

import { jwtDecode } from 'jwt-decode'; 

import {
  saveUser,
  getUsers,
  findUserById,
  assignCareerToUser,
  deleteUser,
  findUserByEmail,
} from "../services/user.service.js";
import { findStudentByEmail } from "../services/student.service.js";
import {
  findCareerById,
  // deleteUserFromCareer
} from "../services/career.service.js";

import createError from "http-errors";
import { UserErrorCodes } from "../utils/errors/user.errorCodes.js";
import { CareerErrorCodes } from "../utils/errors/career.errorCodes.js";

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
    const existUser = await findUserByEmail(user.email);
    if (existUser) throw createError(400, "El usuario ya existe");

    const userCreated = await saveUser(user);
    res.status(201).json({ message: "User created", data: userCreated });
  } catch (e) {
    switch (e.code) {
      case UserErrorCodes.USER_NOT_FOUND:
        next(createError(404, "El usuario no existe"));
        break;
      case UserErrorCodes.USER_SEARCH_FAILED:
        next(createError(500, "Error al buscar el usuario"));
        break;
      default:
        next(e);
    }
  }
};

/**
 * @openapi
 * /user/create:
 *   post:
 *     tags: [User]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 */

/* 
    in order to get all the rows from an entity try:
        - use the service functions to get all the rows and store it in a variable
        - return it in JSON format
    catch:
        - get error type and print it
*/
export const getUsersController = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).json({ data: users });
  } catch (e) {
    switch (e.code) {
      case UserErrorCodes.USER_FETCH_FAILED:
        next(createError(500, "Error al obtener los usuarios"));
        break;
      default:
        next(e);
    }
  }
};

/**
 * @openapi
 * /user/users:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */

/* 
    get one the rows from an entity by the ID, try:
        - use the service functions to get all the rows and store it in a variable
        - return it in JSON format
    catch:
        - get error type and print it
*/
export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const thisUser = await findUserById(id);
    res.status(200).json({ data: thisUser });
  } catch (e) {
    switch (e.code) {
      case UserErrorCodes.USER_FETCH_FAILED:
        next(createError(500, "Error al obtener el usuario por su ID"));
        break;
      default:
        next(e);
    }
  }
};

/**
 * @openapi
 * /user/get/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */


/*
    receive a token and decode it to get the email and verify if exists in the database
*/
export const getUserFromToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Dynamically import `jwt-decode` to handle ESM/CJS interop reliably.
    let decoded = null;
    try {
      const jwtModule = await import("jwt-decode");
      const decodeFn = jwtModule && (jwtModule.default ?? jwtModule);
      if (typeof decodeFn === "function") {
        decoded = decodeFn(token);
      } else {
        // If for some reason decode isn't available, fall back to null and let later code fail with 400.
        decoded = null;
      }
    } catch (err) {
      console.warn(
        "[getUserFromToken] dynamic import of jwt-decode failed:",
        err && err.message ? err.message : err
      );
      decoded = null;
    }

    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const email = decoded.email;

    // Prefer a persistent User record (this allows admins created as Users to be recognized),
    // otherwise fall back to Student records for UCA accounts.
    const thisUser = await findUserByEmail(email);
    if (thisUser) {
      // Normalize role values so frontend can consistently detect administrators.
      const rawRole = thisUser.role || "student";
      const normalizedRole =
        typeof rawRole === "string" && rawRole.toLowerCase().includes("admin")
          ? "administrator"
          : rawRole;
      console.log(
        `[getUserFromToken] found user email=${email} role=${rawRole} -> normalized=${normalizedRole}`
      );
      return res.status(200).json({ role: normalizedRole, data: thisUser });
    }

    // Try student collection as fallback
    const thisStudent = await findStudentByEmail(email);
    if (thisStudent) {
      // Normalize student role: if role is 'admin', return 'administrator' for frontend.
      // Default to 'student' if role is missing (for docs created before role field existed).
      let studentRole = thisStudent.role;
      if (!studentRole) {
        console.warn(
          `[getUserFromToken] student ${email} has no role field, defaulting to 'student'`
        );
        studentRole = "student";
      }
      const normalizedRole =
        typeof studentRole === "string" &&
        studentRole.toLowerCase().includes("admin")
          ? "administrator"
          : studentRole;
      console.log(
        `[getUserFromToken] found student email=${email} role=${studentRole} -> normalized=${normalizedRole}`
      );
      return res.status(200).json({ role: normalizedRole, data: thisStudent });
    }

    return res.status(404).json({ message: "Usuario no encontrado" });
  } catch (e) {
    switch (e.code) {
      case UserErrorCodes.USER_FETCH_FAILED:
        next(
          createError(500, "Error al obtener el usuario a través del token")
        );
        break;
      default:
        next(e);
    }
  }
};


/**
 * @openapi
 * /user/signin:
 *   post:
 *     tags: [User]
 *     summary: Sign in a user using token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signed-in user
 */

export const assingCareerToUserController = async (req, res, next) => {
  try {
    const { userId, careerId } = req.params;

    const user = await findUserById(userId);

    await findCareerById(careerId);

    const userUpdated = await assignCareerToUser(user, careerId);
    res
      .status(200)
      .json({ message: "Carrera asignada al usuario", data: userUpdated });
  } catch (e) {
    switch (e.code) {
      case UserErrorCodes.USER_NOT_FOUND:
        next(createError(404, "El usuario no existe"));
        break;
      case UserErrorCodes.USER_FETCH_BY_ID_FAILED:
        next(createError(500, "Error al buscar el usuario por ID"));
        break;
      case CareerErrorCodes.CAREER_NOT_FOUND:
        next(createError(404, "El carrera no existe"));
        break;
      case CareerErrorCodes.CAREER_FETCH_FAILED:
        next(createError(500, "Error al obtener los carreras"));
        break;
      case CareerErrorCodes.USER_ALREADY_ASSIGNED:
        next(createError(400, "El carrera ya fue asignada al usuario"));
        break;
      case CareerErrorCodes.USER_ASSIGN_FAILED:
        next(createError(500, "Error al asignar el usuario a la carrera"));
        break;
      default:
        next(e);
    }
  }
};

/**
 * @openapi
 * /user/{userId}/{careerId}:
 *   put:
 *     tags: [User]
 *     summary: Assign a career to a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: careerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment result
 */

/* 
    in order to delete an specific row from the entity try this:
        - get the row id from the parameter in the request
        - check if the entity already exists, throw an error if that's the case
        - use the service functions to delete the row
        - print success message
    catch:
        - get error type and print it
*/
export const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    await findUserById(id);

    // await deleteUserFromCareer(id);

    await deleteUser(id);
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (e) {
    switch (e.code) {
      case UserErrorCodes.USER_NOT_FOUND:
        next(createError(404, "El usuario no existe"));
        break;
      case UserErrorCodes.USER_FETCH_BY_ID_FAILED:
        next(createError(500, "Error al buscar el usuario por ID"));
        break;
      case UserErrorCodes.USER_DELETE_FAILED:
        next(createError(500, "Error al eliminar el usuario"));
        break;
      // case CareerErrorCodes.USER_REMOVAL_FAILED:
      //     next(createError(500, 'Error al eliminar el carrera de los usuarios'));
      //     break;
      default:
        next(e);
    }
  }
};

/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
