import Router from "express";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";
import { createInstructorPost } from "../controllers/instructor/createInstructorPOST.js";
import { updateInstructorPUT } from "../controllers/instructor/updateInstructorPUT.js";
import { getAllInstructorsGET } from "../controllers/instructor/getAllInstructorGET.js";
import { deleteInstructorDELETE } from "../controllers/instructor/deleteInstructorDELETE.js";

const instructorRouter = Router();

instructorRouter.post("/", verifyAccessToken, createInstructorPost);
instructorRouter.put("/:id", verifyAccessToken, updateInstructorPUT);
instructorRouter.get("/", verifyAccessToken, getAllInstructorsGET);
instructorRouter.delete("/:id", verifyAccessToken, deleteInstructorDELETE);

export { instructorRouter };
