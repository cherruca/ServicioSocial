import { Router } from "express";
import {
  createStudentController,
  getStudentsController,
  assingCareerToStudentController,
  deleteStudentController,
  getStudentByIdController,
} from "../controllers/student.controller.js";

const studentRouter = Router();

/*
    handle requests to the controller
    send the respective data or parameters
*/
studentRouter.post("/create", createStudentController);
studentRouter.get("/students", getStudentsController);
studentRouter.get("/get/:id", getStudentByIdController);
studentRouter.put("/:studentId/:careerId", assingCareerToStudentController);
studentRouter.delete("/:id", deleteStudentController);

export { studentRouter };
