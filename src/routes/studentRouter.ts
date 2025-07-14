import Router from "express";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { createStudentPost } from "../controllers/student/createStudentPOST.js";
import { updateStudentPUT } from "../controllers/student/updateStudentPUT.js";
import { getAllStudentsGET } from "../controllers/student/getAllStudentsGET.js";
import { deleteStudentDELETE } from "../controllers/student/deleteStudentDELETE.js";

const studentRouter = Router();

studentRouter.post("/", verifyAccessToken, createStudentPost);

studentRouter.put("/:id", verifyAccessToken, updateStudentPUT);

studentRouter.get("/", verifyAccessToken, getAllStudentsGET);
studentRouter.delete("/:id", verifyAccessToken, deleteStudentDELETE);

export { studentRouter };
