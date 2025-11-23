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


studentRouter.post("/create", createStudentController);

studentRouter.get("/students", getStudentsController);


studentRouter.get("/get/:id", getStudentByIdController);


studentRouter.put("/:studentId/:careerId",  assingCareerToStudentController);


studentRouter.delete("/:id", attachUserFromGoogleToken, requireAuth, deleteStudentController);

export { studentRouter };
