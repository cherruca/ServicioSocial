import { Router } from "express";
import {
  createUserController,
  getUsersController,
  assingCareerToUserController,
  deleteUserController,
  getUserByIdController,
  getUserFromToken
} from "../controllers/user.controller.js";

const userRouter = Router();

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User management endpoints
 */
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
 *             type: object
 *     responses:
 *       201:
 *         description: User created
 */
userRouter.post("/create", createUserController);

/**
 * @openapi
 * /user/users:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
userRouter.get("/users", getUsersController);

/**
 * @openapi
 * /user/get/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get a user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 */
userRouter.get("/get/:id", getUserByIdController);

/**
 * @openapi
 * /user/{userId}/{careerId}:
 *   put:
 *     tags: [User]
 *     summary: Assign career to user
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
userRouter.put("/:userId/:careerId", assingCareerToUserController);

/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete a user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
userRouter.delete("/:id", deleteUserController);

/**
 * @openapi
 * /user/signin:
 *   post:
 *     tags: [User]
 *     summary: Sign in user via token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Signed in
 */
userRouter.post("/signin", getUserFromToken);

export { userRouter };
