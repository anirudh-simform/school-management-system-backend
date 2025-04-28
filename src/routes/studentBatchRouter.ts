import Router from "express";
import { createStudentBatchPOST } from "../controllers/studentBatch/createStudentBatch.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
const studentBatchRouter = Router();

studentBatchRouter.post("/", verifyAccessToken, createStudentBatchPOST);

export { studentBatchRouter };
