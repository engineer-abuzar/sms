import { Router } from "express";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

const router = Router();

router.post("/register", createStudent);
router.get("/students", getStudents);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);

export default router;
