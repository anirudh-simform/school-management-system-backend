import Router from "express";
import { createStudentBatchPOST } from "../controllers/studentBatch/createStudentBatchPOST.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { getAllStudentBatchesGET } from "../controllers/studentBatch/getAllStudentBatchesGET.js";
import { updateStudentBatchPUT } from "../controllers/studentBatch/updateStudentBatch.PUT.js";
import { deleteStudentBatchDELETE } from "../controllers/studentBatch/deleteStudentBatchDELETE.js";
import { validateStudentBatch } from "../validation/validateStudentBatch.js";
const studentBatchRouter = Router();

studentBatchRouter.post(
    "/",
    verifyAccessToken,
    validateStudentBatch,
    createStudentBatchPOST
);
studentBatchRouter.get("/", verifyAccessToken, getAllStudentBatchesGET);
studentBatchRouter.put(
    "/:id",
    verifyAccessToken,
    validateStudentBatch,
    updateStudentBatchPUT
);
studentBatchRouter.delete("/:id", verifyAccessToken, deleteStudentBatchDELETE);

export { studentBatchRouter };
