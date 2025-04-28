import Router from "express";
import { createCoursePOST } from "../controllers/course/createCoursePOST.js";
import { verifyAccessToken } from "../authentication/verifyAccessToken.js";

const courseRouter = Router();

courseRouter.post("/", verifyAccessToken, createCoursePOST);

export { courseRouter };
