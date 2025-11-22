import { jwtDecode } from 'jwt-decode';

import {
  saveUser,
  getUsers,
  findUserById,
  assignCareerToUser,
  deleteUser,
  findUserByEmail,
} from '../services/user.service.js';

import {
  findCareerById,
  findCareerByName, // para buscar "Ingeniería Informática"
} from '../services/career.service.js';

import {
  saveStudent,
  findStudentByName,
} from '../services/student.service.js';

import { findAdministratorByName } from '../services/administrator.service.js';

import createError from 'http-errors';
import { UserErrorCodes } from '../utils/errors/user.errorCodes.js';
import { CareerErrorCodes } from '../utils/errors/career.errorCodes.js';

// =======================
// Crear usuario (endpoint normal, no Google)
// =======================
export const createUserController = async (req, res, next) => {
  try {
    const user = req.body;
    const existUser = await findUserByEmail(user.email);
    if (existUser) throw createError(400, 'El usuario ya existe');

    const userCreated = await saveUser(user);
    res.status(201).json({ message: 'User created', data: userCreated });
  } catch (e) {
    switch (e.code) {
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
};

// =======================
// Obtener todos los usuarios
// =======================
export const getUsersController = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).json({ data: users });
  } catch (e) {
    switch (e.code) {
      case UserErrorCodes.USER_FETCH_FAILED:
        next(createError(500, 'Error al obtener los usuarios'));
        break;
      default:
        next(e);
    }
  }
};

// =======================
// Obtener usuario por ID
// =======================
export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const thisUser = await findUserById(id);
    res.status(200).json({ data: thisUser });
  } catch (e) {
    switch (e.code) {
      case UserErrorCodes.USER_FETCH_FAILED:
        next(createError(500, 'Error al obtener el usuario por su ID'));
        break;
      default:
        next(e);
    }
  }
};

// =======================
// WHO AM I  (LOGIN CON GOOGLE)
// =======================
// Recibe un token de Google y hace:
// 1) Decodificar token.
// 2) Revisar si el usuario existe en "administrators":
//    - Si sí existe → role: "administrator".
// 3) Si NO es admin, revisar/crear en "students":
//    - role: "student" + carrera "Ingeniería Informática" por defecto.
export const getUserFromToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    const decoded = jwtDecode(token);
    const email = decoded.email;

    if (!email) {
      return next(createError(400, 'El token no contiene un email válido'));
    }

    const carnet =
      (email && email.includes('@') ? email.split('@')[0] : '') || '';

    const name =
      decoded.name ||
      `${decoded.given_name ?? ''} ${decoded.family_name ?? ''}`.trim() ||
      'Sin nombre';

    // 1) Verificar si ES ADMINISTRADOR
    try {
      const admin = await findAdministratorByName(name);
      if (admin) {
        return res.status(200).json({
          role: 'administrator',
          data: admin,
        });
      }
    } catch (err) {
      console.error('Error buscando administrador por nombre:', err);
      // No rompemos el login, seguimos como estudiante
    }

    // 2) Si NO es admin, revisar/crear en STUDENTS
    let thisStudent = await findStudentByName(name);

    if (!thisStudent) {
      let defaultCareerId = null;

      try {
        const defaultCareer = await findCareerByName('Ingeniería Informática');
        if (defaultCareer) {
          defaultCareerId = defaultCareer._id;
        } else {
          console.warn(
            'Advertencia: no se encontró la carrera "Ingeniería Informática" en la colección careers.'
          );
        }
      } catch (err) {
        console.error('Error buscando la carrera por nombre:', err);
      }

      const newStudent = {
        carnet,
        name,
        email,
        hours: 0,
        careers: defaultCareerId ? [defaultCareerId] : [],
      };

      thisStudent = await saveStudent(newStudent);
    }

    // Respuesta para estudiantes
    return res.status(200).json({
      role: 'student',
      data: thisStudent,
    });
  } catch (e) {
    console.error('Error en getUserFromToken (students/admins):', e);
    next(
      createError(
        500,
        'Error al obtener o crear el usuario a través del token'
      )
    );
  }
};


export const assingCareerToUserController = async (req, res, next) => {
  try {
    const { userId, careerId } = req.params;

    const user = await findUserById(userId);

    await findCareerById(careerId);

    const userUpdated = await assignCareerToUser(user, careerId);
    res
      .status(200)
      .json({ message: 'Carrera asignada al usuario', data: userUpdated });
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
};

// =======================
// Eliminar usuario
// =======================
export const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    await findUserById(id);
    await deleteUser(id);

    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (e) {
    switch (e.code) {
      case UserErrorCodes.USER_NOT_FOUND:
        next(createError(404, 'El usuario no existe'));
        break;
      case UserErrorCodes.USER_FETCH_BY_ID_FAILED:
        next(createError(500, 'Error al buscar el usuario por ID'));
        break;
      case UserErrorCodes.USER_DELETE_FAILED:
        next(createError(500, 'Error al eliminar el usuario'));
        break;
      default:
        next(e);
    }
  }
};
