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

/*
    handle requests to the controller
    send the respective data or parameters
*/
userRouter.post("/create", createUserController);
userRouter.get("/users", getUsersController);
userRouter.get("/get/:id", getUserByIdController);
userRouter.put("/:userId/:careerId", assingCareerToUserController);
userRouter.delete("/:id", deleteUserController);
userRouter.post("/signin", getUserFromToken);

export { userRouter };
