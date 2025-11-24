import { Router } from "express";
import attachUserFromGoogleToken, { requireAuth } from "../middleware/auth.middleware.js";
import {
  createStudentController,
  getStudentsController,
  assingCareerToStudentController,
  deleteStudentController,
  getStudentByIdController,
} from "../controllers/student.controller.js";

const studentRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: Student
 *     description: Student management
 */
/**
 * @openapi
 * /student/create:
 *   post:
 *     tags: [Student]
 *     summary: Create a student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Student created
 */
studentRouter.post("/create", createStudentController);

/**
 * @openapi
 * /student/students:
 *   get:
 *     tags: [Student]
 *     summary: Get all students
 *     responses:
 *       200:
 *         description: List of students
 */
studentRouter.get("/students", getStudentsController);

/**
 * @openapi
 * /student/get/{id}:
 *   get:
 *     tags: [Student]
 *     summary: Get student by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student object
 */
studentRouter.get("/get/:id", getStudentByIdController);

/**
 * @openapi
 * /student/{studentId}/{careerId}:
 *   put:
 *     tags: [Student]
 *     summary: Assign career to student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *       - in: path
 *         name: careerId
 *         required: true
 *     responses:
 *       200:
 *         description: Assigned
 */
studentRouter.put("/:studentId/:careerId",  assingCareerToStudentController);

/**
 * @openapi
 * /student/{id}:
 *   delete:
 *     tags: [Student]
 *     summary: Delete a student (protected)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted
 */
studentRouter.delete("/:id", attachUserFromGoogleToken, requireAuth, deleteStudentController);

export { studentRouter };
